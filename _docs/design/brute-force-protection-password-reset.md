# Design Document: Brute-Force Protection for Password Recovery

## 1. Problem Statement

The current `/verify-password-reset` endpoint is vulnerable to brute-force attacks. Since there is no limit on the number of attempts to enter the 6-digit verification code, an attacker can iterate through all possible combinations (000000 to 999999) in a short period to gain unauthorized access to any user account.

### Attack Scenario

1. Attacker chooses a user by email in the system
2. Attacker starts restore-password process by inserting this email
3. Attacker receives or extracts token from database
4. Attacker starts a script that sends previously received token and codes from 000000 to 999999 (all possible combinations) until receiving success response
5. Once successful, attacker inserts new password and steals user account

**Time Estimate**: With automated requests, this attack could succeed in minutes rather than hours.

## 2. Proposed Solution

Implement an attempt counter for each password reset session. Once a user (or attacker) reaches a predefined limit of failed attempts, the reset token will be invalidated, forcing the process to start over.

### Key Principles

- **Attempt Tracking**: Each password reset token tracks the number of failed verification attempts
- **Configurable Limit**: Maximum attempts are configurable via environment variables
- **Automatic Invalidation**: When limit is reached, the token is permanently deleted
- **User Feedback**: Users receive clear feedback about remaining attempts
- **Recovery Path**: Legitimate users can request a new code if they exhaust attempts

## 3. Database Changes

### Schema Update

Update the `PasswordReset` table to include a new column:

**Field**: `attemptsCount`  
**Type**: `Int`  
**Default Value**: `0`  
**Description**: Tracks the number of failed verification attempts for a specific token.

### Migration

```prisma
model PasswordReset {
  id              Int       @default(autoincrement()) @id
  userId          Int
  user            User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  token           String    @unique
  code            String
  verified        Boolean   @default(false)
  attemptsCount   Int       @default(0)  // NEW FIELD
  createdAt       DateTime  @default(now())
  updatedAt       DateTime  @updatedAt

  @@index([token])
  @@index([userId])
}
```

### Database Considerations

- **Atomic Increment**: The increment of `attemptsCount` must be handled atomically to prevent race conditions in concurrent request scenarios
- **Index**: No additional index needed (existing token index is sufficient)
- **Default Value**: New records start with `attemptsCount = 0`

## 4. Configuration

### Environment Variable

Introduce a new Environment Variable to ensure flexibility across different environments (Dev, Staging, Prod):

**Variable Name**: `MAX_PASSWORD_RESET_ATTEMPTS`  
**Default Value**: `5`  
**Type**: Integer  
**Description**: Maximum number of failed verification attempts allowed per password reset token

### Configuration Implementation

Add to `ServicesConfigs` class in `libs/configs/src/lib/services-configs.ts`:

```typescript
MAX_PASSWORD_RESET_ATTEMPTS: process.env['MAX_PASSWORD_RESET_ATTEMPTS'] 
  ? parseInt(process.env['MAX_PASSWORD_RESET_ATTEMPTS'], 10) 
  : 5
```

### Environment Files

Update environment files (`.env.dev`, `.env.api-int-tests`, production):

```env
MAX_PASSWORD_RESET_ATTEMPTS=5
```

## 5. Updated Logic for `/verify-password-reset` Endpoint

### Request Flow

When a request is received at `POST /api/v1/auth/verify-password-reset`, the server should perform the following sequence:

#### Step 1: Fetch Record
- Retrieve the reset entry from the database using the provided token
- If record not found → Return `401 Unauthorized`: "Invalid or expired token. Please start the password reset process again."

#### Step 2: Check Token Expiration
- Calculate token age: `Date.now() - passwordReset.createdAt.getTime()`
- If token age > 1 hour (3600000 ms):
  - Delete the reset record from the database
  - Return `401 Unauthorized`: "Invalid or expired token. Please start the password reset process again."

#### Step 3: Check Attempt Limit
- If `attemptsCount >= MAX_PASSWORD_RESET_ATTEMPTS`:
  - **Action**: Delete the reset record from the database (atomic operation)
  - **Response**: `429 Too Many Requests` (or `403 Forbidden` as alternative)
  - **Message**: "Maximum attempts exceeded. Please request a new password reset email."

#### Step 4: Validate Code
- **If Code is INCORRECT**:
  - **Action**: Atomically increment `attemptsCount` by 1 in the database
  - **Response**: `400 Bad Request`
  - **Message**: "Invalid code. Remaining attempts: {MAX_PASSWORD_RESET_ATTEMPTS - attemptsCount}."
  - **Note**: After increment, if `attemptsCount >= MAX_PASSWORD_RESET_ATTEMPTS`, delete the record
  
- **If Code is CORRECT**:
  - **Action**: Mark token as verified (`verified = true`)
  - **Response**: `200 OK`
  - **Message**: "Verification code verified successfully"
  - **Note**: Do NOT reset `attemptsCount` on success (for audit purposes)

### Implementation Details

#### Atomic Operations

To prevent race conditions, use Prisma's atomic update operations:

```typescript
// Increment attempts atomically
await this.modelsService.passwordReset.update({
  where: { id: passwordReset.id },
  data: {
    attemptsCount: { increment: 1 }
  }
});

// Check and delete atomically (if needed)
await this.modelsService.passwordReset.updateMany({
  where: {
    id: passwordReset.id,
    attemptsCount: { gte: maxAttempts }
  },
  data: {
    // This will be handled by delete operation
  }
});
```

#### Error Response Format

