import { useState, useEffect } from "react";
import { FieldLabel } from "./FieldLabel";

interface CheckboxGroupOption {
    value: string;
    label: string;
}
interface CheckboxGroupProps {
    label: string;
    name: string;
    options: CheckboxGroupOption[];
    value?: string[];
    onChange?: (selectedValues: string[]) => void;
    className?: string;
}

export function CheckboxGroup({
    label,
    name,
    options,
    value: controlledValue,
    onChange,
    className = "",
}: CheckboxGroupProps) {
    const [selectedValues, setSelectedValues] = useState<string[]>(controlledValue || []);

    useEffect(() => {
        if (controlledValue !== undefined) {
            setSelectedValues(controlledValue);
        }
    }, [controlledValue]);

    const handleChange = (optionValue: string, checked: boolean) => {
        let newSelectedValues: string[];

        if (checked) {
            newSelectedValues = [...selectedValues, optionValue];
        } else {
            newSelectedValues = selectedValues.filter((val) => val !== optionValue);
        }

        setSelectedValues(newSelectedValues);

        if (onChange) {
            onChange(newSelectedValues);
        }
    };

    return (
        <div className={`w-full pt-5 ${className}`}>
            <div className="flex justify-between">
                <FieldLabel label={label} id={`${name}-group`} />
            </div>

            <div className="mt-2 flex flex-wrap gap-4 justify-between">
                {options.map((option) => {
                    const checked = selectedValues.includes(option.value);

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
                                onChange={(e) => handleChange(option.value, e.target.checked)}
                                className="
                                    w-5 h-5  
                                    rounded 
                                    checked:bg-primary 
                                    focus:ring-primary
                                    border border-text-secondary dark:border-text-primary-dark
                                    appearance-none
                                    cursor-pointer
                                    flex-shrink-0
                                    mt-0.5
                                "
                            />
                            <span className="ml-3 select-none text-body-md text-text dark:text-[var(--color-text-dark)]">
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
