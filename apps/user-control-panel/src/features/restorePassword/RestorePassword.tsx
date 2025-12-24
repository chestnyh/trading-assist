import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { customInstance } from "@trading-bot/api-client";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { ArrowLeft } from "../signInUp/components/icons/ArrowLeft";
import { ArrowRight } from "../signInUp/components/icons/ArrowRight";

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
      // Extract error message from different error formats
      let errorMessage = "Failed to request password reset. Please try again.";
      
      // Handle network errors
      if (e?.isNetworkError) {
        errorMessage = e.message || "Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен.";
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (e?.message) {
        errorMessage = e.message;
        // Check if it's a validation error for email field
        if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
          const emailError = e.errors.find((err: any) => err.path?.includes('email'));
          if (emailError) {
            setEmailError(emailError.message);
            setIsLoading(false);
            return;
          }
        }
      } else if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        // Handle validation errors
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
      // Extract error message from different error formats
      let errorMessage = "Invalid or expired code. Please try again.";
      
      // Handle network errors
      if (e?.isNetworkError) {
        errorMessage = e.message || "Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен.";
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (e?.message) {
        errorMessage = e.message;
        // Check if it's a validation error for code field
        if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
          const codeError = e.errors.find((err: any) => err.path?.includes('code'));
          if (codeError) {
            setCodeError(codeError.message);
            setIsLoading(false);
            return;
          }
        }
      } else if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        // Handle validation errors
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
      // Extract error message from different error formats
      let errorMessage = "Failed to reset password. Please try again.";
      
      // Handle network errors
      if (e?.isNetworkError) {
        errorMessage = e.message || "Не удалось подключиться к серверу. Убедитесь, что бэкенд запущен.";
        setFormError(errorMessage);
        setIsLoading(false);
        return;
      }
      
      if (e?.message) {
        errorMessage = e.message;
        // Check if it's a validation error for password field
        if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
          const passwordError = e.errors.find((err: any) => err.path?.includes('password'));
          if (passwordError) {
            setPasswordError(passwordError.message);
            setIsLoading(false);
            return;
          }
        }
      } else if (e?.errors && Array.isArray(e.errors) && e.errors.length > 0) {
        // Handle validation errors
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

  const goNext = () => {
    setStep((prev) => (prev < 2 ? ((prev + 1) as RestorePasswordStep) : prev));
  };

  const goBack = () => {
    setStep((prev) => (prev > 0 ? ((prev - 1) as RestorePasswordStep) : prev));
  };

  if (step === 0) {
    return (
      <AuthLayout
        currentStep={0}
        title="Insert your email"
        actions={
          <Button
            text="Send me code on email"
            onClick={handleRequestReset}
            disabled={isLoading || !email}
          />
        }
        totalSteps={3}
      >
        {formError && (
          <div className="mt-2 text-sm text-red-500">
            {formError}
          </div>
        )}
        <Input
          label="Email"
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEmailError(null);
            setFormError(null);
          }}
          error={emailError || undefined}
          required
        />
      </AuthLayout>
    );
  }

  if (step === 1) {
    return (
      <AuthLayout
        currentStep={1}
        title="Insert code"
        actions={
          <>
            <Button
              text="Back"
              variant="outline"
              leftIcon={<ArrowLeft />}
              onClick={goBack}
            />
            <Button
              text="Reset password"
              rightIcon={<ArrowRight />}
              onClick={handleVerifyCode}
              disabled={isLoading || !code}
            />
          </>
        }
        totalSteps={3}
      >
        {formError && (
          <div className="mt-2 text-sm text-red-500">
            {formError}
          </div>
        )}
        <Input
          label="Secret code"
          id="code"
          name="code"
          type="text"
          placeholder="Enter verification code"
          value={code}
          onChange={(e) => {
            setCode(e.target.value);
            setCodeError(null);
            setFormError(null);
          }}
          error={codeError || undefined}
          required
        />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      currentStep={2}
      title="Enter new password"
      actions={
        <Button
          text="Set Up New Password"
          onClick={handleResetPassword}
          disabled={isLoading || !password || !confirmPassword}
        />
      }
      totalSteps={3}
    >
      {formError && (
        <div className="mt-2 text-sm text-red-500">
          {formError}
        </div>
      )}
      <Input
        label="Password"
        id="password"
        type="password"
        name="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setPasswordError(null);
          setFormError(null);
        }}
        error={passwordError || undefined}
        required
      />
      <Input
        label="Confirm Password"
        id="confirmPassword"
        type="password"
        name="confirmPassword"
        placeholder="Confirm new password"
        value={confirmPassword}
        onChange={(e) => {
          setConfirmPassword(e.target.value);
          setConfirmPasswordError(null);
          setFormError(null);
        }}
        error={confirmPasswordError || undefined}
        required
      />
    </AuthLayout>
  );
}


