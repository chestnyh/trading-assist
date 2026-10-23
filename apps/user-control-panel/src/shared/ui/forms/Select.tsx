import { ChangeEvent } from "react";
import { FieldLabel } from "./FieldLabel";
import { FIELD_BASE, FIELD_DEFAULT, FIELD_TEXT, FIELD_PLACEHOLDER_TEXT, FIELD_ERROR, FIELD_ERROR_TEXT } from "./fieldStyles";

interface SelectOption {
    value: string;
    label: string;
}

interface SelectProps {
    label: string;
    id: string;
    name: string;
    options: SelectOption[];
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
}

export function Select({
    label,
    id,
    name,
    options,
    placeholder = "Select an option",
    value,
    onChange,
    error,
    required = false,
}: SelectProps) {
    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} required={required} />

            <div className="relative">
                <select
                    id={id}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={`
                        ${FIELD_BASE}
                        pr-10
                        cursor-pointer
                        ${error ? FIELD_ERROR : FIELD_DEFAULT}
                        ${value ? FIELD_TEXT : FIELD_PLACEHOLDER_TEXT}
                    `}
                >
                    <option value="" disabled={value !== "" && value !== undefined && value !== null}>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-white text-neutral-950 dark:bg-neutral-900 dark:text-white"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg
                        className="h-3 w-3 text-neutral-500 dark:text-neutral-400"
                        viewBox="0 0 12 12"
                        aria-hidden="true"
                    >
                        <path
                            d="M2 4.5L6 8.5L10 4.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </span>
            </div>
            {error && (
                <p className={FIELD_ERROR_TEXT}>
                    {error}
                </p>
            )}
        </div>
    );
}
