interface FieldLabelProps {
    label: string;
    id: string;
}

export function FieldLabel({ label, id }: FieldLabelProps) {
    return (
        <label htmlFor={id} className="block text-body-md font-medium text-text-secondary mb-2">
            {label}
        </label>
    );
}
