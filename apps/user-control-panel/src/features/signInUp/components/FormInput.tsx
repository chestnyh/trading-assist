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
    onChange,
}: FormInputProps) {
    return (
        <div className="w-full pt-5">
            <FormFieldLabel label={label} id={id} />

            <input
                type={type}
                id={id}
                name={name}
                value={value}
                placeholder={placeholder}
                onChange={onChange}
                className="
          w-full h-12
          mt-2
          px-4
          text-body-md text-text
          bg-bgSecondary

          border border-formInputBorder
          rounded-md

          transition-colors
          appearance-none

          hover:border-primary
          hover:ring-2 hover:ring-accent

          focus:outline-none
          focus:border-primary
          focus:ring-2 focus:ring-primary
        "
            />
        </div>
    );
}
