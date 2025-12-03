import { ChangeEvent } from "react";
import { FormFieldLabel } from "./FormFieldLabel";

interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    id: string;
    name: string;
    options: FormSelectOption[];
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
}

export function FormSelect({
    label,
    id,
    name,
    options,
    placeholder = "Select an option",
    value,
    onChange,
}: FormSelectProps) {
    return (
        <div className="w-full pt-5">
            <FormFieldLabel label={label} id={id} />

            <div className="relative mt-2">
                <select
                    id={id}
                    name={name}
                    value={value}
                    onChange={onChange}
                    className="
            w-full h-12
            bg-bg-secondary dark:bg-[var(--color-bg-secondary-dark)]
            px-4 pr-10
            text-body-md
            text-text dark:text-[var(--color-text-dark)]
            dark:border dark:border-[var(--color-text-dark)]
            rounded-md
            appearance-none
            transition-colors 
            hover:border-primary dark:hover:border-[var(--color-primary-dark)]
            focus:outline-none
            focus:border-primary dark:focus:border-[var(--color-primary-dark)]
            focus:ring-2 focus:ring-primary dark:focus:ring-[var(--color-primary-dark)]
          "
                >
                    <option value="" className="text-textSecondary dark:placeholder:text-[var(--color-text-secondary-dark)]">
                        {placeholder}
                    </option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="
                bg-background dark:bg-[var(--color-background-dark)]
                text-text dark:text-[var(--color-text-dark)]
                cursor-pointer
              "
                        >
                            {option.label}
                        </option>
                    ))}
                </select>

                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center">
                    <svg
                        className="h-3 w-3 text-text dark:text-[var(--color-text-dark)]"
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
        </div>
    );
}
