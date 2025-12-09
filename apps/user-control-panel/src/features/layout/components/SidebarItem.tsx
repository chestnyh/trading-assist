import { cloneElement, ReactElement, ReactNode } from "react";
import { Link } from "react-router-dom";

type SidebarItemProps = {
    icon: ReactNode;
    label: string;
    collapsed: boolean;
    active?: boolean;
    variant?: "primary" | "secondary"
};

function SidebarItem({ icon, label, collapsed, active = false, variant = "primary" }: SidebarItemProps) {
    return (
        <Link
            to={"/main"}
            data-active={active}
            className={`
        group
        mx-4 px-2 py-3 rounded-lg cursor-pointer transition-all
        hover:bg-transparent
        ${active ? "text-primary" : "text-text hover:text-accent"}
    `}
        >
            <div className="flex items-center gap-4">
                {cloneElement(icon as ReactElement, {
                    className: `
                ${variant === "primary" ? "w-7 h-7" : "w-4 h-4"}
                ${active ? "text-accent" : "text-accent group-hover:text-accent"}
            `
                })}

                {!collapsed && (
                    <span
                        className={`
                    ${variant === "primary" ? "text-body1" : "text-body2"}
                    ${active ? "text-accent" : "text-text group-hover:text-accent"}
                `}
                    >
                        {label}
                    </span>
                )}
            </div>
        </Link>

    );
}

export default SidebarItem;