import { useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { ChevronDown, LogOut } from "lucide-react";
import UserAvatar from "../avatar/UserAvatar";
import { useAuth } from "../../../app/contexts/AuthContext";

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
                className="
                    flex items-center gap-2
                    px-2 py-1 
                    rounded-md
                    cursor-pointer
                    hover:bg-accent-hover/40
                    transition-colors
                "
                aria-label="User menu"
                aria-expanded={isOpen}
            >
                <UserAvatar
                    size={40}
                    name={user?.name || user?.nickname || user?.email}
                    alt={user?.nickname || user?.email || "User"}
                />
                <ChevronDown
                    className={`w-4 h-4 text-text-secondary hover:text-primary-hover transition-all ${isOpen ? "rotate-180" : ""
                        }`}
                />
            </button>

            {isOpen && typeof document !== 'undefined' && createPortal(
                <div
                    ref={dropdownMenuRef}
                    className="fixed z-[9999] bg-background border-2 border-border rounded-md shadow-lg overflow-hidden min-w-[200px]"
                    style={{
                        top: `${dropdownPosition.top}px`,
                        left: `${dropdownPosition.left}px`,
                        width: `${dropdownPosition.width}px`,
                    }}
                >
                    <div className="py-1">
                        <div className="px-4 py-3 border-b border-border">
                            <div className="text-sm font-semibold text-text">
                                {user?.name || user?.nickname || "User"}
                            </div>
                            <div className="text-xs text-text-secondary mt-1">
                                {user?.email}
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="
                                w-full
                                flex items-center gap-3
                                px-4 py-3
                                text-sm text-text
                                hover:bg-accent-hover/40
                                transition-colors
                                cursor-pointer
                            "
                        >
                            <LogOut className="w-4 h-4 text-text-secondary" />
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
