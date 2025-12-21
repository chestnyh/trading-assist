interface FieldLabelProps {
    label: string;
    id: string;
    required?: boolean;
}

export function FieldLabel({ label, id, required = false }: FieldLabelProps) {
    return (
        <label htmlFor={id} className="block text-body-md font-medium text-text-secondary mb-2">
            {label}
            {required && <span className="text-error ml-1">*</span>}
        </label>
    );
}
