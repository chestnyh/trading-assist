import { LogInIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function AuthButton() {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/sign-in");
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            className="
                                inline-flex items-center justify-center gap-2
                                h-9 px-3 py-2
                                text-sm font-medium
                                rounded-md
                                border-2 border-border text-primary bg-transparent
                                hover:bg-primary hover:text-text
                                active:bg-primary-active
                                transition-colors
                                whitespace-nowrap
                            "
        >
            <LogInIcon className="w-4 h-4 flex-shrink-0" />
            <span>Sign In</span>
        </button>
    )
}

