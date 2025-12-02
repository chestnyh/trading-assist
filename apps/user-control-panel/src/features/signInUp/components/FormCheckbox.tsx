import { ChangeEvent } from "react";
import { FormFieldLabel } from "./FormFieldLabel";

interface FormCheckboxOption {
    value: string;
    label: string;
}

interface FormCheckboxProps {
    label: string;
    name: string;
    options: FormCheckboxOption[];
    value?: string[];
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    variant?: "primary" | "secondary";
}

export function FormCheckbox({
    label,
    name,
    options,
    value = [],
    onChange,
    className = "",
    variant = "primary",
}: FormCheckboxProps) {
    const isPrimary = variant === "primary";

    return (
        <div className={`w-full pt-5 ${className}`}>

            {isPrimary && (
                <div className="flex justify-between">
                    <FormFieldLabel label={label} id={`${name}-group`} />
                </div>
            )}

            <div
                className={
                    isPrimary
                        ? "mt-2 flex flex-wrap gap-4 justify-between"
                        : "mt-2 flex flex-col space-y-3"
                }
            >
                {options.map((option) => {
                    const checked = value.includes(option.value);

                    return (
                        <label
                            key={option.value}
                            htmlFor={`${name}-${option.value}`}
                            className="flex items-start cursor-pointer"
                        >
                            <input
                                id={`${name}-${option.value}`}
                                type="checkbox"
                                name={name}
                                value={option.value}
                                checked={checked}
                                onChange={onChange}
                                className="
                                w-5 h-5  
                                rounded 
                                checked:bg-primary 
                                focus:bg-primary 
                                border border-accent 
                                appearance-none
                                cursor-pointer
                "
                            />
                            <span className="ml-3 select-none text-body-md text-text">
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
