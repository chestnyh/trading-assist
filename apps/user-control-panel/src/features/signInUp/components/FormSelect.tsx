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
            bg-bgSecondary
            px-4 pr-10
            text-body-md text-text
            border border-formInputBorder
            rounded-md
            appearance-none
            transition-colors

            hover:border-primary
            hover:ring-2 hover:ring-accent

            focus:outline-none
            focus:border-primary
            focus:ring-2 focus:ring-primary
          "
                >
                    <option value="">{placeholder}</option>

                    {options.map((option) => (
                        <option
                            key={option.value}
                            value={option.value}
                            className="
                bg-background
                text-text
                cursor-pointer
              "
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
        </div>
    );
}
