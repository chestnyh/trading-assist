import { ChangeEvent, useState } from "react";
import { FieldLabel } from "./FieldLabel";
import { Eye, EyeOff } from "lucide-react";
import { FIELD_BASE, FIELD_DEFAULT, FIELD_TEXT, FIELD_ERROR, FIELD_ERROR_TEXT } from "./fieldStyles";

interface InputProps {
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean; 
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
    required = false,
    disabled = false,
}: InputProps) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === "password";
    const inputType = isPassword && showPassword ? "text" : type;

    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} required={required} />

            <div className="relative">
                <input
                    type={inputType}
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
          ${FIELD_BASE}
          ${FIELD_TEXT}
          ${isPassword ? "pr-12" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${error ? FIELD_ERROR : FIELD_DEFAULT}
        `}
                />
                {isPassword && !disabled && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="
              absolute inset-y-0 right-0
              flex items-center justify-center
              px-4
              text-neutral-500 hover:text-neutral-900
              dark:text-neutral-400 dark:hover:text-white
              transition-colors
              cursor-pointer
              [&>svg]:w-5 [&>svg]:h-5
            "
                        aria-label={showPassword ? "Show password" : "Hide password"}
                    >
                        {showPassword ? (
                            <EyeOff />
                        ) : (
                            <Eye />
                        )}
                    </button>
                )}
            </div>
            {error && (
                <p className={FIELD_ERROR_TEXT}>
                    {error}
                </p>
            )}
        </div>
    );
}
