import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft, LayoutDashboard, Book, Settings, User, Check } from "lucide-react";
import { LogoMark } from "../LogoMark";
import SidebarItem from "./SidebarItem";
import SidebarCollapseItem from "./SidebarCollapseItem";
import { ICON_BUTTON } from "../../ui/styles";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside
            className={`
                sticky top-0 z-10
                h-screen flex flex-col
                font-inter-tight
                transition-all duration-300 ease-in-out
                ${collapsed ? "w-20" : "w-64"}
                bg-white dark:bg-neutral-950
                border-r border-neutral-200 dark:border-neutral-800
                overflow-hidden
            `}
        >
            <div className={`flex items-center gap-3 px-4 h-[61px] border-b border-neutral-200 dark:border-neutral-800 ${collapsed ? "justify-center" : ""}`}>
                {!collapsed && (
                    <Link to="/" className="flex items-center gap-2.5 min-w-0 rounded-full hover:opacity-80 transition-opacity">
                        <LogoMark />
                        <span className="text-lg font-semibold tracking-tight text-neutral-950 dark:text-white whitespace-nowrap">
                            Trading Assist
                        </span>
                    </Link>
                )}

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className={`${ICON_BUTTON} ${collapsed ? "" : "ml-auto"} !h-8 !w-8`}
                    aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {collapsed ? (
                        <ChevronRight className="w-4 h-4" />
                    ) : (
                        <ChevronLeft className="w-4 h-4" />
                    )}
                </button>
            </div>

            {/* Menu */}
            <nav className="mt-4 px-3 flex flex-col gap-1">
                <SidebarItem
                    icon={<LayoutDashboard />}
                    label="Dashboard"
                    collapsed={collapsed}
                    to="/dashboard"
                    active={location.pathname === "/dashboard"}
                />
                <SidebarItem
                    icon={<Book />}
                    label="Rules"
                    collapsed={collapsed}
                    to="/rules"
                    active={location.pathname.startsWith("/rules")}
                />
                <SidebarItem
                    icon={<Settings />}
                    label="Settings"
                    collapsed={collapsed}
                    to="/settings"
                    active={location.pathname === "/settings"}
                />
                <SidebarCollapseItem
                    icon={<Check />}
                    label="Management"
                    collapsed={collapsed}
                    onExpand={() => setCollapsed(false)}
                >
                    <SidebarItem
                        icon={<User />}
                        label="Users"
                        collapsed={collapsed}
                        variant="secondary"
                        to="/users"
                        active={location.pathname === "/users"}
                    />
                    <SidebarItem
                        icon={<Book />}
                        label="Rules"
                        collapsed={collapsed}
                        variant="secondary"
                        to="/management/rules"
                        active={location.pathname === "/management/rules"}
                    />
                </SidebarCollapseItem>
            </nav>
        </aside>
    );
}
