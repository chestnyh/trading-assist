import { cloneElement, ReactElement, ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { FOCUS_RING } from "../../ui/styles";

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
    const isActive = active ?? location.pathname === to;
    return (
        <Link
            to={to}
            data-active={isActive}
            aria-current={isActive ? "page" : undefined}
            title={collapsed ? label : undefined}
            className={`
                flex items-center gap-3 min-w-0
                ${variant === "primary" ? "h-11" : "h-9"}
                px-3.5 rounded-full
                text-sm font-medium
                transition-colors
                ${isActive
                    ? "bg-brand-0 text-forest-300 dark:bg-forest-300 dark:text-brand-200"
                    : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white"
                }
                ${FOCUS_RING}
            `}
        >
            {cloneElement(icon as ReactElement, {
                className: `${variant === "primary" ? "w-5 h-5" : "w-4 h-4"} flex-shrink-0`,
                "aria-hidden": true,
            })}

            <span
                className={`
                    transition-all duration-300 ease-in-out whitespace-nowrap
                    ${collapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"}
                `}
            >
                {label}
            </span>
        </Link>
    );
}

export default SidebarItem;
