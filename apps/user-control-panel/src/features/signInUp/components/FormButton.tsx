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
    const baseClasses = "w-full py-3 px-6 rounded-lg font-semibold transition-colors duration-200";
    
    const variantClasses = {
        primary: "bg-blue-500 text-white hover:bg-blue-600",
        secondary: "bg-gray-500 text-white hover:bg-gray-600",
        outline: "bg-transparent border-2 border-blue-500 text-blue-500 hover:bg-blue-50"
    };

    return (
        <div className="w-full pt-5">
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className={`${baseClasses} ${variantClasses[variant]} ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${className}`}
            >
                {text}
            </button>
        </div>
    );
}