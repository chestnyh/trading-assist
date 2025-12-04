import { ReactNode } from "react";

interface FormButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: "primary" | "secondary" | "outline" | "error" | "text";
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
}

export function FormButton({
    text,
    type = "button",
    onClick,
    disabled = false,
    className = "",
    variant = "primary",
    leftIcon,
    rightIcon,
}: FormButtonProps) {
    const isTextVariant = variant === "text";

    return (
        <div className={isTextVariant ? "inline-block" : "w-full"}>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`
          ${isTextVariant ? "" : "w-full rounded-md"}
          font-sans font-medium
          transition-colors
          ${isTextVariant ? "inline-flex items-center gap-2" : "flex items-center justify-center gap-2"}
          ${isTextVariant ? "text-body-md" : "h-8 px-4 text-btn-sm md:h-10 md:px-5 md:text-btn-md lg:h-12 lg:px-6 lg:text-btn-lg"}
          ${variant === "primary" ? "bg-primary text-white hover:bg-accent focus:ring-2 focus:ring-primary" : ""}
          ${variant === "secondary" ? "bg-bgSecondary text-text hover:bg-accent hover:text-white focus:ring-2 focus:ring-primary" : ""}
          ${variant === "outline" ? "border border-primary text-primary hover:bg-primary hover:text-white focus:ring-2 focus:ring-primary" : ""}
          ${variant === "error" ? "bg-error text-text  " : ""}
          ${variant === "text" ? "text-primary dark:text-[var(--color-primary-dark)] hover:text-accent dark:hover:text-accent bg-transparent" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
            >
                {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                <span>{text}</span>
                {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </button>
        </div>
    );
}
