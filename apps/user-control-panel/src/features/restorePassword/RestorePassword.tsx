import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { customInstance } from "@trading-bot/api-client";
import { AuthLayout } from "../layout/AuthLayout";
import { Step1Content } from "./steps/Step1Content";
import { Step2Content } from "./steps/Step2Content";
import { Step3Content } from "./steps/Step3Content";
import { getStepConfig } from "./steps/stepsConfig";

type RestorePasswordStep = 0 | 1 | 2;

const ForgotPasswordDtoSchema = z.object({
  email: z.string().email("Please provide a valid email address"),
});

const VerifyPasswordResetDtoSchema = z.object({
  code: z
    .string()
    .min(6, "Verification code must be 6 digits")
    .max(6, "Verification code must be 6 digits")
    .regex(/^\d+$/, "Verification code must contain only numbers"),
  token: z.string().uuid("Invalid or expired token. Please try again."),
});

const ResetPasswordDtoSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(/.*[A-Z].*/, "Password must contain at least one uppercase letter")
    .regex(/.*[a-z].*/, "Password must contain at least one lowercase letter")
    .regex(/.*\d.*/, "Password must contain at least one number")
    .regex(
      /.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/]/,
      "Password must contain at least one special character"
    ),
});

export function RestorePassword() {
  const [step, setStep] = useState<RestorePasswordStep>(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);
  const navigate = useNavigate();

  const config = getStepConfig(step);

  const handleRequestReset = async () => {
    try {
      setIsLoading(true);
      setFormError(null);
      setEmailError(null);

      const parsed = ForgotPasswordDtoSchema.safeParse({ email });
      if (!parsed.success) {
        setEmailError(parsed.error.issues[0]?.message ?? "Invalid email");
        setIsLoading(false);
        return;
      }

      const data = await customInstance<{ token: string; message: string }>(
        "/api/v1/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email: parsed.data.email }),
        }
      );
      if (data.token) {
        localStorage.setItem("password_reset_token", data.token);
      }

      setStep(1);
    } catch (e: any) {
      let errorMessage = "Failed to request password reset. Please try again.";
      
      if (e?.isNetworkError) {
        errorMessage = e.message || "Failed to connect to the server. Make sure the backend is running.";
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (e?.message) {
        errorMessage = e.message;
        if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
          const emailError = e.errors.find((err: any) => err.path?.includes('email'));
          if (emailError) {
            setEmailError(emailError.message);
            setIsLoading(false);
            return;
          }
        }
      } else if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        const emailError = e.errors.find((err: any) => err.path?.includes('email'));
        if (emailError) {
          setEmailError(emailError.message);
          setIsLoading(false);
          return;
        }
        errorMessage = e.errors[0]?.message ?? errorMessage;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      setFormError(null);
      setCodeError(null);

      const token = localStorage.getItem("password_reset_token") ?? "";
      const parsed = VerifyPasswordResetDtoSchema.safeParse({ code, token });
      if (!parsed.success) {
        const codeError = parsed.error.issues.find((issue) => issue.path?.includes('code'));
        if (codeError) {
          setCodeError(codeError.message);
        } else {
          setFormError(
            parsed.error.issues[0]?.message ??
              "Invalid or expired code. Please try again."
          );
        }
        setIsLoading(false);
        return;
      }

      await customInstance<{ message: string }>(
        "/api/v1/auth/verify-password-reset",
        {
          method: "POST",
          body: JSON.stringify(parsed.data),
        }
      );

      setStep(2);
    } catch (e: any) {
      let errorMessage = "Invalid or expired code. Please try again.";
      
      if (e?.isNetworkError) {
        errorMessage = e.message || "Failed to connect to the server. Make sure the backend is running.";
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (e?.message) {
        errorMessage = e.message;
        if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
          const codeError = e.errors.find((err: any) => err.path?.includes('code'));
          if (codeError) {
            setCodeError(codeError.message);
            setIsLoading(false);
            return;
          }
        }
      } else if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        const codeError = e.errors.find((err: any) => err.path?.includes('code'));
        if (codeError) {
          setCodeError(codeError.message);
          setIsLoading(false);
          return;
        }
        errorMessage = e.errors[0]?.message ?? errorMessage;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async () => {
    try {
      setIsLoading(true);
      setFormError(null);
      setPasswordError(null);
      setConfirmPasswordError(null);

      const token = localStorage.getItem("password_reset_token") ?? "";
      
      if (!token) {
        setFormError(
          "Invalid or expired token. Please start the reset process again."
        );
        setIsLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setConfirmPasswordError("Passwords do not match.");
        setIsLoading(false);
        return;
      }

      const parsedPassword = ResetPasswordDtoSchema.safeParse({ password });
      if (!parsedPassword.success) {
        const passwordError = parsedPassword.error.issues.find((issue) => issue.path?.includes('password'));
        if (passwordError) {
          setPasswordError(passwordError.message);
        } else {
          setFormError(
            parsedPassword.error.issues[0]?.message ??
              "Password does not meet requirements."
          );
        }
        setIsLoading(false);
        return;
      }

      await customInstance<{ message: string }>(
        "/api/v1/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            password: parsedPassword.data.password,
          }),
        }
      );

      localStorage.removeItem("password_reset_token");
      navigate("/sign-in");
    } catch (e: any) {
      let errorMessage = "Failed to reset password. Please try again.";
      
      if (e?.isNetworkError) {
        errorMessage = e.message || "Failed to connect to the server. Make sure the backend is running.";
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (e?.message) {
        errorMessage = e.message;
        if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
          const passwordError = e.errors.find((err: any) => err.path?.includes('password'));
          if (passwordError) {
            setPasswordError(passwordError.message);
            setIsLoading(false);
            return;
          }
        }
      } else if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        const passwordError = e.errors.find((err: any) => err.path?.includes('password'));
        if (passwordError) {
          setPasswordError(passwordError.message);
          setIsLoading(false);
          return;
        }
        errorMessage = e.errors[0]?.message ?? errorMessage;
      } else if (typeof e === 'string') {
        errorMessage = e;
      }
      
      setFormError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => {
    setStep((prev) => (prev > 0 ? ((prev - 1) as RestorePasswordStep) : prev));
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
    setFormError(null);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setCodeError(null);
    setFormError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
    setFormError(null);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(null);
    setFormError(null);
  };

  const renderStepContent = [
    <Step1Content
      key="step1"
      email={email}
      emailError={emailError}
      formError={formError}
      isLoading={isLoading}
      onEmailChange={handleEmailChange}
      onRequestReset={handleRequestReset}
    />,
    <Step2Content
      key="step2"
      code={code}
      codeError={codeError}
      formError={formError}
      isLoading={isLoading}
      onCodeChange={handleCodeChange}
      onVerifyCode={handleVerifyCode}
      onBack={goBack}
    />,
    <Step3Content
      key="step3"
      password={password}
      confirmPassword={confirmPassword}
      passwordError={passwordError}
      confirmPasswordError={confirmPasswordError}
      formError={formError}
      isLoading={isLoading}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      onResetPassword={handleResetPassword}
    />,
  ];

  return (
    <AuthLayout
      currentStep={step + 1}
      totalSteps={3}
      title={config.title}
    >
      {renderStepContent[step] || null}
    </AuthLayout>
  );
}
