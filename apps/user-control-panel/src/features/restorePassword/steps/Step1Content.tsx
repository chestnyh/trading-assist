import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { customInstance } from "@trading-bot/api-client";

interface Step1ContentProps {
  email: string;
  emailError: string | null;
  formError: string | null;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  setStep: (step: 1) => void;
  setIsLoading: (loading: boolean) => void;
  setFormError: (error: string | null) => void;
  setEmailError: (error: string | null) => void;
}

export function Step1Content({
  email,
  emailError,
  formError,
  isLoading,
  onEmailChange,
  setStep,
  setIsLoading,
  setFormError,
  setEmailError,
}: Step1ContentProps) {
  const handleRequestReset = async () => {
    try {
      setIsLoading(true);
      setFormError(null);
      setEmailError(null);

      const response = await customInstance<{
        token?: string;
        message?: string;
        data?: { token?: string; message?: string };
      }>(
        "/api/v1/auth/forgot-password",
        {
          method: "POST",
          body: JSON.stringify({ email }),
        }
      );
      const token = response.token ?? response.data?.token;

      if (token) {
        localStorage.setItem("password_reset_token", token);
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

      if (e?.message === 'Validation failed' && e?.errors && Array.isArray(e.errors)) {
        const emailError = e.errors.find((err: any) => err.path?.includes('email'));
        if (emailError) {
          setEmailError(emailError.message);
          setIsLoading(false);
          return;
        }
        errorMessage = e.errors[0]?.message ?? errorMessage;
      } else if (e?.message) {
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

  return (
    <>
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
        onChange={(e) => onEmailChange(e.target.value)}
        error={emailError || undefined}
        required
      />
      <div className="mt-8">
        <Button
          text="Send me code on email"
          onClick={handleRequestReset}
          disabled={isLoading || !email}
        />
      </div>
    </>
  );
}

