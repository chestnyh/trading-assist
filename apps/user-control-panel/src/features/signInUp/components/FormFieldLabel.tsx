interface FormFieldLabelProps {
    label: string;
    id: string;
}

export function FormFieldLabel({ label, id }: FormFieldLabelProps) {
    return (
        <label htmlFor={id} className="block text-body-md font-medium text-text dark:text-[var(--color-text-dark)] mb-2">
            {label}
        </label>
    );
}