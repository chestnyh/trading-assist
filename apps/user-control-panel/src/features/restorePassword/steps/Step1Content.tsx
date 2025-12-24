import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";

interface Step1ContentProps {
  email: string;
  emailError: string | null;
  formError: string | null;
  isLoading: boolean;
  onEmailChange: (value: string) => void;
  onRequestReset: () => void;
}

export function Step1Content({
  email,
  emailError,
  formError,
  isLoading,
  onEmailChange,
  onRequestReset,
}: Step1ContentProps) {
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
          onClick={onRequestReset}
          disabled={isLoading || !email}
        />
      </div>
    </>
  );
}

