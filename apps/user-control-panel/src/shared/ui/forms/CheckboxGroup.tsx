import { useState, useEffect } from "react";
import { FieldLabel } from "./FieldLabel";
import { CHECKBOX_BOX, CHECKBOX_MARK } from "./fieldStyles";

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

            <div className="flex flex-wrap gap-4 justify-between">
                {options.map((option) => {
                    const checked = selectedValues.includes(option.value);

                    return (
                        <label
                            key={option.value}
                            htmlFor={`${name}-${option.value}`}
                            className="flex items-start cursor-pointer"
                        >
                            <span className="relative flex-shrink-0 mt-0.5 flex">
                                <input
                                    id={`${name}-${option.value}`}
                                    type="checkbox"
                                    name={name}
                                    value={option.value}
                                    checked={checked}
                                    onChange={(e) => handleChange(option.value, e.target.checked)}
                                    className={`${CHECKBOX_BOX} border-neutral-300 dark:border-neutral-700`}
                                />
                                <svg className={CHECKBOX_MARK} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </span>
                            <span className="ml-3 select-none text-base text-neutral-900 dark:text-white">
                                {option.label}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
}
