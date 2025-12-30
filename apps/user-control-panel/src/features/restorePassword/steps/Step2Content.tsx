import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { ArrowLeft } from "../../signInUp/components/icons/ArrowLeft";
import { ArrowRight } from "../../signInUp/components/icons/ArrowRight";
import { customInstance } from "@trading-bot/api-client";

interface Step2ContentProps {
  code: string;
  codeError: string | null;
  formError: string | null;
  isLoading: boolean;
  onCodeChange: (value: string) => void;
  setStep: (step: 2) => void;
  setIsLoading: (loading: boolean) => void;
  setFormError: (error: string | null) => void;
  setCodeError: (error: string | null) => void;
  onBack: () => void;
}

export function Step2Content({
  code,
  codeError,
  formError,
  isLoading,
  onCodeChange,
  setStep,
  setIsLoading,
  setFormError,
  setCodeError,
  onBack,
}: Step2ContentProps) {
  const handleVerifyCode = async () => {
    try {
      setIsLoading(true);
      setFormError(null);
      setCodeError(null);

      const token = localStorage.getItem("password_reset_token") ?? "";
      if (!token) {
        setFormError("Invalid or expired token. Please start the reset process again.");
        setIsLoading(false);
        return;
      }

      await customInstance<{ message: string }>(
        "/api/v1/auth/verify-password-reset",
        {
          method: "POST",
          body: JSON.stringify({ code, token }),
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

      if (e?.message === 'Validation failed' && e?.errors && Array.isArray(e.errors)) {
        const codeError = e.errors.find((err: any) => err.path?.includes('code'));
        if (codeError) {
          setCodeError(codeError.message);
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

  return (
    <>
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
        onChange={(e) => onCodeChange(e.target.value)}
        error={codeError || undefined}
        required
      />
      <div className="mt-8 flex justify-between gap-3">
        <Button
          text="Back"
          variant="outline"
          leftIcon={<ArrowLeft />}
          onClick={onBack}
        />
        <Button
          text="Reset password"
          rightIcon={<ArrowRight />}
          onClick={handleVerifyCode}
          disabled={isLoading || !code}
        />
      </div>
    </>
  );
}

