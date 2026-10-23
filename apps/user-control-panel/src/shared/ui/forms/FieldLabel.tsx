interface FieldLabelProps {
    label: string;
    id: string;
    required?: boolean;
}

export function FieldLabel({ label, id, required = false }: FieldLabelProps) {
    return (
        <label htmlFor={id} className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            {label}
            {required && <span className="text-error ml-1">*</span>}
        </label>
    );
}
