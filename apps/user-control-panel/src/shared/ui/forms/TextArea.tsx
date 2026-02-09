import { ChangeEvent } from "react";
import { FieldLabel } from "./FieldLabel";

interface TextAreaProps {
    label: string;
    id: string;
    name: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLTextAreaElement>) => void;
    error?: string;
    required?: boolean;
    disabled?: boolean;
    rows?: number;
}

export function TextArea({
    label,
    id,
    name,
    placeholder,
    value,
    onChange,
    error,
    required = false,
    disabled = false,
    rows = 4,
}: TextAreaProps) {
    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} required={required} />

            <div className="relative mt-2">
                <textarea
                    id={id}
                    name={name}
                    value={value}
                    placeholder={placeholder}
                    onChange={onChange}
                    disabled={disabled}
                    rows={rows}
                    className={`
                        w-full
                        px-4 py-3
                        text-body-md
                        rounded-md
                        appearance-none
                        transition-colors
                        focus:outline-none
                        resize-y
                        ${disabled ? "opacity-50 cursor-not-allowed bg-gray-100" : ""}
                        ${error
                            ? "border-2 border-error text-text bg-background focus:border-error focus:ring-2 focus:ring-error"
                            : "border-2 border-accent text-accent bg-background hover:bg-background hover:text-text focus:border-primary focus:bg-background focus:text-text focus:ring-2 focus:ring-primary"
                        }
                        placeholder:text-text-secondary
                    `}
                />
            </div>
            {error && (
                <p className="mt-2 text-body-sm text-error dark:text-error">
                    {error}
                </p>
            )}
        </div>
    );
}