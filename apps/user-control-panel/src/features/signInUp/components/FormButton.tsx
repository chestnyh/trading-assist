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


    return (
        <div className="w-full mt-8">
            <button
                type={type}
                onClick={onClick}
                disabled={disabled}
                className="font-roboto tracking-[1px] w-full py-3 px-6 rounded-lg font-medium bg-primary text-white hover:bg-accent"
            >
                {text}
            </button>
        </div>
    );
}