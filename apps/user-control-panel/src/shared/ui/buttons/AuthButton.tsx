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
                                h-9 px-4
                                text-sm font-semibold
                                rounded-full
                                bg-forest-300 text-white dark:text-brand-200
                                hover:bg-forest-200
                                transition-colors
                                whitespace-nowrap
                                focus-visible:outline-2 focus-visible:outline-offset-2
                                focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300
                            "
        >
            <LogInIcon className="w-4 h-4 flex-shrink-0" />
            <span>Sign In</span>
        </button>
    )
}

