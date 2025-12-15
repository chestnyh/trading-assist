import { ChangeEvent } from "react";
import { FieldLabel } from "./FieldLabel";

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
}: SelectProps) {
    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} />

            <div className="relative mt-2">
                <select
                    id={id}
                    name={name}
                    value={value || ""}
                    onChange={onChange}
                    className={`
                        w-full h-12
                        px-4 pr-10
                        text-body-md
                        rounded-md
                        appearance-none
                        transition-colors
                        focus:outline-none
                        ${error
                            ? "border-2 border-error text-text bg-background focus:border-error focus:ring-2 focus:ring-error"
                            : !value || value === ""
                                ? "border-2 border-accent text-text-secondary bg-background hover:bg-background hover:text-text focus:border-primary focus:bg-background focus:text-text focus:ring-2 focus:ring-primary"
                                : "border-2 border-accent text-accent bg-background hover:bg-background hover:text-text focus:border-primary focus:bg-background focus:text-text focus:ring-2 focus:ring-primary"
                        }
                         `}
                >
                    <option value="" disabled={value !== "" && value !== undefined && value !== null}>
                        {placeholder}
                    </option>
                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="bg-background text-text cursor-pointer"
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg
                        className="h-3 w-3 text-text"
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
                <p className="mt-2 text-body-sm text-error">
                    {error}
                </p>
            )}
        </div>
    );
}
