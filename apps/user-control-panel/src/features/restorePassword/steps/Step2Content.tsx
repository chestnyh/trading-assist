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
  onRequestNewCode?: () => void;
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
  onRequestNewCode,
}: Step2ContentProps) {
  // Перевірка, чи перевищено ліміт спроб
  const isMaxAttemptsExceeded = 
    formError?.toLowerCase().includes("maximum attempts exceeded") || 
    formError?.toLowerCase().includes("too many requests");

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
      // 1. Обробка 429 (Забагато спроб)
      if (e?.status === 429 || e?.statusCode === 429) {
        const msg = e?.message || "Maximum attempts exceeded. This session has been invalidated.";
        setFormError(msg);
        localStorage.removeItem("password_reset_token");
        return;
      }

      // 2. Обробка 401 (Невірний/прострочений токен)
      if (e?.status === 401 || e?.statusCode === 401) {
        setFormError("Session invalid or expired. Please request a new code.");
        localStorage.removeItem("password_reset_token");
        return;
      }

      // 3. Обробка інших помилок (включаючи "Remaining attempts" при 400 Bad Request)
      let errorMessage = e?.message || "Invalid code. Please try again.";

      // Перевіряємо, чи є вкладені помилки валідації
      if (e?.errors && Array.isArray(e.errors)) {
        const specificCodeError = e.errors.find((err: any) => err.path?.includes('code'));
        if (specificCodeError) {
          setCodeError(specificCodeError.message);
          return;
        }
        errorMessage = e.errors[0]?.message || errorMessage;
      }

      setFormError(errorMessage);
      
      // Якщо помилка стосується коду, дублюємо її під інпутом
      if (errorMessage.toLowerCase().includes("code")) {
        setCodeError(errorMessage);
      }

    } finally {
      setIsLoading(false);
    }
  };

  const handleRequestNewCode = () => {
    localStorage.removeItem("password_reset_token");
    setFormError(null);
    setCodeError(null);
    onCodeChange("");
    if (onRequestNewCode) {
      onRequestNewCode();
    } else {
      onBack();
    }
  };

  return (
    <>
      {formError && (
        <div className={`mt-2 text-sm ${isMaxAttemptsExceeded ? 'text-red-600 font-bold' : 'text-red-500'}`}>
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
        disabled={isMaxAttemptsExceeded}
      />
      {isMaxAttemptsExceeded ? (
        <div className="mt-8">
          <Button
            text="Request New Code"
            onClick={handleRequestNewCode}
            disabled={isLoading}
            className="w-full"
          />
        </div>
      ) : (
        <div className="mt-8 flex justify-between gap-3">
          <Button
            text="Back"
            variant="outline"
            leftIcon={<ArrowLeft />}
            onClick={onBack}
            disabled={isLoading}
          />
          <Button
            text="Reset password"
            rightIcon={<ArrowRight />}
            onClick={handleVerifyCode}
            disabled={isLoading || !code}
          />
        </div>
      )}
    </>
  );
}