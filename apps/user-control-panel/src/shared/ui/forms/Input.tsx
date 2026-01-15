import { ChangeEvent, useState } from "react";
import { FieldLabel } from "./FieldLabel";
import { Eye, EyeOff } from "lucide-react";

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

            <div className="relative mt-2">
                <input
                    type={inputType}
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    className={`
          w-full h-12
          px-4
          ${isPassword ? "pr-12" : ""}
          text-body-md
          rounded-md
          appearance-none
          transition-colors
          focus:outline-none
          ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""} 
          ${error
                            ? "border-2 border-error text-text bg-background focus:border-error focus:ring-2 focus:ring-error"
                            : "border-2 border-accent text-accent bg-background hover:bg-background hover:text-text focus:border-primary focus:bg-background focus:text-text focus:ring-2 focus:ring-primary"
                        }
          placeholder:text-text-secondary
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
                    transition-colors
              cursor-pointer
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
                <p className="mt-2 text-body-sm text-error dark:text-error">
                    {error}
                </p>
            )}
        </div>
    );
}
