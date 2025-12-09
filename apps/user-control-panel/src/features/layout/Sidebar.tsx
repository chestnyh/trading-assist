import { useState } from "react";
import { ChevronRight, ChevronLeft, LayoutDashboard, Book, Settings, User, Check } from "lucide-react";
import { ToggleButton } from "../signInUp/components/ToggleButton";
import logo from "../../shared/components/logo.svg";
import SidebarItem from "./components/SidebarItem";
import SidebarCollapseItem from "./components/SidebarCollapseItem";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <aside
            className={`
        h-screen flex flex-col
        transition-all duration-300
        ${collapsed ? "w-20" : "w-72"}
        bg-bg-secondary/70 backdrop-blur-xl 
        border-r border-border
      `}
        >
            {/* Header with logo + collapse button */}
            <div className="flex flex-col">
                <div className="flex items-center gap-3 px-4 pt-6 pb-4">
                    <div className="flex items-center gap-3 flex-shrink-0">
                        <img src={logo} alt="Logo" className="w-8 h-8" />
                        {!collapsed && (
                            <span className="text-primary text-h5 font-semibold">
                                Trading Assist
                            </span>
                        )}
                    </div>

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
                />
                <SidebarItem icon={<Book />} label="Rules" collapsed={collapsed} />
                <SidebarItem icon={<Settings />} label="Settings" collapsed={collapsed} />
                <SidebarCollapseItem
                    icon={<Check />}
                    label="Management"
                    collapsed={collapsed}
                >
                    <SidebarItem
                        icon={<User />}
                        label="Users"
                        collapsed={collapsed}
                        variant="secondary"
                    />
                    <SidebarItem
                        icon={<Book />}
                        label="Rules"
                        collapsed={collapsed}
                        variant="secondary"
                    />
                </SidebarCollapseItem>
                <ToggleButton />
            </nav>

            {/* Profile */}
            <div className="mt-auto p-4">
                <div
                    className="
            flex items-center gap-3 p-2 rounded-lg
            border border-border
            hover:bg-primary-hover hover:text-white
            transition
          "
                >
                    <User className="text-text" />
                    {!collapsed && (
                        <span className="text-text-secondary">
                            Profile
                        </span>
                    )}
                </div>
            </div>
        </aside>
    );
}
