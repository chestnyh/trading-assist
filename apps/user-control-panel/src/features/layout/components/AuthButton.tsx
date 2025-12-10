import { LogInIcon } from "lucide-react"

const AuthButton = () => {
    return (
        <button
            type="button"
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

export default AuthButton