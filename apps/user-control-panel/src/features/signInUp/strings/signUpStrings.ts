export const SIGN_UP_STRINGS = {
  // Step titles (used in stepsConfig)
  steps: {
    step1Title: "Let's Start!",
    step2Title: 'Trading Preferences',
    step3Title: 'Account Info',
    step4Title: 'Email Confirmation',
  },

  // Step 1: Personal Information
  step1: {
    labels: {
      firstName: 'First Name',
      lastName: 'Last Name',
      country: 'Country',
    },
    placeholders: {
      firstName: 'Enter your first name',
      lastName: 'Enter your last name',
      country: 'Select your country',
    },
  },

  // Step 2: Trading Preferences
  step2: {
    labels: {
      tradingExperience: 'Trading Experience Level',
      tradingStrategy: 'Primary Trading Strategy',
      riskTolerance: 'Risk Tolerance',
      tradingPlatforms: 'Preferred Trading Platforms',
    },
    placeholders: {
      tradingStrategy: 'Select your trading style',
    },
  },

  // Step 3: Account Information
  step3: {
    labels: {
      email: 'Email',
      nickname: 'Nickname',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      newsUpdates: 'I want to receive news and updates via email',
      tosPrivacy:
        'I have read and accept the Terms of Service and Privacy Policy',
    },
    placeholders: {
      email: 'Enter your email',
      nickname: 'Enter your nickname',
      password: 'Enter your password',
      confirmPassword: 'Confirm your password',
    },
  },

  // Step 4: Email Verification
  step4: {
    labels: {
      verificationCode: 'Verification Code',
    },
    placeholders: {
      verificationCode: 'Enter verification code',
    },
    messages: {
      instructions:
        "We've sent a verification code to your email. Please enter it below to complete your registration.",
      successTitle: 'Email Verified!',
      successMessage:
        'Your email has been successfully verified. You can now sign in to your account.',
      redirecting: 'Redirecting to sign in page...',
    },
    errors: {
      tokenMissing:
        'Verification token is missing. Please go back and complete registration.',
      verificationFailed: 'Verification failed. Please try again.',
      invalidCode: 'Invalid verification code. Please check and try again.',
      expiredCode:
        'Verification code expired or invalid. Please request a new code.',
      serverError: 'Server error. Please try again later.',
      networkError:
        'Unable to connect to the server. Please check your internet connection.',
      invalidCodeField: 'Invalid code',
      expiredCodeField: 'Expired or invalid code',
    },
  },

  // Common buttons
  buttons: {
    next: 'Next',
    back: 'Back',
    verify: 'Verify',
    verifying: 'Verifying...',
    submitting: 'Submitting...',
    goToSignIn: 'Go to Sign In',
  },
} as const;
