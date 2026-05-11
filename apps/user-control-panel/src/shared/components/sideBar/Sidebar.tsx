import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronRight, ChevronLeft, LayoutDashboard, Book, Settings, User, Check } from "lucide-react";
import logo from "../logo.svg";
import SidebarItem from "./SidebarItem";
import SidebarCollapseItem from "./SidebarCollapseItem";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();

    return (
        <aside
            className={`
              sticky top-0 z-10
        h-screen flex flex-col
        transition-all duration-300 ease-in-out
        ${collapsed ? "w-20" : "w-72"}
        bg-bg-secondary/70 backdrop-blur-xl 
        border-r border-border
        overflow-hidden
      `}
        >
            <div className="flex flex-col">

                <div className="flex items-center gap-3 px-4 pt-6 pb-4">
                    <Link to="/" className="flex items-center gap-3 flex-shrink-0 hover:opacity-80 transition-opacity">
                        <img src={logo} alt="Logo" className="w-8 h-8" />
                        {!collapsed && (
                            <span className="text-primary text-h5 font-semibold">
                                Trading Assist
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="
              ml-auto flex h-8 w-8 items-center justify-center
              rounded-full
              text-accent hover:text-primary
              hover:bg-accent-hover/40
              transition
            "
                        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                    >
                        {collapsed ? (
                            <ChevronRight className="w-4 h-4" />
                        ) : (
                            <ChevronLeft className="w-4 h-4" />
                        )}
                    </button>
                </div>

                <div className="border-b-2 border-border mx-4 mb-4" />
            </div>

            {/* Menu */}
            <nav className="mt-2 flex flex-col gap-1">
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
                    active={location.pathname === "/rules"}
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
                <div
                    className={`
                        mx-4 px-2
                        transition-all duration-300 ease-in-out
                        ${collapsed ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-screen"}
                    `}
                >
                </div>
            </nav>
        </aside>
    );
}
