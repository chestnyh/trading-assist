import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { ThemeToggle } from '../ui/buttons/ThemeToggle';
import UserMenuButton from '../ui/buttons/UserMenuButton';
import AuthButton from '../ui/buttons/AuthButton';
import { useAuth } from '../../app/contexts/AuthContext';
import { LogoMark } from "./LogoMark";

interface HeaderProps {
    className?: string;
    showSearch?: boolean;
}

const NAV_LINK = `
    text-sm font-medium
    text-neutral-600 hover:text-neutral-950
    dark:text-neutral-400 dark:hover:text-white
    transition-colors
`;


export function Header({ className = "", showSearch = true }: HeaderProps) {
    const { isAuthenticated } = useAuth();
    return (
        <header
            className={`
        sticky top-0 z-10
        flex flex-col
        font-inter-tight
        bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl
        border-b border-neutral-200 dark:border-neutral-800
        transition-colors duration-300 ease-in-out
        ${className}
      `}
        >
            <div className="px-4 md:px-8 lg:px-[100px]">
                <div className="flex items-center justify-between gap-6 py-3">

                    {!isAuthenticated && (
                        <Link
                            to="/"
                            className="flex items-center gap-2.5 flex-shrink-0 mr-4 hover:opacity-80 transition-opacity"
                        >
                            <LogoMark />

                            <span className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white">
                                Trading Assist
                            </span>
                        </Link>
                    )}

                    <nav className="hidden md:flex items-center gap-8">
                        <Link to="/about" className={NAV_LINK}>
                            About
                        </Link>
                        <Link to="/documents" className={NAV_LINK}>
                            See documentation
                        </Link>
                        <Link to="/contact" className={NAV_LINK}>
                            Contact us
                        </Link>
                    </nav>


                    <div className="flex items-center gap-3 flex-1 justify-end">

                        {showSearch && (
                            <div className="hidden md:flex items-center gap-2 w-full max-w-xs rounded-full
                                border border-neutral-200 dark:border-neutral-800
                                bg-neutral-50 dark:bg-neutral-900
                                px-4 py-2
                                focus-within:border-forest-100 dark:focus-within:border-brand-300
                                transition-colors">
                                <Search className="w-4 h-4 flex-shrink-0 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search here"
                                    className="w-full bg-transparent outline-none text-sm text-neutral-950 dark:text-white placeholder:text-neutral-400"
                                />
                            </div>
                        )}


                        {isAuthenticated ? (
                            <UserMenuButton />
                        ) : (
                            <AuthButton />
                        )}

                        <ThemeToggle
                            className="
                                flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-full
                                border border-neutral-200 dark:border-neutral-800
                                text-neutral-700 dark:text-neutral-300
                                hover:bg-neutral-50 dark:hover:bg-neutral-900
                                transition-colors
                                [&>svg]:w-4 [&>svg]:h-4
                                focus-visible:outline-2 focus-visible:outline-offset-2
                                focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300
                            "
                        />
                    </div>
                </div>
            </div>
        </header>
    );
}
