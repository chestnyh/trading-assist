import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { useNavigate } from "react-router-dom";
import { customInstance } from "@trading-bot/api-client";

interface Step3ContentProps {
  password: string;
  confirmPassword: string;
  passwordError: string | null;
  confirmPasswordError: string | null;
  formError: string | null;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  setIsLoading: (loading: boolean) => void;
  setFormError: (error: string | null) => void;
  setPasswordError: (error: string | null) => void;
  setConfirmPasswordError: (error: string | null) => void;
}

export function Step3Content({
  password,
  confirmPassword,
  passwordError,
  confirmPasswordError,
  formError,
  isLoading,
  onPasswordChange,
  onConfirmPasswordChange,
  setIsLoading,
  setFormError,
  setPasswordError,
  setConfirmPasswordError,
}: Step3ContentProps) {
  const navigate = useNavigate();

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

      await customInstance<{ message: string }>(
        "/api/v1/auth/reset-password",
        {
          method: "POST",
          body: JSON.stringify({
            token,
            password,
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

      if (e?.message === 'Validation failed' && e?.errors && Array.isArray(e.errors)) {
        const passwordError = e.errors.find((err: any) => err.path?.includes('password'));
        if (passwordError) {
          setPasswordError(passwordError.message);
          setIsLoading(false);
          return;
        }
        const tokenError = e.errors.find((err: any) => err.path?.includes('token'));
        if (tokenError) {
          setFormError(tokenError.message);
          setIsLoading(false);
          return;
        }
        errorMessage = e.errors[0]?.message ?? errorMessage;
      } else if (e?.message) {
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

  return (
    <>
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
        onChange={(e) => onPasswordChange(e.target.value)}
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
        onChange={(e) => onConfirmPasswordChange(e.target.value)}
        error={confirmPasswordError || undefined}
        required
      />
      <div className="mt-8">
        <Button
          text="Set Up New Password"
          onClick={handleResetPassword}
          disabled={isLoading || !password || !confirmPassword}
        />
      </div>
    </>
  );
}

