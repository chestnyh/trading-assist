import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { ArrowLeft } from "../../signInUp/components/icons/ArrowLeft";
import { ArrowRight } from "../../signInUp/components/icons/ArrowRight";

interface Step2ContentProps {
  code: string;
  codeError: string | null;
  formError: string | null;
  isLoading: boolean;
  onCodeChange: (value: string) => void;
  onVerifyCode: () => void;
  onBack: () => void;
}

export function Step2Content({
  code,
  codeError,
  formError,
  isLoading,
  onCodeChange,
  onVerifyCode,
  onBack,
}: Step2ContentProps) {
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
          onClick={onVerifyCode}
          disabled={isLoading || !code}
        />
      </div>
    </>
  );
}

