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
                px-4 py-3
                rounded-md
                border border-text dark:border-[var(--color-text-dark)]
                 bg-bg-secondary dark:bg-[var(--color-bg-secondary-dark)]
                text-text dark:text-[var(--color-text-dark)]
                font-sans font-medium text-body-md
                transition-colors
                hover:bg-bgSecondary dark:hover:bg-[var(--color-bg-secondary-dark)]
                cursor-pointer
                ${className}
            `}
        >
            <span className="flex-shrink-0">{icon}</span>
            <span>{text}</span>
        </button>
    );
}
