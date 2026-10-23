import { ChangeEvent } from "react";
import { FieldLabel } from "./FieldLabel";
import { FIELD_DEFAULT, FIELD_ERROR, FIELD_ERROR_TEXT, FIELD_TEXT } from "./fieldStyles";

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

            <div className="relative">
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
                        text-base
                        rounded-xl
                        border
                        appearance-none
                        transition-colors
                        focus:outline-none focus:ring-2
                        resize-y
                        bg-white placeholder:text-neutral-400
                        dark:bg-neutral-900 dark:placeholder:text-neutral-500
                        ${FIELD_TEXT}
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                        ${error ? FIELD_ERROR : FIELD_DEFAULT}
                    `}
                />
            </div>
            {error && (
                <p className={FIELD_ERROR_TEXT}>
                    {error}
                </p>
            )}
        </div>
    );
}
