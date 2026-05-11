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
    className = "",
}: RadioProps) {

    const controlledValue = value ?? "";

    return (
        <div className={`w-full pt-5 ${className}`}>
            <div className="flex justify-between">
                <FieldLabel label={label} id={`${name}-${options[0]?.value || "group"}`} />
            </div>

            <div className="flex justify-between mt-2">
                {options.map((option) => {
                    const id = `${name}-${option.value}`;
                    const checked = controlledValue === option.value;

                    return (
                        <div key={option.value} className="flex items-center">
                            <input
                                id={id}
                                type="radio"
                                name={name}
                                value={option.value}
                                checked={checked}
                                onChange={onChange}
                                className="
                  w-5 h-5
                  rounded-full
                  checked:bg-primary
                  focus:bg-primary
                  border border-text-secondary  
                  appearance-none
                  cursor-pointer
                "
                            />
                            <label
                                htmlFor={id}
                                className="
                  ml-2
                  select-none
                  text-body-md
                  text-text dark:text-text
                  cursor-pointer
                "
                            >
                                {option.label}
                            </label>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
