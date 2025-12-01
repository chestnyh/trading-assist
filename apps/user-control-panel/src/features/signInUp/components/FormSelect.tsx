import { FormFieldLabel } from "./FormFieldLabel";

interface FormSelectOption {
    value: string;
    label: string;
}

interface FormSelectProps {
    label: string;
    id: string;
    name: string;
    options: FormSelectOption[];
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export function FormSelect({ 
    label, 
    id, 
    name, 
    options,
    placeholder = "Select an option",
    value,
    onChange
}: FormSelectProps) {
    return (
        <div className="w-full pt-5">
            <FormFieldLabel label={label} id={id} />
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="w-full px-4 py-2 pr-10 bg-bgSecondary border-b border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary appearance-none bg-[url('data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2012%2012%22%3E%3Cpath%20fill%3D%22%23333%22%20d%3D%22M6%209L1%204h10z%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[length:12px] bg-[right_0.75rem_center]"
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}