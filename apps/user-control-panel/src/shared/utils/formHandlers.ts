import { ChangeEvent } from "react";

/**
 * Creates a handler for text input fields
 * @param setField - Function to update field value in state
 * @param field - Field name to update
 */
export function createInputHandler<T extends string>(
    setField: (field: T, value: string) => void,
    field: T
) {
    return (e: ChangeEvent<HTMLInputElement>) => {
        setField(field, e.target.value);
    };
}

/**
 * Creates a handler for select fields
 * @param setField - Function to update field value in state
 * @param field - Field name to update
 */
export function createSelectHandler<T extends string>(
    setField: (field: T, value: string) => void,
    field: T
) {
    return (e: ChangeEvent<HTMLSelectElement>) => {
        setField(field, e.target.value);
    };
}

/**
 * Creates a handler for checkbox fields
 * @param setField - Function to update field value in state
 * @param field - Field name to update
 */
export function createCheckboxHandler<T extends string>(
    setField: (field: T, value: boolean) => void,
    field: T
) {
    return (e: ChangeEvent<HTMLInputElement>) => {
        setField(field, e.target.checked);
    };
}
