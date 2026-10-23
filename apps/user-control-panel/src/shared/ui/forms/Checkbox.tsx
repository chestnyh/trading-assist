import { ChangeEvent } from "react";
import { CHECKBOX_BOX, CHECKBOX_MARK, FIELD_ERROR_TEXT } from "./fieldStyles";

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
                <span className="relative flex-shrink-0 mt-0.5 flex">
                    <input
                        id={id}
                        type="checkbox"
                        name={name}
                        value={value?.toString()}
                        checked={checked}
                        onChange={onChange}
                        required={required}
                        className={`
                            ${CHECKBOX_BOX}
                            ${hasError ? "border-error" : "border-neutral-300 dark:border-neutral-700"}
                        `}
                    />
                    <svg className={CHECKBOX_MARK} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                </span>
                <span className="ml-3 select-none text-base text-neutral-900 dark:text-white">
                    {label}
                    {required && <span className="text-error ml-1">*</span>}
                </span>
            </label>
            {hasError && (
                <p className={`${FIELD_ERROR_TEXT} ml-8`}>{error}</p>
            )}
        </div>
    );
}
