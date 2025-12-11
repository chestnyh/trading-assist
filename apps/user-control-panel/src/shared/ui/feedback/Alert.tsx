import { AlertTriangle } from "../../../features/signInUp/components/icons/AlertTriangle";

export function Alert() {
    return (
        <div
            className={`
                flex items-center gap-3
                px-4 py-3
                rounded-md
                bg-[#ffebeb] dark:bg-[#2d1a1a]
                border border-error dark:border-error
                shadow-md
            `}
        >

            <p className="flex-1 text-body-md dark:text-text-dark text-error dark:text-error">
                An unexpected error has occurred. We are already working to fix it.
                <br />
                Please try again later.
            </p>
            <div className="flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-error" />
            </div>
        </div>
    );
}
