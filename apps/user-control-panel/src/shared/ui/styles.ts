// Shared class sets for the signed-in app pages, matching the landing page style

export const FOCUS_RING =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300";

export const PAGE = "px-4 md:px-8 lg:px-12 py-8 lg:py-10 max-w-5xl mx-auto font-inter-tight";

export const PAGE_TITLE = "text-3xl md:text-4xl font-semibold tracking-tight text-neutral-950 dark:text-white";

export const PAGE_LEAD = "mt-2 text-lg text-neutral-600 dark:text-neutral-400";

export const CARD = "rounded-xl border border-neutral-200 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900";

// Nested surface inside a card (e.g. a child action, a log entry)
export const SUBTLE_SURFACE = "rounded-xl border border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950";

export const SECTION_LABEL = "text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400";

export const FIELD_LABEL = "text-sm font-medium text-neutral-700 dark:text-neutral-300";

// Compact text field for dense editors (action editor, settings forms)
export const COMPACT_FIELD = `
    w-full rounded-lg border px-3 py-2 text-sm
    border-neutral-200 bg-white text-neutral-950 placeholder:text-neutral-400
    hover:border-neutral-300
    focus:outline-none focus:ring-2 focus:border-forest-300 focus:ring-forest-300/15
    dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:placeholder:text-neutral-500
    dark:hover:border-neutral-700 dark:focus:border-brand-300 dark:focus:ring-brand-300/20
    disabled:opacity-70 disabled:cursor-default disabled:hover:border-neutral-200 dark:disabled:hover:border-neutral-800
    transition-colors
`;

export const ICON_BUTTON = `
    h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full
    border border-neutral-200 dark:border-neutral-800
    text-neutral-700 dark:text-neutral-300
    hover:bg-neutral-50 dark:hover:bg-neutral-800
    transition-colors cursor-pointer
    ${FOCUS_RING}
`;

export const ICON_BUTTON_DANGER = `
    h-9 w-9 flex-shrink-0 flex items-center justify-center rounded-full
    border border-neutral-200 dark:border-neutral-800
    text-error
    hover:bg-error/10 hover:border-error/30
    transition-colors cursor-pointer
    ${FOCUS_RING}
`;

export const SMALL_BUTTON_PRIMARY = `
    inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full
    bg-brand-300 text-forest-300 text-sm font-semibold
    hover:bg-brand-200 transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-brand-300
    ${FOCUS_RING}
`;

export const SMALL_BUTTON_SECONDARY = `
    inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full
    border border-neutral-200 bg-white text-neutral-900 text-sm font-semibold
    hover:bg-neutral-50
    dark:border-neutral-800 dark:bg-neutral-900 dark:text-white dark:hover:bg-neutral-800
    transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    ${FOCUS_RING}
`;

export const SMALL_BUTTON_DANGER = `
    inline-flex items-center justify-center gap-2 h-9 px-4 rounded-full
    border border-error/30 text-error text-sm font-semibold
    hover:bg-error/10
    transition-colors cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    ${FOCUS_RING}
`;

export const CHIP = "rounded-full bg-brand-0 px-3 py-1 text-xs font-medium text-forest-200 dark:bg-forest-300 dark:text-brand-200";

export const CHIP_NEUTRAL = "rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300";

// Informational note box (instructions, hints)
export const NOTE = "rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300";

export const WARNING_NOTE = "rounded-xl border border-amber-300/60 bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-300";
