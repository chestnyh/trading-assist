import { ReactNode } from "react";

interface AuthSocialButtonProps {
    text: string;
    icon: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function AuthSocialButton({
    text,
    icon,
    onClick,
    className = "",
}: AuthSocialButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`
                w-full
                flex items-center justify-center gap-3
                h-12 px-4
                rounded-full
                border border-neutral-200 dark:border-neutral-800
                bg-white dark:bg-neutral-900
                text-neutral-900 dark:text-white
                font-inter-tight font-semibold text-base
                transition-colors
                hover:bg-neutral-50 dark:hover:bg-neutral-800
                cursor-pointer
                focus-visible:outline-2 focus-visible:outline-offset-2
                focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300
                ${className}
            `}
        >
            <span className="flex-shrink-0">{icon}</span>
            <span>{text}</span>
        </button>
    );
}
