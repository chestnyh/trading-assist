import { ChangeEvent } from "react";

interface CheckboxProps {
    id: string;
    name: string;
    label: string;
    value?: boolean;
    checked?: boolean;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function Checkbox({
    id,
    name,
    label,
    value,
    checked,
    onChange,
    className = "",
}: CheckboxProps) {
    return (
        <label
            htmlFor={id}
            className={`flex items-start cursor-pointer ${className}`}
        >
            <input
                id={id}
                type="checkbox"
                name={name}
                value={value?.toString()}
                checked={checked}
                onChange={onChange}
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
                {label}
            </span>
        </label>
    );
}
