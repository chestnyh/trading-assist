import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { ICON_BUTTON } from "../styles";


interface ThemeToggleProps {
    className?: string;
}

const DEFAULT_CLASS_NAME = ICON_BUTTON;

export function ThemeToggle({ className = DEFAULT_CLASS_NAME }: ThemeToggleProps) {
    const [isDark, setIsDark] = useState<boolean>(() => {
        if (typeof window === "undefined") return false;

        if ("theme" in localStorage) {
            return localStorage.theme === "dark";
        }

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = document.documentElement;

        if (isDark) {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            type="button"
            onClick={() => setIsDark((prev) => !prev)}
            className={className}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? <Sun /> : <Moon />}
        </button>
    );
}
