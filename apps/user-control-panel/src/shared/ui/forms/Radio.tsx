import { ChangeEvent } from "react";
import { FieldLabel } from "./FieldLabel";

interface RadioOption {
    value: string;
    label: string;
}

interface RadioProps {
    label: string;
    name: string;
    options: RadioOption[];
    value?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function Radio({
    label,
    name,
    options,
    value,
    onChange,
    className = ""
}: RadioProps) {
    return (
        <div className={`w-full pt-5 ${className}`}>
            <div className="flex justify-between">
                <FieldLabel label={label} id={`${name}-${options[0]?.value || 'group'}`} />
            </div>
            <div className="flex justify-between mt-2">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`}
                            type="radio"
                            name={name}
                            value={option.value}
                            {...(onChange && value !== undefined
                                ? { checked: value === option.value, onChange }
                                : {})}
                            className="
                                w-5 h-5  
                                rounded-full 
                                checked:bg-primary 
                                focus:bg-primary 
                                border border-text-secondary dark:border-text-primary-dark
                                appearance-none
                                cursor-pointer
                            "
                        />
                        <label
                            htmlFor={`${name}-${option.value}`}
                            className="
                                ml-2
                                select-none
                                text-body-md
                                text-text dark:text-[var(--color-text-dark)]
                                cursor-pointer
                              ">
                            {option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}
