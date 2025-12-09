import { useState } from "react";
import { ChevronRight, ChevronLeft, LayoutDashboard, Book, Settings, User, Check, LogOut } from "lucide-react";
import { ToggleButton } from "../signInUp/components/ToggleButton";
import logo from "../../shared/components/logo.svg";
import SidebarItem from "./components/SidebarItem";
import SidebarCollapseItem from "./components/SidebarCollapseItem";
import { FormButton } from "../signInUp/components/FormButton";
import UserAvatar from "./components/UserAvatar";

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);

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
                <div
                    className={`
                        mx-4 px-2
                        transition-all duration-300 ease-in-out
                        ${collapsed ? "opacity-0 max-h-0 overflow-hidden" : "opacity-100 max-h-screen"}
                    `}
                >
                    <ToggleButton />
                </div>
            </nav>

            {/* Profile */}
            <div className="mt-auto  transition-all  duration-300 ease-in-out  whitespace-nowrap">
                <div className="flex items-center ml-1 p-4">
                    <UserAvatar size={40} />
                    <span
                        className={` 
                            text-primary text-btn-lg
                            transition-all duration-300 ease-in-out 
                            ${collapsed ? "opacity-0 max-w-0 overflow-hidden" : "ml-4 opacity-100 max-w-full"}
                               
                        `}
                    >
                        Profile Name
                    </span>
                </div>

                <div className="flex items-center    p-4 ">
                    <FormButton
                        text={collapsed ? undefined : "Sign Out"}
                        variant="outline"
                        leftIcon={<LogOut className={collapsed ? "ml-2 rounded-lg w-5 h-5" : ""} />}
                    />
                </div>
            </div>
        </aside>
    );
}
