import { FormFieldLabel } from "./FormFieldLabel";

interface FormRadioOption {
    value: string;
    label: string;
}

interface FormRadioProps {
    label: string;
    // id: string;
    name: string;
    options: FormRadioOption[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function FormRadio({
    label,
    // id,
    name,
    options,
    value,
    onChange,
    className = ""
}: FormRadioProps) {
    return (
        <div className={`w-full pt-5 ${className}`}>
            <div className="flex justify-between">
                <FormFieldLabel label={label} id={`${name}-${options.values}`} />
            </div>
            <div className="flex justify-between mt-2">
                {options.map((option) => (
                    <div key={option.value} className="flex items-center">
                        <input
                            id={`${name}-${option.value}`}
                            type="radio"
                            name={name}
                            value={option.value}
                            checked={value === option.value}
                            onChange={onChange}
                            className="
                                w-5 h-5  
                                rounded-full 
                                checked:bg-primary 
                                focus:bg-primary 
                                border border-accent 
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
                                text-text
                                cursor-pointer
                              ">
                            {option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}
