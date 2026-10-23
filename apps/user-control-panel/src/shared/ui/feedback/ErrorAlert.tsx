interface ErrorAlertProps {
    message: string | null | undefined;
    className?: string;
}

export function ErrorAlert({ message, className = "" }: ErrorAlertProps) {
    if (!message) return null;

    return (
        <div className={`mt-4 p-4 rounded-xl bg-error/10 border border-error/30 ${className}`}>
            <p className="text-sm text-error">{message}</p>
        </div>
    );
}
