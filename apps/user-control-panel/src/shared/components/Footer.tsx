import { Link } from "react-router-dom";

interface FooterProps {
    className?: string;
}

export function Footer({ className = "" }: FooterProps) {
    return (
        <footer className={`
            flex items-center justify-between
            px-4 md:px-8 lg:px-[100px]
            transition-all duration-300 ease-in-out 
            bg-bg-secondary/70 backdrop-blur-xl
            
            h-16
            ${className}
        `}>


            <nav className="flex items-center gap-14">
                <Link
                    to="/privacy-policy"
                    className="text-text-secondary hover:text-primary-hover transition-colors text-body-lg"
                >
                    Privacy
                </Link>
                <Link
                    to="/terms-of-service"
                    className="text-text-secondary hover:text-primary-hover transition-colors text-body-lg"
                >
                    Terms
                </Link>
            </nav>
            <div className="flex items-center gap-4">
                <span className="text-text-secondary text-body-md font-medium">
                    © 2025 Trading Assist. All rights reserved.
                </span>
                <span className="text-text-secondary text-body-md font-medium">
                    v1.0.0
                </span>
            </div>

        </footer>
    );
}
