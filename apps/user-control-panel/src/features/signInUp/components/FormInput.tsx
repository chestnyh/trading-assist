import { FormFieldLabel } from "./FormFieldLabel";
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
            <FormFieldLabel label={label} id={id} />
            <input
                type={type}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="font-roboto tracking-[0] font-normal text-[16px] text-text w-full px-4 py-2 mt-2 border-b bg-bgSecondary border-formInputBorder rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={placeholder}
            />
        </div>
    );
}