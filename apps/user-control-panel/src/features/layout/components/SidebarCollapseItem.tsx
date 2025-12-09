import { ChevronDown, ChevronRight } from "lucide-react";
import { cloneElement, ReactElement, useState } from "react";

interface SidebarCollapseItemProps {
    icon: ReactElement;
    label: string;
    collapsed: boolean;
    children: React.ReactNode;
}


function SidebarCollapseItem({
    icon,
    label,
    collapsed,
    children
}: SidebarCollapseItemProps) {
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        if (!collapsed) setOpen((prev) => !prev);
    };

    return (
        <div className="mx-4 px-2 py-3 rounded-lg">
            <button
                type="button"
                onClick={handleClick}
                className={`
          group
          w-full flex items-center gap-4 min-w-0
          rounded-lg
          text-text
          transition-colors
          hover:text-accent
        `}
            >

                {cloneElement(icon, {
                    className: "w-7 h-7 flex-shrink-0 text-accent group-hover:text-primary",
                })}

                <span
                    className={`
              text-text text-body1
              group-hover:text-primary
              transition-all duration-300 ease-in-out whitespace-nowrap
              ${collapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"}
            `}
                >
                    {label}
                </span>

                <div
                    className={`
                        ml-auto flex-shrink-0
                        transition-all duration-300 ease-in-out
                        ${collapsed ? "opacity-0 max-w-0 overflow-hidden" : "opacity-100 max-w-full"}
                    `}
                >
                    {open ? (
                        <ChevronDown className="w-4 h-4 text-text group-hover:text-accent" />
                    ) : (
                        <ChevronRight className="w-4 h-4 text-text group-hover:text-accent" />
                    )}
                </div>
            </button>

            <div
                className={`
                    mt-1 ml-6 flex flex-col gap-1
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