```typescript
// When attempts exceeded
{
  statusCode: 429,
  message: "Maximum attempts exceeded. Please request a new password reset email.",
  remainingAttempts: 0
}

// When code is invalid (but attempts remaining)
{
  statusCode: 400,
  message: "Invalid code. Remaining attempts: 3.",
  remainingAttempts: 3
}
```

## 6. Edge Case Handling

### Session Expiration
- **Scenario**: User exhausts attempts, record is deleted
- **Solution**: User must start over by requesting a new password reset email
- **Security Benefit**: Forces attacker to generate new token and new random 6-digit code, making brute-force attack mathematically unfeasible

### Concurrent Requests
- **Scenario**: Multiple requests arrive simultaneously with same token
- **Solution**: Use database atomic increment operations to prevent race conditions
- **Implementation**: Prisma's `increment` operation ensures thread-safe counter updates

### Token Already Verified
- **Scenario**: Token is already verified but user tries to verify again
- **Current Behavior**: Should return success (idempotent operation)
- **Note**: This behavior remains unchanged

### Expired Token with Attempts
- **Scenario**: Token expires but user has remaining attempts
- **Solution**: Expiration check happens before attempt check, expired tokens are deleted regardless of attempts

## 7. UI/UX Strategy for Failed Attempts

### Feedback Mechanism

**After Each Failed Attempt:**
- Display warning message: "Invalid code. {N} attempts left."
- Show remaining attempts count prominently
- Highlight the code input field with error state
- Keep form functional to allow retry

**When Limit Reached:**
- Disable the code input field
- Disable the submit button
- Display clear error message: "Maximum attempts exceeded. This recovery session has been invalidated for security reasons."
- Show "Request New Code" button prominently

### Recovery Path

**"Request New Code" Button:**
- **Action**: Redirect user back to Step 1 (Email Entry)
- **Behavior**: Clear current form state and localStorage
- **User Flow**: User can immediately request a new password reset email
- **Security**: Legitimate user can try again, attacker must start over with new token

### State Cleanup

**Frontend:**
- Remove `password_reset_token` from localStorage when limit is reached
- Clear form state
- Reset to Step 1

**Backend:**
- Delete PasswordReset record from database
- Ensure token cannot be reused

## 8. API Response Updates

### Success Response (200 OK)
```json
{
  "message": "Verification code verified successfully",
  "success": true
}
```

### Invalid Code - Attempts Remaining (400 Bad Request)
```json
{
  "statusCode": 400,
  "message": "Invalid code. Remaining attempts: 3.",
  "remainingAttempts": 3
}
```

### Maximum Attempts Exceeded (429 Too Many Requests)
```json
{
  "statusCode": 429,
  "message": "Maximum attempts exceeded. Please request a new password reset email.",
  "remainingAttempts": 0
}
```

### Invalid/Expired Token (401 Unauthorized)
```json
{
  "statusCode": 401,
  "message": "Invalid or expired token. Please start the password reset process again."
}
```

## 9. Security Considerations

### Attack Mitigation

1. **Brute-Force Prevention**: Limits make brute-force attacks impractical
2. **Token Invalidation**: Deleted tokens cannot be reused
3. **Rate Limiting**: Consider adding rate limiting at API gateway level (future enhancement)
4. **Audit Trail**: `attemptsCount` provides audit information

### Legitimate User Impact

- **Minimal Impact**: Legitimate users typically enter code correctly on first or second attempt
- **Recovery Path**: Clear path to request new code if needed
- **User Education**: Error messages guide users on next steps

## 10. Testing Considerations

### Test Cases to Cover

1. **Successful Verification**: Code correct on first attempt
2. **Failed Attempts**: Increment counter correctly
3. **Remaining Attempts**: Display correct count in error messages
4. **Limit Reached**: Token deleted, appropriate error returned
5. **Concurrent Requests**: Race condition handling
6. **Expired Token**: Expiration check before attempt check
7. **Already Verified**: Idempotent behavior
8. **Invalid Token**: Proper error handling

### Integration Tests

- Test full flow: Request → Multiple Failed Attempts → Limit Reached → New Request
- Test concurrent requests with same token
- Test database atomic operations

## 11. Migration Strategy

### Database Migration

1. Add `attemptsCount` column with default value `0`
2. Existing records will have `attemptsCount = 0` (safe default)
3. No data migration needed

### Deployment

1. Deploy database migration first
2. Deploy backend code with attempt tracking
3. Deploy frontend updates for error handling
4. Monitor for any issues

## 12. Future Enhancements

### Potential Improvements

1. **Rate Limiting**: Add API-level rate limiting per IP address
2. **Exponential Backoff**: Increase delay between attempts
3. **Email Notifications**: Notify user when attempts are exhausted
4. **Account Lockout**: Temporary account lockout after multiple reset attempts
5. **CAPTCHA**: Add CAPTCHA after N failed attempts

## 13. Documentation Updates Required

1. **API Documentation**: Update `/verify-password-reset` endpoint documentation
2. **Feature Documentation**: Update restore password process documentation
3. **Error Codes**: Document new 429 status code
4. **Environment Variables**: Document `MAX_PASSWORD_RESET_ATTEMPTS`

---

## Summary

This design implements brute-force protection by:
- Tracking failed attempts per token
- Enforcing configurable attempt limits
- Invalidating tokens when limits are exceeded
- Providing clear user feedback and recovery paths
- Maintaining security while minimizing impact on legitimate users

The solution is simple, effective, and follows security best practices for password recovery systems.

