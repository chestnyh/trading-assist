import { Link } from 'react-router-dom';
import { LogInIcon, Search } from 'lucide-react';
import { ToggleButton } from '../../signInUp/components/ToggleButton';
import logo from "../../../shared/components/logo.svg";

interface HeaderProps {
    className?: string;
    isAuthenticated?: boolean;
}

export function Header({ className = "", isAuthenticated = false }: HeaderProps) {
    return (
        <header
            className={`
        sticky top-0 z-10
        flex flex-col
        transition-all duration-300 ease-in-out 
        bg-bg-secondary/70 backdrop-blur-xl  
        overflow-hidden 
        ${className}
      `}
        >
            <div className="px-4 md:px-8 lg:px-[100px]">
                <div className="flex items-center justify-between gap-6 py-4">

                    {!isAuthenticated && (<div className="flex items-center gap-3 flex-shrink-0">
                        <img src={logo} alt="Logo" className="w-8 h-8" />

                        <span className="text-primary text-h5 font-semibold mr-4">
                            Trading Assist
                        </span>

                    </div>)}

                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            to="/about"
                            className="text-text-secondary hover:text-primary-hover transition-colors"
                        >
                            About
                        </Link>
                        <Link
                            to="/documents"
                            className="text-text-secondary hover:text-primary-hover transition-colors"
                        >
                            See documentation
                        </Link>
                        <Link
                            to="/contact"
                            className="text-text-secondary hover:text-primary-hover transition-colors"
                        >
                            Contact us
                        </Link>
                    </nav>


                    <div className="flex items-center gap-4 flex-1 justify-end">

                        <div className="hidden md:flex items-center gap-2 w-full max-w-md rounded-full 
                            border border-primary/60 bg-bg-secondary/60 
                            px-4 py-2 shadow-[0_0_0_1px_rgba(59,130,246,0.3)]">
                            <input
                                type="text"
                                placeholder="Search here"
                                className="w-full bg-transparent outline-none text-text placeholder:text-text-secondary text-sm"
                            />
                            <Search className="w-4 h-4 text-primary" />
                        </div>


                        <button
                            type="button"
                            className="
                                inline-flex items-center justify-center gap-2
                                h-9 px-3 py-2
                                text-sm font-medium
                                rounded-md
                                border-2 border-border text-primary bg-transparent
                                hover:bg-primary hover:text-text
                                active:bg-primary-active
                                transition-colors
                                whitespace-nowrap
                            "
                        >
                            <LogInIcon className="w-4 h-4 flex-shrink-0" />
                            <span>Log In</span>
                        </button>

                        <ToggleButton />
                    </div>
                </div>
            </div>
        </header>
    );
}
