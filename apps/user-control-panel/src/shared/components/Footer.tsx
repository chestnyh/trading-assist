import { Link } from "react-router-dom";

interface FooterProps {
    className?: string;
}

const FOOTER_LINK = `
    text-sm font-medium
    text-neutral-600 hover:text-neutral-950
    dark:text-neutral-400 dark:hover:text-white
    transition-colors
`;

export function Footer({ className = "" }: FooterProps) {
    return (
        <footer className={`
            flex flex-col sm:flex-row items-center justify-between gap-3
            px-4 md:px-8 lg:px-[100px] py-5
            font-inter-tight
            bg-white dark:bg-neutral-950
            border-t border-neutral-200 dark:border-neutral-800
            transition-colors duration-300 ease-in-out
            ${className}
        `}>


            <nav className="flex items-center gap-8">
                <Link to="/privacy-policy" className={FOOTER_LINK}>
                    Privacy
                </Link>
                <Link to="/terms-of-service" className={FOOTER_LINK}>
                    Terms
                </Link>
            </nav>
            <div className="flex items-center gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <span>
                    © 2025 Trading Assist. All rights reserved.
                </span>
                <span className="rounded-full bg-neutral-100 dark:bg-neutral-900 px-2 py-0.5 text-xs font-medium">
                    v1.0.0
                </span>
            </div>

        </footer>
    );
}
