# Sign-Up Process - Feature Documentation

## Table of Contents
1. [Overview](#overview)
2. [User Flow](#user-flow)
3. [Step-by-Step Breakdown](#step-by-step-breakdown)
   - [Step 1: Personal Information](#step-1-personal-information)
   - [Step 2: Trading Preferences](#step-2-trading-preferences)
   - [Step 3: Account Information](#step-3-account-information)
   - [Step 4: Email Verification](#step-4-email-verification)
4. [References](#references)

---

## Overview

The Sign-Up process is a multi-step registration flow that allows new users to create an account on the Trading Assist platform. The process is divided into 4 distinct steps, each collecting specific information about the user and their trading preferences.

### Key Features
- Multi-step form with progress indication
- Personal information collection
- Trading preferences configuration
- Account credentials setup
- Email verification
- Form validation and error handling
- Light/dark theme support
- Responsive design

### User Goals
- Create a new account quickly and easily
- Provide necessary information for account setup
- Configure initial trading preferences
- Verify email address for account security

---

## User Flow

### High-Level Flow
```
Step 1: Personal Information
    ↓
Step 2: Trading Preferences
    ↓
Step 3: Account Information
    ↓
Step 4: Email Verification
    ↓
Account Created → Redirect to Login Page
```

### Navigation Flow
- Users can navigate forward using "Next" button
- Users can navigate backward using "Back" button (available from Step 2 onwards)
- Progress bar shows current step (1 of 4, 2 of 4, etc.)
- Users can see which step they are on at all times

---

## Step-by-Step Breakdown

### Step 1: Personal Information

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 1 of 4"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **First Name** - Text input field with label, placeholder "Enter your first name" (required, marked with *)
- **Last Name** - Text input field with label, placeholder "Enter your last name" (required, marked with *)
- **Country** - Dropdown select with label, placeholder "Select your country", displays country names with flag emojis (required, marked with *)

**Actions:**
- **Next** button - Primary button with right arrow icon, positioned at the bottom of the form, full width of the form 

**User Interaction:**
- User fills in all three required fields
- User clicks "Next" to proceed to Step 2
- Validation errors display below fields if required fields are empty
- Fields with validation errors are highlighted (error state with red border)
- "Next" button becomes inactive after unsuccessful validation attempt until all required fields are filled correctly 

#### Technical Implementation

**State Management:**
- Form data is stored in application state as the primary source of truth
- localStorage is used as a backup mechanism to preserve data if the page is reloaded
- Each form field is stored in localStorage and application state immediately after it is updated/changed
- On page reload, data from localStorage is restored to application state

**Validation Flow:**
- When "Next" button is pressed, all form fields are validated using the shared validation library on client side
- Validation rules are applied according to the shared validation library specifications

**Validation Success:**
- If all fields pass validation
  - User is navigated to the next step

**Validation Failure:**
- If validation fails:
  - Fields that didn't pass validation are highlighted (error state)
  - "Next" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from a field only when that field passes validation
  - "Next" button becomes active only when all fields pass validation

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 1
- Form data from localStorage should be restored and added to corresponding fields if available

#### Data Flow

No data is sent to the server at this step.

#### Error Handling

No server-side errors are received at this step since no data is sent to the server. Only possible errors are validation errors.

### Step 2: Trading Preferences

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 2 of 4"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Trading Experience Level** - Radio button group with 3 options (optional)
  - Beginner
  - Intermediate
  - Advanced
- **Primary Trading Strategy** - Dropdown select with label, placeholder "Select your trading style" (optional)
  - Scalping
  - Day Trading
  - Swing Trading
  - Position Trading
  - Automated
- **Risk Tolerance** - Radio button group with 3 options (optional)
  - Conservative
  - Moderate
  - Aggressive
- **Preferred Trading Platforms** - Checkbox group with 4 options (optional)
  - Binance
  - Bybit
  - Kraken
  - Other

**Actions:**
- **Back** button - Outline variant button with left arrow icon, positioned at bottom left, navigates to Step 1
- **Next** button - Primary button with right arrow icon, positioned at bottom right

**User Interaction:**
- User can click "Back" button to return to Step 1
- User selects trading experience level (optional)
- User selects primary trading strategy from dropdown (optional)
- User selects risk tolerance (optional)
- User may select preferred trading platforms (optional, multiple selections allowed)
- User clicks "Next" to proceed to Step 3

#### Technical Implementation

**State Management:**
- Form data is stored in application state as the primary source of truth
- localStorage is used as a backup mechanism to preserve data if the page is reloaded
- Each form field is stored in localStorage and application state immediately after it is updated/changed
- On page reload, data from localStorage is restored to application state

**Form Submission:**
- When "Next" button is pressed:
  - User is navigated to the next step
- No validation is performed since all fields are optional

**Back Navigation:**
- When "Back" button is pressed:
  - User is navigated back to Step 1
  - Data in localStorage should not be removed and remains available when user gets back to this step

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 2
- Form data from localStorage should be restored if available

#### Data Flow

No data is sent to the server at this step.

#### Error Handling

No server-side errors are received at this step since no data is sent to the server. No validation errors are possible since all fields are optional.

### Step 3: Account Information

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 3 of 4"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Email** - Text input field with label (required, marked with *, email format validation)
- **Nickname** - Text input field with label (required, marked with *)
- **Password** - Password input field with label and show/hide toggle icon (required, marked with *)
- **Confirm Password** - Password input field with label and show/hide toggle icon (required, marked with *, must match password)
- **News and Updates** - Checkbox (optional)
  - "I want to receive news and updates via email"
- **Terms and Privacy** - Checkbox (required, marked with *)
  - "I have read and accept the Terms of Service and Privacy Policy"

**Actions:**
- **Back** button - Outline variant button with left arrow icon, positioned at bottom left, navigates to Step 2
- **Next** button - Primary button with right arrow icon, positioned at bottom right

**User Interaction:**
- User can click "Back" button to return to Step 2
- User enters email address (must be valid email format)
- User enters nickname
- User enters password (with show/hide toggle functionality)
- User confirms password (must match password field)
- User may opt-in to news and updates (optional)
- User must accept Terms of Service and Privacy Policy (required)
- User clicks "Next" to proceed to Step 4
- Validation errors display below fields if required fields are empty or invalid
- Fields with validation errors are highlighted (error state with red border)
- "Next" button becomes inactive after unsuccessful validation attempt until all required fields are filled correctly

#### Technical Implementation

**State Management:**
- Form data is stored in application state as the primary source of truth
- localStorage is NOT used for Step 3 form fields due to security reasons (sensitive information like passwords, emails, etc)
- Application state is used for storing fields data if user already input them previously, which might be useful if user navigates here from Step 4 or Step 2
- Token received from registration response is stored in localStorage and application state for email verification in Step 4
- On page reload, form data cannot be restored and user must input all information again

**Validation Flow:**
- When "Next" button is pressed, all form fields are validated using the shared validation library on client side
- Validation rules are applied according to the shared validation library specifications
- Email format validation
- Password strength validation:
  - Minimum length: 8 characters
  - Must contain at least one uppercase letter
  - Must contain at least one lowercase letter
  - Must contain at least one number
  - Must contain at least one special character
- Password match validation (confirm password must match password)
- Terms checkbox must be checked

**Validation Success:**
- If all required fields pass validation:
  - Data from previous steps (Step 1 and Step 2) is collected from localStorage
  - Current step form data (Step 3) is collected
  - All data is combined into a single payload
  - Combined data is sent to the register endpoint: `POST /api/v1/users` (TODO add link to the API documentation)
  - If a user was previously created (user navigated back from Step 4), and on current step we change data then we create new user, and previous one will be forbidden as not activated
  - A new user record is created in the database
  - If registration is successful, user is navigated to the next step (Step 4)
  - If registration fails, form level error received from server is displayed and user remains on Step 3

**Validation Failure:**
- If validation fails:
  - Fields that didn't pass validation are highlighted (error state)
  - "Next" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from a field only when that field passes validation
  - "Next" button becomes active only when all required fields pass validation

**Back Navigation:**
- When "Back" button is pressed:
  - User is navigated back to Step 2

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 3
- Form data is not stored in localStorage and cannot be restored
- User must input all information again after page reload

#### Data Flow

**Data Combination:**
- All collected data from Steps 1, 2, and 3 is combined into a single payload
- Data structure includes all fields from previous steps plus current step fields

**Server Communication:**
- Combined data is sent to the register endpoint: `POST /api/v1/users`.
- Request includes all user information collected during the sign-up process
- If a user was previously created (user navigated back from Step 4), and on current step we change data then we create new user, and previous one will be forbidden as not activated
- Response indicates success or failure of registration
- On successful registration, server returns a token that is necessary for email verification and must be stored in localStorage and application state for the next step

#### Error Handling

Both client-side validation errors and server-side errors are possible at this step:
- **Client-side validation errors**: Field-level validation errors displayed below fields
- **Server-side errors**: Registration errors from the API endpoint (e.g., email already exists, nickname already taken, server errors)
- Server-side errors are displayed to the user and prevent navigation to the next step

### Step 4: Email Verification

#### User Flow

**Page Layout:**
- Two-column layout: Illustration on left (desktop), form on right
- Single-column layout (form only) for screens less than 1024px
- Progress bar showing "Step 4 of 4"
- Theme toggle button visible
- Logo and branding displayed

**Form Fields:**
- Required fields are marked with an asterisk (*) next to the label
- **Verification Code** - Text input field with label, placeholder "Enter verification code" (required, marked with *)

**Actions:**
- **Back** button - Outline variant button with left arrow icon, positioned at bottom left, navigates to Step 3
- **Verify** button - Primary button with checkmark icon, positioned at bottom right

**User Interaction:**
- User can click "Back" button to return to Step 3
- User receives verification code via email (sent after successful registration in Step 3)
- User enters verification code received in email
- User clicks "Verify" to complete registration
- Validation errors display below field if verification code is invalid
- Field with validation error is highlighted (error state with red border)
- "Verify" button becomes inactive after unsuccessful validation attempt until valid code is entered
- After successful verification, user account is activated and user is redirected to login page

#### Technical Implementation

**State Management:**
- Verification code is stored in application state
- Token from Step 3 registration is retrieved from localStorage or application state for email verification
- On page reload, token from localStorage is restored to application state if available
- After successful verification, all localStorage data saved during registration process is removed

**Validation Flow:**
- When "Verify" button is pressed, verification code is validated using the shared validation library on client side
- Validation rules are applied according to the shared validation library specifications
- Verification code format validation:
  - Required field
  - Exact length (6 digits)
  - Numeric only

**Validation Success:**
- If verification code passes client-side validation:
  - Token received from Step 3 registration response is retrieved from localStorage or application state
  - Verification code and token are sent to the email verification endpoint: `POST /api/v1/auth/verify-email`(TODO make this a link to documentation)
  - If verification is successful, user account is activated
  - All localStorage data saved during registration process should be removed
  - User is navigated to login page
  - If server verification fails, form level error received from server is displayed and user remains on Step 4

**Validation Failure:**
- If client-side validation fails:
  - Field that didn't pass validation is highlighted (error state)
  - "Verify" button becomes inactive/disabled
  - Validation runs on each form field change (real-time validation)
  - Error highlight is removed from field only when field passes validation
  - "Verify" button becomes active only when field passes validation
- If server-side verification fails:
  - Form level error received from server is displayed
  - Error message is displayed (invalid code, expired code, etc.)
  - User remains on Step 4
  - Field is highlighted with error state

**Back Navigation:**
- When "Back" button is pressed:
  - User is navigated back to Step 3
  - Data in localStorage should not be removed and remains available
  - If user changes data in Step 3 and submits again, the previous user record in the database will be forbidden as not activated and a new user record should be created

**Page Reload:**
- If the page is reloaded while on this step, the user should remain on Step 4
- Token from Step 3 should be preserved and restored if available

#### Data Flow

**Token Usage:**
- Token received from Step 3 registration response (`POST /api/v1/users`) is retrieved from localStorage or application state and used for email verification
- Token is included in the email verification request to authenticate the verification process

**Server Communication:**
- Verification code and token are sent to the email verification endpoint: `POST /api/v1/auth/verify-email` (TODO add correct page here)
- Request includes:
  - Verification code entered by user
  - Token received from Step 3 registration
- Response indicates success or failure of email verification
- On successful verification, user redirected to the login page

#### Error Handling

Both client-side validation errors and server-side errors are possible at this step:
- **Client-side validation errors**: Field-level validation errors displayed below field (e.g., invalid format, empty field)
- **Server-side errors**: Verification errors from the API endpoint (e.g., invalid code, expired code, invalid token, server errors)
- Server-side errors are displayed as form level errors to the user and prevent account activation
- Error messages should be user-friendly and actionable (e.g., "Invalid code. Please check your email and try again.")