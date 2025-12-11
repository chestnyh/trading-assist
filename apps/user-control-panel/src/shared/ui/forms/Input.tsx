import { ChangeEvent, useState } from "react";
import { FieldLabel } from "./FieldLabel";
import { Eye } from "../../../features/signInUp/components/icons/Eye";
import { EyeOff } from "../../../features/signInUp/components/icons/EyeOff";

interface InputProps {
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
}

export function Input({
    label,
    id,
    name,
    placeholder,
    type = "text",
    value,
    onChange,
    error,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} />

            <div className="relative mt-2">
                <input
                    type={inputType}
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    className={`
          w-full h-12
          px-4
          ${isPassword ? "pr-12" : ""}
          text-body-md
          text-text dark:text-[var(--color-text-dark)]
          bg-bg-secondary dark:bg-[var(--color-bg-secondary-dark)]
          border ${error ? "border-error dark:border-error" : "dark:border dark:border-[var(--color-text-dark)]"}
          rounded-md
          appearance-none
          transition-colors
          ${error ? "" : "hover:border-primary dark:hover:border-[var(--color-primary-dark)]"}
          focus:outline-none
          ${error ? "focus:border-error dark:focus:border-error focus:ring-2 focus:ring-error dark:focus:ring-error" : "focus:border-primary dark:focus:border-[var(--color-primary-dark)] focus:ring-2 focus:ring-primary dark:focus:ring-[var(--color-primary-dark)]"}
          placeholder:text-textSecondary dark:placeholder:text-[var(--color-text-secondary-dark)]
        `}
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="
              absolute inset-y-0 right-0
              flex items-center justify-center
              px-4
              text-textSecondary dark:text-[var(--color-text-secondary-dark)]
              hover:text-text dark:hover:text-[var(--color-text-dark)]
              transition-colors
              cursor-pointer
            "
                        aria-label={showPassword ? "Show password" : "Hide password"}
                    >
                        {showPassword ? (
                            <EyeOff className="w-5 h-5" />
                        ) : (
                            <Eye className="w-5 h-5" />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className="mt-2 text-body-sm text-error dark:text-error">
                    {error}
                </p>
            )}
        </div>
    );
}
