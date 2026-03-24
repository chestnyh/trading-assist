import { ChangeEvent } from "react";

interface CheckboxProps {
    id: string;
    name: string;
    label: string;
    value?: boolean;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    required?: boolean;
    error?: string;
}

export function Checkbox({
    id,
    name,
    label,
    value,
    checked,
    onChange,
    className = "",
    required = false,
    error,
}: CheckboxProps) {
    const hasError = Boolean(error);
    
    return (
        <div className={className}>
            <label
                htmlFor={id}
                className="flex items-start cursor-pointer"
            >
                <input
                    id={id}
                    type="checkbox"
                    name={name}
                    value={value?.toString()}
                    checked={checked}
                    onChange={onChange}
                    required={required}
                    className={`
                        w-5 h-5  
                        rounded 
                        checked:bg-primary 
                        focus:ring-primary
                        appearance-none
                        cursor-pointer
                        flex-shrink-0
                        mt-0.5
                        ${hasError 
                            ? 'border-2 border-error' 
                            : 'border border-text-secondary dark:border-text-primary-dark'
                        }
                    `}
                />
                <span className="ml-3 select-none text-body-md text-text dark:text-[var(--color-text-dark)]">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </span>
            </label>
            {hasError && (
                <p className="mt-1 ml-8 text-body-sm text-error">{error}</p>
            )}
        </div>
    );
}
