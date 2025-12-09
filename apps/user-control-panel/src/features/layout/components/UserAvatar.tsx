import { User } from "lucide-react";

interface UserAvatarProps {
    src?: string;
    alt?: string;
    size?: number;
    className?: string;
}

const UserAvatar = ({
    src,
    alt = "User avatar",
    size = 40,
    className = ""
}: UserAvatarProps) => {
    return (
        <div
            className={`
                flex items-center justify-center
                rounded-full
                border-2 border-[var(--color-border)] dark:border-[var(--color-border-dark)]
                overflow-hidden
                bg-[var(--color-bg-secondary)] dark:bg-[var(--color-bg-secondary-dark)]
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
            ) : (
                <User
                    className="text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]"
                    size={size * 0.6}
                />
            )}
        </div>
    );
};

export default UserAvatar;