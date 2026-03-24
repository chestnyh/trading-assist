export function AlertTriangle({ className = "w-5 h-5" }: { className?: string }) {
    return (
        <svg
            className={className}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                d="M12 2L1 21h22L12 2zm0 3.5L19.5 19H4.5L12 5.5z"
            />
            <path
                d="M12 9v3M12 15h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                fill="none"
            />
        </svg>
    );
}
