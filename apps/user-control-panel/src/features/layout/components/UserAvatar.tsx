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
            ) : (
                <User
                    className="text-text-secondary "
                    size={size * 0.6}
                />
            )}
        </div>
    );
};

export default UserAvatar;