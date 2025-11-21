interface FormInputProps {
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    type?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function FormInput({ 
    label, 
    id, 
    name, 
    placeholder, 
    type = "text",
    value,
    onChange
}: FormInputProps) {
    return (
        <div className="w-full pt-5">
            <label htmlFor={id} className="block text-[14px]">{label}</label>
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 border-b bg-[#F2F4F8] border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={placeholder}
            />
        </div>
    );
}