interface FormRadioOption {
    value: string;
    label: string;
}

interface FormRadioProps {
    label: string;
    name: string;
    options: FormRadioOption[];
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export function FormRadio({ 
    label, 
    name, 
    options,
    value,
    onChange,
    className = ""
}: FormRadioProps) {
    return (
        <div className={`w-full pt-5 ${className}`}>
            <label className="block text-[14px] mb-3">{label}</label>
            <div className="flex justify-between">
                {options.map((option) => (
                   <div key={option.value} className="flex items-center">
                   <input id={`${name}-${option.value}`} type="radio" name={name} value={option.value} checked={value === option.value} onChange={onChange} 
                   className="w-5 h-5 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:bg-brand focus:bg-blue-500 border border-default appearance-none" style={{ accentColor: '#3b82f6' }} />
                   <label htmlFor={`${name}-${option.value}`} className="select-none ms-2 text-sm font-medium text-heading">{option.label}</label>
               </div>
                ))}
            </div>
        </div>
    );
}

