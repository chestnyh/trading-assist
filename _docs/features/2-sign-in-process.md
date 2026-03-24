# Sign-In Process - Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [Step-by-Step Breakdown](#step-by-step-breakdown)
4. [References](#references)

---

## Overview

The Sign-In process allows existing users to authenticate and access their Trading Assist account. Users can sign in using their email and password credentials, with optional social authentication options (Google and Facebook).

### Key Features
- Email and password authentication
- Social login options (Google, Facebook)
- Remember me functionality
- Forgot password link
- Form validation and error handling
- Light/dark theme support
- Responsive design
- Automatic token management
- Protected route access after authentication

### User Goals
- Access their account quickly and securely
- Retrieve forgotten password if needed
- Navigate to sign-up if they don't have an account
- Stay logged in using "Remember me" option

---

## User Flow

### High-Level Flow
```
User visits Sign-In Page
    ↓
User enters credentials (email + password)
    ↓
User clicks "Sign In" button
    ↓
Credentials validated (client-side)
    ↓
Credentials sent to server
    ↓
Server validates credentials
    ↓
Authentication successful → User redirected to dashboard/main page
    OR
Authentication failed → Error message displayed
```

### Navigation Options
- Users can click "Forgot password?" to navigate to password recovery
- Users can click "Create account" to navigate to sign-up process
- Users can use social login buttons (Google, Facebook) if available (!!!We don't implement this now!!!)
- After successful authentication, users are redirected to protected routes

---

## Step-by-Step Breakdown

### Sign-In Page

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Theme toggle button visible
- Logo and branding displayed
- No progress bar (single-step process)

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Email** - Text input field with label, placeholder "Enter your email" (required, marked with *, email format validation)
- **Password** - Password input field with label, placeholder "Enter your password", with show/hide toggle icon (required, marked with *)

**Additional Options:**
- **Remember Me** - Checkbox (optional)
  - "Remember me" - Allows user to stay logged in across browser sessions
- **Forgot Password** - Text button link
  - "Forgot password?" - Navigates to password recovery flow
- **Social Login** - Two social authentication buttons (optional)
We don't implement Social Network Login yet.
  - "Log in with Google" - Google authentication button with Google icon
  - "Log in with Facebook" - Facebook authentication button with Facebook icon

**Actions:**
- **Sign In** button - Primary button, positioned at the bottom of the form, full width of the form

**Navigation Links:**
- **Create Account** - Text button link at the bottom
  - "Don't have an account? Create account" - Navigates to sign-up process

**User Interaction:**
- User enters email address (must be valid email format)
- User enters password (with show/hide toggle functionality)
- User may check "Remember me" to stay logged in
- User may click social login buttons (Google or Facebook) if available
- User clicks "Sign In" to authenticate
- Validation errors display below fields if required fields are empty or invalid
- Fields with validation errors are highlighted (error state with red border)
- "Sign In" button becomes inactive after unsuccessful validation attempt until all required fields are filled correctly
- After successful authentication, user is redirected to the main application (dashboard or home page)
- If authentication fails, form level error is displayed and user remains on sign-in page

#### Technical Implementation

**State Management:**
- Form data (email, password) is stored in application state
- localStorage is NOT used for form fields due to security reasons (sensitive information like passwords)
- On successful authentication:
  - Access token is stored in localStorage as `auth_token`
  - User data is stored in localStorage as `user_data`
  - Token and user data are also stored in application state (AuthContext)
- If "Remember me" is checked, token and user data persist across browser sessions
- If "Remember me" is not checked, token and user data are still stored but may be cleared on browser close (implementation dependent)

**Validation Flow:**
- When "Sign In" button is pressed, all form fields are validated using the api-client library on client side
- Validation rules are applied according to the api-client library specifications
- Email format validation:
  - Must be a valid email address format
  - Required field
- Password validation:
  - Required field
  - Minimum length: 8 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character

**Validation Success:**
- If all fields pass validation:
  - Email and password are sent to the login endpoint: `POST /api/v1/auth/login` (TODO add link to the API documentation)
  - Server validates credentials against database
  - Server checks if user's email is verified
  - If credentials are valid and email is verified:
    - Server returns access token and user data
    - Access token is stored in localStorage and application state
    - User data is stored in localStorage and application state
    - User is redirected to the main application (dashboard or home page)
  - If credentials are valid but email is not verified:
    - Form level error is displayed: "Please verify your email address before logging in. Check your email for the verification code."
    - User remains on sign-in page
    - User must verify their email address before they can log in
  - If credentials are invalid:
    - Form level error is displayed: "Invalid credentials"
    - User remains on sign-in page
    - User can retry with correct credentials

**Validation Failure:**
- If validation fails:
  - Fields that didn't pass validation are highlighted (error state)
  - "Sign In" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from a field only when that field passes validation
  - "Sign In" button becomes active only when all required fields pass validation

**Page Reload:**
- If the page is reloaded while on sign-in page, form data is not preserved
- User must enter credentials again after page reload
- If user was previously authenticated and token exists in localStorage, user may be automatically redirected to main application (implementation dependent)

**Social Login:**
!!! Mot Implemented. We Implement This Later !!!
- Social login buttons (Google, Facebook) are displayed but functionality may be optional/not fully implemented
- If implemented, clicking social login button initiates OAuth flow
- After successful OAuth authentication, user is authenticated and redirected similar to email/password flow

#### Data Flow

**Client-Side Data Collection:**
- Email and password are collected from form fields
- "Remember me" checkbox state is collected (optional)

**Server Communication:**
- Email and password are sent to the login endpoint: `POST /api/v1/auth/login`
- Request includes:
  - `email`: User's email address
  - `password`: User's password (plain text, sent over HTTPS)
  - `rememberMe`: Optional boolean indicating if user wants to stay logged in
- Response on success includes:
  - `access_token`: JWT token for authenticated requests (expiration based on rememberMe option)
  - `user`: User object containing:
    - `id`: User ID
    - `nickname`: User nickname
    - `email`: User email
    - `name`: User full name
- Response on failure:
  - Status code: 400 Bad Request (if email is not verified)
  - Error message: "Please verify your email address before logging in. Check your email for the verification code."
  - OR Status code: 401 Unauthorized (if credentials are invalid)
  - Error message: "Invalid credentials"

**Token Storage:**
- Access token is stored in localStorage as `auth_token`
- User data is stored in localStorage as `user_data` (JSON stringified)
- Token and user data are stored in application state (AuthContext)
- Token is used for subsequent authenticated API requests (included in Authorization header as Bearer token)

**Authentication State:**
- After successful login, user is considered authenticated
- Authenticated state is maintained in AuthContext
- Protected routes check authentication state before allowing access
- If token is invalid or expired, user may be logged out automatically

#### Error Handling

Both client-side validation errors and server-side errors are possible:

**Client-Side Validation Errors:**
- **Email validation errors**: 
  - "Please provide a valid email address" - displayed if email format is invalid
  - "Email is required" - displayed if email field is empty
- **Password validation errors**:
  - "Password is required" - displayed if password field is empty
- Field-level validation errors displayed below fields
- Fields with validation errors are highlighted (error state with red border)

**Server-Side Errors:**
- **Email not verified** (400 Bad Request):
  - Error message: "Please verify your email address before logging in. Check your email for the verification code."
  - Displayed as form level error
  - User remains on sign-in page
  - User must verify their email address before they can log in
- **Invalid credentials** (401 Unauthorized):
  - Error message: "Invalid credentials"
  - Displayed as form level error
  - User remains on sign-in page
  - User can retry with correct credentials
- **Server errors** (500 Internal Server Error):
  - Generic error message displayed
  - User can retry the request

**Error Display:**
- Client-side validation errors are displayed below the respective fields
- Server-side errors are displayed as form level errors (typically at the top of the form or below the submit button)
- Error messages should be user-friendly and actionable

#### Backend Implementation

**Login Endpoint:**
- Endpoint: `POST /api/v1/auth/login` (TODO add documentation here)

**Server-Side Validation:**
- Email validation:
  - Must be valid email format
  - Must not be empty
- Password validation:
  - Must be a string
  - Must not be empty
  - Minimum length: 8 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character

**Authentication Process:**
- User lookup: Finds user by email address in database
- Password verification: Compares provided password with hashed password stored in database using secure password comparison
- If user is found and password matches:
  - Email verification check: Verifies that user's email is verified (`isEmailVerified` field is `true`)
  - If email is verified:
    - JWT token is generated with user payload (email, id, nickname)
    - Token expiration is set based on "Remember me" option (30 days if checked, default from config otherwise)
    - Access token and user data are returned to client
  - If email is not verified:
    - BadRequestException is thrown with "Please verify your email address before logging in. Check your email for the verification code." message
    - 400 status code is returned
- If user is not found or password doesn't match:
  - UnauthorizedException is thrown with "Invalid credentials" message
  - 401 status code is returned


**Response Format:**
- Success response (200):
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "nickname": "johndoe123",
      "email": "user@example.com",
      "name": "John Doe"
    }
  }
  ```
- Error response (400) - Email not verified:
  ```json
  {
    "statusCode": 400,
    "message": "Please verify your email address before logging in. Check your email for the verification code."
  }
  ```
- Error response (401) - Invalid credentials:
  ```json
  {
    "statusCode": 401,
    "message": "Invalid credentials"
  }
  ```

#### Post-Authentication Flow

**Token Usage:**
- Access token is included in subsequent API requests in the Authorization header:
  - Format: `Authorization: Bearer <access_token>`
- Token is validated on protected endpoints using JWT strategy
- Token payload contains user information (email, id, nickname)

**Protected Routes:**
- After successful authentication, user can access protected routes
- Protected routes check for valid authentication token
- If token is invalid or missing, user is redirected to sign-in page

**Session Management:**
- Token validity is determined by JWT expiration time
- If "Remember me" is checked, token persists across browser sessions
- User can manually log out, which clears token and user data from localStorage and application state

---

## Routing and Redirect Rules

### Route Configuration

#### `/sign-in`
- **Unauthenticated users**: Displays the Sign In form
- **Authenticated users**: Automatically redirected to `/dashboard`

### Technical Implementation

#### Authentication Route Component

The `AuthRoute` component wraps the `/sign-in` page and automatically redirects authenticated users to the dashboard:

```typescript
// AuthRoute component checks authentication status
// If authenticated: redirect to /dashboard
// If not authenticated: render the sign-in form
```

#### Redirect Logic

- Authentication status is determined using the `useAuth` hook from `AuthContext`
- Redirects are performed using React Router's `Navigate` component with `replace` prop to prevent back navigation issues

### User Experience Flow

#### Unauthenticated User Flow
- User visits `/sign-in` → Sees Sign In form

#### Authenticated User Flow
- User visits `/sign-in` → Automatically redirected to `/dashboard`

### Benefits

- **Improved Security**: Prevents authenticated users from accessing the sign-in form
- **Better UX**: Automatically redirects authenticated users to the dashboard
- **Consistent Navigation**: Standardized behavior for handling authentication routes

---

## References

- API Endpoint: `POST /api/v1/auth/login` (TODO add link to API documentation)
- Sign-Up Process: See [Sign-Up Process Documentation](./1-sign-up-process.md)
- Password Recovery: See [Restore Password Process Documentation](./3-restore-password-process.md)
