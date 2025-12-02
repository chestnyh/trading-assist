interface FormButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
    size?: "lg" | "md" | "sm";
}

export function FormButton({
    text,
    type = "button",
    onClick,
    disabled = false,
    className = "",
    variant = "primary",
    size = "lg",
}: FormButtonProps) {
    const sizeClasses = {
        lg: "h-12 px-6 text-btn-lg",
        md: "h-10 px-5 text-btn-md",
        sm: "h-8 px-4 text-btn-sm",
    };

    const variantClasses = {
        primary: `
      bg-primary text-white
      hover:bg-accent
      focus:ring-2 focus:ring-primary
    `,
        secondary: `
      bg-bgSecondary text-text
      hover:bg-accent hover:text-white
      focus:ring-2 focus:ring-primary
    `,
        outline: `
      border border-primary text-primary
      hover:bg-primary hover:text-white
      focus:ring-2 focus:ring-primary
    `,
    };

    return (
        <div className="w-full mt-8">
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`
          w-full rounded-md
          font-sans font-medium
          transition-colors
          ${sizeClasses[size]}
          ${variantClasses[variant]}
          ${disabled ? "opacity-50 cursor-not-allowed" : ""}
          ${className}
        `}
            >
                {text}
            </button>
        </div>
    );
}
