# Restore Password Process - Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [Step-by-Step Breakdown](#step-by-step-breakdown)
   - [Step 1: Email Entry](#step-1-email-entry)
   - [Step 2: Verification Code](#step-2-verification-code)
   - [Step 3: New Password](#step-3-new-password)
4. [References](#references)

---

## Overview

The Restore Password process is a multi-step flow that allows users who have forgotten their password to reset it securely. The process is divided into 3 distinct steps: email entry, verification code confirmation, and new password setup.

### Key Features
- Multi-step form with progress indication
- Email verification for security
- Secure password reset flow
- Brute-force protection with attempt limits
- Form validation and error handling
- Light/dark theme support
- Responsive design
- Token-based authentication for password reset

### User Goals
- Reset forgotten password securely
- Verify email ownership before password change
- Set a new password that meets security requirements
- Complete the process quickly and easily

---

## User Flow

### High-Level Flow
```
Step 1: Email Entry
    ↓
Step 2: Verification Code
    ↓
Step 3: New Password
    ↓
Password Reset Complete → Redirect to Login Page
```

### Navigation Flow
- Users can navigate forward using "Next" or action buttons
- Users can navigate backward using "Back" button (available from Step 2 onwards)
- Progress bar shows current step (1 of 3, 2 of 3, 3 of 3)
- Users can see which step they are on at all times
- Users can navigate to sign-in page from any step

---

## Step-by-Step Breakdown

### Step 1: Email Entry

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 1 of 3"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Email** - Text input field with label, placeholder "Enter your email" (required, marked with *, email format validation)

**Actions:**
- **Send me code on email** button - Primary button, positioned at the bottom of the form, full width of the form

**Navigation Links:**
- **Back to Sign In** - Text button link (optional, may be displayed)
  - "Back to Sign In" - Navigates to sign-in page

**User Interaction:**
- User enters email address (must be valid email format)
- User clicks "Send me code on email" to request password reset code
- Validation errors display below field if email is empty or invalid
- Field with validation error is highlighted (error state with red border)
- "Send me code on email" button becomes inactive after unsuccessful validation attempt until email field is valid
- After successful submission, user is navigated to Step 2
- If email is not found in system, form level error is displayed and user remains on Step 1

#### Technical Implementation

**State Management:**
- Email is stored in application state
- localStorage is NOT used for email field due to security reasons
- Token received from password reset request response is stored in localStorage and application state for verification in Step 2
- On page reload, email data cannot be restored and user must input email again

**Validation Flow:**
- When "Send me code on email" button is pressed, email field is validated using the api-client library on client side
- Validation rules are applied according to the api-client library specifications
- Email format validation:
  - Must be a valid email address format
  - Required field

**Validation Success:**
- If email passes validation:
  - Email is sent to the password reset request endpoint: `POST /api/v1/auth/forgot-password` (TODO add link to the API documentation)
  - Server looks up user by email address
  - If user exists:
    - Password reset token is generated
    - Verification code is generated and sent to user's email
    - Token is returned to client and stored in localStorage and application state
    - User is navigated to Step 2
  - If user does not exist:
    - Form level error is displayed: "If an account with this email exists, a password reset code has been sent to your email."
    - User is navigated to Step 2 (for security reasons, same message is shown whether user exists or not)
    - This prevents email enumeration attacks

**Validation Failure:**
- If validation fails:
  - Field that didn't pass validation is highlighted (error state)
  - "Send me code on email" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from field only when field passes validation
  - "Send me code on email" button becomes active only when field passes validation

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 1
- Email data is not stored in localStorage and cannot be restored
- User must input email again after page reload

#### Data Flow

**Server Communication:**
- Email is sent to the password reset request endpoint: `POST /api/v1/auth/forgot-password`
- Request includes:
  - `email`: User's email address
- Response on success includes:
  - `token`: Password reset token required for subsequent steps
  - `message`: Success message
- Response on failure:
  - Status code: 404 Not Found (if email not found, but same success response is returned for security)
  - OR Status code: 400 Bad Request (if email format is invalid)
  - Error message is displayed to user

**Token Storage:**
- Password reset token is stored in localStorage as `password_reset_token`
- Token is also stored in application state
- Token is used for verification in Step 2 and Step 3

#### Error Handling

Both client-side validation errors and server-side errors are possible at this step:

**Client-Side Validation Errors:**
- **Email validation errors**:
  - "Please provide a valid email address" - displayed if email format is invalid
  - "Email is required" - displayed if email field is empty
- Field-level validation errors displayed below field
- Field with validation error is highlighted (error state with red border)

**Server-Side Errors:**
- **Email not found** (404 Not Found):
  - For security reasons, same success message is shown: "If an account with this email exists, a password reset code has been sent to your email."
  - User is navigated to Step 2 (prevents email enumeration)
- **Server errors** (500 Internal Server Error):
  - Generic error message displayed: "An error occurred. Please try again later."
  - User remains on Step 1
  - User can retry the request

**Error Display:**
- Client-side validation errors are displayed below the email field
- Server-side errors are displayed as form level errors (typically at the top of the form or below the submit button)
- Error messages should be user-friendly and actionable

#### Backend Implementation

**Password Reset Request Endpoint:**
- Endpoint: `POST /api/v1/auth/forgot-password` (TODO add documentation here)

**Server-Side Validation:**
- Email validation:
  - Must be valid email format
  - Must not be empty

**Password Reset Process:**
- User lookup: Finds user by email address in database
- If user exists:
  - Password reset token is generated (unique, time-limited)
  - Verification code is generated (6-digit numeric code)
  - Token and code are stored in user record
  - Verification email with code is sent to user's email address
  - Token expiration is set (e.g., 1 hour)
  - Token is returned to client
- If user does not exist:
  - Same success response is returned (prevents email enumeration)
  - No email is sent

**Response:**
- On success: Returns password reset token and success message
- On failure: Returns appropriate error messages

### Step 2: Verification Code

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 2 of 3"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Verification Code** - Text input field with label, placeholder "Enter verification code" (required, marked with *)

**Actions:**
- **Back** button - Outline variant button with left arrow icon, positioned at bottom left, navigates to Step 1
- **Reset password** button - Primary button with right arrow icon, positioned at bottom right

**User Interaction:**
- User can click "Back" button to return to Step 1
- User receives verification code via email (sent after successful request in Step 1)
- User enters verification code received in email
- User clicks "Reset password" to proceed to Step 3
- Validation errors display below field if verification code is invalid
- Field with validation error is highlighted (error state with red border)
- "Reset password" button becomes inactive after unsuccessful validation attempt until valid code is entered
- After each failed attempt, user sees remaining attempts count (e.g., "Invalid code. 3 attempts left")
- If maximum attempts are exceeded, form is disabled and "Request New Code" button is displayed
- After successful verification, user is navigated to Step 3

#### Technical Implementation

**State Management:**
- Verification code is stored in application state
- Token from Step 1 password reset request is retrieved from localStorage or application state for verification
- On page reload, token from localStorage is restored to application state if available
- After successful verification, token is preserved for Step 3

**Validation Flow:**
- When "Reset password" button is pressed, verification code is validated using the api-client library on client side
- Validation rules are applied according to the api-client library specifications
- Verification code format validation:
  - Required field
  - Exact length (6 digits)
  - Numeric only

**Validation Success:**
- If verification code passes client-side validation:
  - Token received from Step 1 password reset request is retrieved from localStorage or application state
  - Verification code and token are sent to the password reset verification endpoint: `POST /api/v1/auth/verify-password-reset` (TODO make this a link to documentation)
  - If verification is successful, token is preserved and user is navigated to Step 3
  - If server verification fails, form level error received from server is displayed and user remains on Step 2

**Validation Failure:**
- If client-side validation fails:
  - Field that didn't pass validation is highlighted (error state)
  - "Reset password" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from field only when field passes validation
  - "Reset password" button becomes active only when field passes validation
- If server-side verification fails:
  - Form level error received from server is displayed
  - Error message is displayed (invalid code, expired code, etc.)
  - User remains on Step 2
  - Field is highlighted with error state

**Back Navigation:**
- When "Back" button is pressed:
  - User is navigated back to Step 1
  - Token in localStorage should not be removed and remains available
  - If user changes email in Step 1 and submits again, a new token will be generated and previous token will be invalidated

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 2
- Token from Step 1 should be preserved and restored if available

#### Data Flow

**Token Usage:**
- Token received from Step 1 password reset request (`POST /api/v1/auth/forgot-password`) is retrieved from localStorage or application state and used for verification
- Token is included in the verification request to authenticate the verification process

**Server Communication:**
- Verification code and token are sent to the password reset verification endpoint: `POST /api/v1/auth/verify-password-reset` (TODO add correct page here)
- Request includes:
  - Verification code entered by user
  - Token received from Step 1 password reset request
- Response indicates success or failure of verification
- On successful verification, token is preserved and user is navigated to Step 3

#### Error Handling

Both client-side validation errors and server-side errors are possible at this step:

**Client-Side Validation Errors:**
- **Verification code validation errors**:
  - "Verification code is required" - displayed if code field is empty
  - "Verification code must be 6 digits" - displayed if code format is invalid
  - "Verification code must contain only numbers" - displayed if code contains non-numeric characters
- Field-level validation errors displayed below field
- Field with validation error is highlighted (error state with red border)

**Server-Side Errors:**
- **Invalid code** (400 Bad Request):
  - Error message: "Invalid code. Remaining attempts: {N}."
  - Displayed as form level error
  - Shows remaining attempts count
  - User remains on Step 2
  - User can retry with correct code
- **Maximum attempts exceeded** (429 Too Many Requests):
  - Error message: "Maximum attempts exceeded. Please request a new password reset email."
  - Displayed as form level error
  - Code input field and submit button are disabled
  - "Request New Code" button is displayed
  - User must return to Step 1 to request a new code
  - Token is invalidated and cannot be reused
- **Expired code** (400 Bad Request):
  - Error message: "Verification code has expired. Please request a new code."
  - Displayed as form level error
  - User remains on Step 2
  - User may need to return to Step 1 to request a new code
- **Invalid or expired token** (401 Unauthorized):
  - Error message: "Invalid or expired token. Please start the password reset process again."
  - Displayed as form level error
  - User remains on Step 2
  - User may need to return to Step 1 to request a new token
- **Server errors** (500 Internal Server Error):
  - Generic error message displayed
  - User can retry the request

**Error Display:**
- Client-side validation errors are displayed below the verification code field
- Server-side errors are displayed as form level errors (typically at the top of the form or below the submit button)
- Error messages should be user-friendly and actionable

#### Backend Implementation

**Password Reset Verification Endpoint:**
- Endpoint: `POST /api/v1/auth/verify-password-reset` (TODO add link to documentation)

**Server-Side Verification Process:**
- Token validation: Verifies that the password reset token is valid and not expired
- Attempt limit check: Verifies that the number of failed attempts has not exceeded the maximum allowed (configurable via `MAX_PASSWORD_RESET_ATTEMPTS` environment variable, default: 5)
- Code validation: Verifies that the verification code matches the code sent to user's email
- Code expiration check: Verifies that the verification code has not expired
- User lookup: Finds the user record associated with the token

**Verification Process:**
- If verification is successful:
  - Token is validated and marked as verified
  - User can proceed to Step 3 to set new password
- If verification fails:
  - Attempt counter is incremented atomically in the database
  - If attempts exceed limit: Token is deleted and 429 error is returned
  - If attempts remain: 400 error is returned with remaining attempts count
  - User must retry verification or request a new code

**Brute-Force Protection:**
- Each password reset token tracks failed verification attempts (`attemptsCount` field)
- Maximum attempts are configurable via `MAX_PASSWORD_RESET_ATTEMPTS` environment variable (default: 5)
- When maximum attempts are reached, the token is permanently deleted
- This prevents brute-force attacks by limiting the number of code verification attempts per token
- Legitimate users can request a new password reset email if they exhaust attempts

**Response:**
- On success (200 OK): Returns success response indicating verification is complete
- On invalid code with attempts remaining (400 Bad Request): Returns error with remaining attempts count
- On maximum attempts exceeded (429 Too Many Requests): Returns error indicating token is invalidated
- On failure: Returns appropriate error messages (e.g., invalid code, expired code, invalid token)

### Step 3: New Password

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 3 of 3"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Password** - Password input field with label and show/hide toggle icon (required, marked with *)
- **Confirm Password** - Password input field with label and show/hide toggle icon (required, marked with *, must match password)

**Actions:**
- **Set Up New Password** button - Primary button, positioned at the bottom of the form, full width of the form

**User Interaction:**
- User enters new password (with show/hide toggle functionality)
- User confirms password (must match password field)
- User clicks "Set Up New Password" to complete password reset
- Validation errors display below fields if required fields are empty or invalid
- Fields with validation errors are highlighted (error state with red border)
- "Set Up New Password" button becomes inactive after unsuccessful validation attempt until all required fields are filled correctly
- After successful password reset, user is redirected to login page
- If password reset fails, form level error received from server is displayed and user remains on Step 3

#### Technical Implementation

**State Management:**
- Form data (password, confirmPassword) is stored in application state
- localStorage is NOT used for password fields due to security reasons (sensitive information)
- Token from Step 1 password reset request is retrieved from localStorage or application state for password reset
- On page reload, password data cannot be restored and user must input passwords again
- After successful password reset, all localStorage data saved during password reset process is removed

**Validation Flow:**
- When "Set Up New Password" button is pressed, all form fields are validated using the api-client library on client side
- Validation rules are applied according to the api-client library specifications
- Password strength validation:
  - Minimum length: 8 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character
- Password match validation (confirm password must match password)

**Validation Success:**
- If all required fields pass validation:
  - Token received from Step 1 password reset request is retrieved from localStorage or application state
  - New password and token are sent to the password reset endpoint: `POST /api/v1/auth/reset-password` (TODO add link to the API documentation)
  - If password reset is successful:
    - All localStorage data saved during password reset process should be removed
    - User is navigated to login page
    - Success message may be displayed: "Password has been reset successfully. Please sign in with your new password."
  - If password reset fails, form level error received from server is displayed and user remains on Step 3

**Validation Failure:**
- If validation fails:
  - Fields that didn't pass validation are highlighted (error state)
  - "Set Up New Password" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from a field only when that field passes validation
  - "Set Up New Password" button becomes active only when all required fields pass validation

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 3
- Password data is not stored in localStorage and cannot be restored
- User must input passwords again after page reload
- Token from Step 1 should be preserved and restored if available

#### Data Flow

**Token Usage:**
- Token received from Step 1 password reset request (`POST /api/v1/auth/forgot-password`) is retrieved from localStorage or application state and used for password reset
- Token is included in the password reset request to authenticate the password change process

**Server Communication:**
- New password and token are sent to the password reset endpoint: `POST /api/v1/auth/reset-password`
- Request includes:
  - `password`: User's new password (plain text, sent over HTTPS)
  - `token`: Password reset token received from Step 1
- Response on success:
  - Success message indicating password has been reset
- Response on failure:
  - Status code: 400 Bad Request (if password doesn't meet requirements or token is invalid)
  - OR Status code: 401 Unauthorized (if token is invalid or expired)
  - Error message is displayed to user

**Token Cleanup:**
- After successful password reset, password reset token is invalidated on server
- All localStorage data saved during password reset process is removed from client
- Token cannot be reused for additional password resets

#### Error Handling

Both client-side validation errors and server-side errors are possible at this step:

**Client-Side Validation Errors:**
- **Password validation errors**:
  - "Password is required" - displayed if password field is empty
  - "Password must be at least 8 characters" - displayed if password is too short
  - "Password must contain at least one uppercase letter" - displayed if password lacks uppercase
  - "Password must contain at least one lowercase letter" - displayed if password lacks lowercase
  - "Password must contain at least one number" - displayed if password lacks number
  - "Password must contain at least one special character" - displayed if password lacks special character
- **Confirm Password validation errors**:
  - "Confirm password is required" - displayed if confirm password field is empty
  - "Passwords do not match" - displayed if passwords don't match
- Field-level validation errors displayed below fields
- Fields with validation errors are highlighted (error state with red border)

**Server-Side Errors:**
- **Invalid password** (400 Bad Request):
  - Error message: "Password does not meet requirements"
  - Displayed as form level error
  - User remains on Step 3
- **Invalid or expired token** (401 Unauthorized):
  - Error message: "Invalid or expired token. Please start the password reset process again."
  - Displayed as form level error
  - User remains on Step 3
  - User may need to return to Step 1 to request a new token
- **Token already used** (400 Bad Request):
  - Error message: "This password reset link has already been used. Please request a new one."
  - Displayed as form level error
  - User remains on Step 3
- **Server errors** (500 Internal Server Error):
  - Generic error message displayed
  - User can retry the request

**Error Display:**
- Client-side validation errors are displayed below the respective fields
- Server-side errors are displayed as form level errors (typically at the top of the form or below the submit button)
- Error messages should be user-friendly and actionable

#### Backend Implementation

**Password Reset Endpoint:**
- Endpoint: `POST /api/v1/auth/reset-password` (TODO add documentation here)

**Server-Side Validation:**
- Password validation:
  - Must be a string
  - Must not be empty
  - Minimum length: 8 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character
- Token validation:
  - Token must be valid and not expired
  - Token must not have been used already

**Password Reset Process:**
- Token validation: Verifies that the password reset token is valid and not expired
- User lookup: Finds the user record associated with the token
- If token is valid and user is found:
  - Password is hashed using secure hashing algorithm
  - User's password is updated in database
  - Password reset token is invalidated (cannot be reused)
  - Success response is returned to client
- If token is invalid or expired:
  - UnauthorizedException is thrown with "Invalid or expired token" message
  - 401 status code is returned
- If password doesn't meet requirements:
  - BadRequestException is thrown with appropriate error message
  - 400 status code is returned

**Response:**
- On success: Returns success response indicating password has been reset
- On failure: Returns appropriate error messages (e.g., invalid password, invalid token, expired token)

---

## Routing and Redirect Rules

### Route Configuration

#### `/restore-password`
- **Unauthenticated users**: Displays the Restore Password form
- **Authenticated users**: Automatically redirected to `/dashboard`

### Technical Implementation

#### Authentication Route Component

The `AuthRoute` component wraps the `/restore-password` page and automatically redirects authenticated users to the dashboard:

```typescript
// AuthRoute component checks authentication status
// If authenticated: redirect to /dashboard
// If not authenticated: render the restore password form
```

#### Redirect Logic

- Authentication status is determined using the `useAuth` hook from `AuthContext`
- Redirects are performed using React Router's `Navigate` component with `replace` prop to prevent back navigation issues

### User Experience Flow

#### Unauthenticated User Flow
- User visits `/restore-password` → Sees Restore Password form

#### Authenticated User Flow
- User visits `/restore-password` → Automatically redirected to `/dashboard`

### Benefits

- **Improved Security**: Prevents authenticated users from accessing the restore password form
- **Better UX**: Automatically redirects authenticated users to the dashboard
- **Consistent Navigation**: Standardized behavior for handling authentication routes

---

## References

- API Endpoint: `POST /api/v1/auth/forgot-password` (TODO add link to API documentation)
- API Endpoint: `POST /api/v1/auth/verify-password-reset` (TODO add link to API documentation)
- API Endpoint: `POST /api/v1/auth/reset-password` (TODO add link to API documentation)
- Sign-In Process: See [Sign-In Process Documentation](./2-sign-in-process.md)
- Sign-Up Process: See [Sign-Up Process Documentation](./1-sign-up-process.md)

