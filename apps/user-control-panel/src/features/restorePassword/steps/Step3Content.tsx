import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";

interface Step3ContentProps {
  password: string;
  confirmPassword: string;
  passwordError: string | null;
  confirmPasswordError: string | null;
  formError: string | null;
  isLoading: boolean;
  onPasswordChange: (value: string) => void;
  onConfirmPasswordChange: (value: string) => void;
  onResetPassword: () => void;
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
  onResetPassword,
}: Step3ContentProps) {
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
          onClick={onResetPassword}
          disabled={isLoading || !password || !confirmPassword}
        />
      </div>
    </>
  );
}

