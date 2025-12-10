import { ChevronDown } from "lucide-react"
import UserAvatar from "./UserAvatar"

const UserMenuButton = () => {
    return (
        <button
            type="button"
            className="
                flex items-center gap-2
                px-2 py-1 
                rounded-md
                cursor-pointer
                hover:bg-accent-hover/40
                transition-colors
            "
            aria-label="User menu"
        >
            <UserAvatar size={40} />
            <ChevronDown className="w-4 h-4 text-text-secondary hover:text-primary-hover transition-colors" />
        </button>
    )
}

export default UserMenuButton