interface FormButtonProps {
    text: string;
    type?: "button" | "submit" | "reset";
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: "primary" | "secondary" | "outline";
}

export function FormButton({
    text,
    type = "button",
    onClick,
    disabled = false,
    className = "",
    variant = "primary"
}: FormButtonProps) {

    const baseStyles = "rounded-lg px-6 py-3 font-medium";

    const variantStyles = {
        primary: "bg-primary text-white hover:bg-accent",
        outline: "border border-primary text-primary hover:bg-bgSecondary",
        secondary: ""
    };

    return (
        <div className="w-full mt-8">
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`font-roboto tracking-[1px] w-full ${baseStyles} ${variantStyles[variant]} ${className}`}
            >
                {text}
            </button>
        </div>
    );
}