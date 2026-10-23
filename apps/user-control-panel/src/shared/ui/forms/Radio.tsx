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

            <div className="flex flex-wrap justify-between gap-4">
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
                  border border-neutral-300 dark:border-neutral-700
                  bg-white dark:bg-neutral-900
                  checked:border-[6px] checked:border-forest-300
                  dark:checked:border-brand-300
                  appearance-none
                  cursor-pointer
                  transition-all
                  focus-visible:outline-2 focus-visible:outline-offset-2
                  focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300
                "
                            />
                            <label
                                htmlFor={id}
                                className="
                  ml-2
                  select-none
                  text-base
                  text-neutral-900 dark:text-white
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
