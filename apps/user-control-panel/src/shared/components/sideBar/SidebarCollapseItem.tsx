import { ChevronDown } from "lucide-react";
import { cloneElement, ReactElement, useState } from "react";
import { FOCUS_RING } from "../../ui/styles";

interface SidebarCollapseItemProps {
    icon: ReactElement;
    label: string;
    collapsed: boolean;
    children: React.ReactNode;
    onExpand?: () => void;
}


function SidebarCollapseItem({
    icon,
    label,
    collapsed,
    children,
    onExpand
}: SidebarCollapseItemProps) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (collapsed && onExpand) {
            setOpen(true);
            onExpand();
        } else if (!collapsed) {
            setOpen((prev) => !prev);
        }
    };

    return (
        <div>
            <button
                type="button"
                onClick={handleClick}
                aria-expanded={!collapsed && open}
                title={collapsed ? label : undefined}
                className={`
                    w-full flex items-center gap-3 min-w-0
                    h-11 px-3.5 rounded-full
                    text-sm font-medium
                    text-neutral-600 hover:bg-neutral-50 hover:text-neutral-950
                    dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-white
                    transition-colors cursor-pointer
                    ${FOCUS_RING}
                `}
            >
                {cloneElement(icon, {
                    className: "w-5 h-5 flex-shrink-0",
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

                <ChevronDown
                    className={`
                        ml-auto w-4 h-4 flex-shrink-0
                        transition-all duration-300 ease-in-out
                        ${open ? "rotate-180" : ""}
                        ${collapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100"}
                    `}
                    aria-hidden="true"
                />
            </button>

            <div
                className={`
                    mt-1 ml-5 pl-3 flex flex-col gap-1
                    border-l border-neutral-200 dark:border-neutral-800
                    transition-all duration-300 ease-in-out
                    ${collapsed || !open ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-screen"}
                `}
            >
                {children}
            </div>
        </div>
    );
}

export default SidebarCollapseItem;
