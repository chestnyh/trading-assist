import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import UserAvatar from "../avatar/UserAvatar";
import { useAuth } from "../../../app/contexts/AuthContext";
import { FOCUS_RING } from "../styles";

const UserMenuButton = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const position = {
                top: rect.bottom + 4,
                left: rect.right - 200,
                width: 200,
            };
            setDropdownPosition(position);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                dropdownMenuRef.current &&
                !dropdownMenuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener("mousedown", handleClickOutside);
            return () => {
                document.removeEventListener("mousedown", handleClickOutside);
            };
        }
    }, [isOpen]);

    const handleToggle = () => {
        setIsOpen((prev) => !prev);
    };

    const handleLogout = () => {
        logout();
        navigate("/sign-in");
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} className="relative">
            <button
                ref={buttonRef}
                type="button"
                onClick={handleToggle}
                className={`
                    flex items-center gap-1.5
                    p-0.5 pr-2
                    rounded-full
                    border border-neutral-200 dark:border-neutral-800
                    cursor-pointer
                    hover:bg-neutral-50 dark:hover:bg-neutral-900
                    transition-colors
                    ${FOCUS_RING}
                `}
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <UserAvatar
                    size={32}
                    name={user?.name || user?.nickname || user?.email}
                    alt={user?.nickname || user?.email || "User"}
                />
                <ChevronDown
                    className={`w-4 h-4 text-neutral-500 dark:text-neutral-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={dropdownMenuRef}
                    className="fixed z-[9999] font-inter-tight bg-white border border-neutral-200 rounded-xl shadow-lg overflow-hidden min-w-[200px] dark:bg-neutral-900 dark:border-neutral-800"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                    }}
                >
                    <div className="py-1">
                        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="text-sm font-semibold text-neutral-950 dark:text-white">
                                {user?.name || user?.nickname || "User"}
                            </div>
                            <div className="text-xs text-neutral-500 dark:text-neutral-400 mt-1 truncate">
                                {user?.email}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="
                                w-full
                                flex items-center gap-3
                                px-4 py-3
                                text-sm font-medium text-neutral-900 dark:text-white
                                hover:bg-neutral-50 dark:hover:bg-neutral-800
                                transition-colors
                                cursor-pointer
                            "
                        >
                            <LogOut className="w-4 h-4 text-neutral-500 dark:text-neutral-400" />
                            <span>Logout</span>
                        </button>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
};

export default UserMenuButton;
