// Shared class sets for text-like form fields (input, select, country select), matching the landing page style
export const FIELD_BASE = `
    w-full h-12
    px-4
    text-base
    rounded-xl
    border
    appearance-none
    transition-colors
    focus:outline-none focus:ring-2
    bg-white placeholder:text-neutral-400
    dark:bg-neutral-900 dark:placeholder:text-neutral-500
`;

export const FIELD_TEXT = "text-neutral-950 dark:text-white";

export const FIELD_PLACEHOLDER_TEXT = "text-neutral-400 dark:text-neutral-500";

export const FIELD_DEFAULT = `
    border-neutral-200 hover:border-neutral-300
    focus:border-forest-300 focus:ring-forest-300/15
    dark:border-neutral-800 dark:hover:border-neutral-700
    dark:focus:border-brand-300 dark:focus:ring-brand-300/20
`;

export const FIELD_ERROR = "border-error focus:border-error focus:ring-error/20";

export const FIELD_ERROR_TEXT = "mt-2 text-sm text-error";

// Box for checkboxes; the check mark is drawn by a sibling svg using `peer-checked`
export const CHECKBOX_BOX = `
    peer
    w-5 h-5
    rounded-md
    border
    appearance-none
    cursor-pointer
    transition-colors
    bg-white dark:bg-neutral-900
    checked:bg-forest-300 checked:border-forest-300
    dark:checked:bg-brand-300 dark:checked:border-brand-300
    focus-visible:outline-2 focus-visible:outline-offset-2
    focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300
`;

export const CHECKBOX_MARK =
    "pointer-events-none absolute inset-0 m-auto w-3.5 h-3.5 hidden peer-checked:block text-white dark:text-forest-300";
