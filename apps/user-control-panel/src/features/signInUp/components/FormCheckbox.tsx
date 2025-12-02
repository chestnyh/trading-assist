interface FormCheckboxOption {
    value: string;
    label: string;
}

interface FormCheckboxProps {
    label: string;
    name: string;
    options: FormCheckboxOption[];
    value?: string[];
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
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
    variant = "primary"
}: FormCheckboxProps) {
    return (
        <div className={`w-full pt-5 ${className}`}>
            {variant === "primary" && (
                <label className="block text-[14px] mb-3">{label}</label>
            )}
            <div className={variant === "primary" ? "flex justify-between" : "flex flex-col space-y-3"}>
                {options.map((option) => (
                    <div key={option.value} className="flex items-start">
                        <input
                            id={`${name}-${option.value}`}
                            type="checkbox"
                            name={name}
                            value={option.value}
                            checked={value.includes(option.value)}
                            onChange={onChange}
                            className="w-5 h-5 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded checked:bg-primary focus:bg-primary border border-default appearance-none"
                            style={{ accentColor: '#3b82f6' }}
                        />
                        <label htmlFor={`${name}-${option.value}`} className="select-none ml-3 text-body-md text-text">{option.label}</label>
                    </div>
                ))}
            </div>
        </div>
    );
}
