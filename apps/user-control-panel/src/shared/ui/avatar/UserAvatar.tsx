import { User } from "lucide-react";

interface UserAvatarProps {
    src?: string;
    alt?: string;
    name?: string;
    size?: number;
    className?: string;
}

function getInitials(name?: string): string {
    if (!name) return "";
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
}

export function UserAvatar({
    src,
    alt = "User avatar",
    name,
    size = 40,
    className = ""
}: UserAvatarProps) {
    const initials = getInitials(name);

    return (
        <div
            className={`
                flex items-center justify-center
                rounded-full
                border-2 border-border
                overflow-hidden
                bg-bg-secondary  
                ${className}
            `}
            style={{ width: size, height: size }}
        >
            {src ? (
                <img
                    src={src}
                    alt={alt}
                    className="w-full h-full object-cover"
                />
            ) : initials ? (
                <span
                    className="text-text-secondary font-semibold"
                    style={{ fontSize: size * 0.4 }}
                >
                    {initials}
                </span>
            ) : (
                <User
                    className="text-text-secondary"
                    size={size * 0.6}
                />
            )}
        </div>
    );
};

export default UserAvatar;
