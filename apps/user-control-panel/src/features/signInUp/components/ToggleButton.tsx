import { useEffect, useState } from "react";


export function ToggleButton() {
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
            className="
       inline-flex items-center justify-center
        rounded-full border border-textSecondary/40 dark:border-[var(--color-text-secondary-dark)]/40
        px-3 py-1 text-body-sm
        text-text dark:text-[var(--color-text-dark)]
        hover:border-accent dark:hover:border-[var(--color-accent-dark)]
        hover:text-accent dark:hover:text-[var(--color-accent-dark)]
        transition-colors
      "
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
        >
            {isDark ? "☀ Light" : "☾ Dark"}
        </button>
    );
}