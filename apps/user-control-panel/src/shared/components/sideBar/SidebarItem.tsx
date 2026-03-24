import { cloneElement, ReactElement, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

type SidebarItemProps = {
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    to: string;
    active?: boolean;
    variant?: "primary" | "secondary"
};

function SidebarItem({ icon, label, collapsed, to, active, variant = "primary" }: SidebarItemProps) {
    const location = useLocation();
    const isActive = active !== null ? active : location.pathname === to;
    return (
        <Link
            to={to}
            data-active={isActive}
            className={`
        group
        mx-4 px-2 py-3 rounded-lg cursor-pointer transition-all
        hover:bg-transparent
        ${isActive ? "text-primary" : "text-text hover:text-primary"}
    `}
        >
            <div className="flex items-center gap-4 min-w-0">
                {cloneElement(icon as ReactElement, {
                    className: `
                ${variant === "primary" ? "w-7 h-7" : "w-4 h-4"}
                flex-shrink-0
                ${isActive ? "text-accent" : "text-accent group-hover:text-accent"}
            `
                })}

                <span
                    className={`
                    ${variant === "primary" ? "text-body1" : "text-body2"}
                    ${isActive ? "text-accent" : "text-text hover:text-accent"}
                    transition-all duration-300 ease-in-out whitespace-nowrap
                    ${collapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"}
                `}
                >
                    {label}
                </span>
            </div>
        </Link>

    );
}

export default SidebarItem;