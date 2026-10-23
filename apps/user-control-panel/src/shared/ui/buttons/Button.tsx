import { ReactNode } from "react";

interface ButtonProps {
    text?: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: "primary" | "outline" | "error" | "text";
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    ariaLabel?: string;
}

export function Button({
    text,
    type = "button",
    onClick,
    disabled = false,
    className = "",
    variant = "primary",
    leftIcon,
    rightIcon,
    ariaLabel,
}: ButtonProps) {
    const isTextVariant = variant === "text";

    return (
        <div className={isTextVariant ? "inline-block" : "w-full"}>
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                aria-label={ariaLabel}
                className={`
          ${isTextVariant ? "rounded-md" : "w-full rounded-full"}
          font-inter-tight
          transition-colors
          focus-visible:outline-2 focus-visible:outline-offset-2
          focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300
          ${isTextVariant ? "inline-flex items-center gap-2" : "flex items-center justify-center gap-2"}
          ${isTextVariant ? "text-base font-medium" : "h-12 px-6 text-base font-semibold [&_svg]:w-5 [&_svg]:h-5"}
          ${variant === "primary" ? `bg-brand-300 text-forest-300 ${disabled ? "" : "hover:bg-brand-200"}` : ""}
          ${variant === "outline" ? `border border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-900 dark:text-white ${disabled ? "" : "hover:bg-neutral-50 dark:hover:bg-neutral-800"}` : ""}
          ${variant === "error" ? "bg-error text-white" : ""}
          ${variant === "text" ? "text-forest-200 hover:text-forest-300 dark:text-brand-300 dark:hover:text-brand-200 hover:underline underline-offset-4 bg-transparent" : ""}
          ${disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
          ${className}
        `}
            >
                {leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
                {text && (
                    <span className="transition-all duration-300 ease-in-out whitespace-nowrap">
                        {text}
                    </span>
                )}
                {rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
            </button>
        </div>
    );
}
