import { useEffect, useMemo, useRef, useState } from 'react';
import JSONEditor, { JSONEditorOptions } from 'jsoneditor';

import { FieldLabel } from './FieldLabel';

interface JsonEditorFieldProps {
    label: string;
    id: string;
    required?: boolean;
    disabled?: boolean;
    value: unknown;
    onChange?: (value: unknown) => void;
    error?: string;
    mode?: 'tree' | 'code' | 'view';
}

export function JsonEditorField({
    label,
    id,
    required = false,
    disabled = false,
    value,
    onChange,
    error,
    mode = disabled ? 'view' : 'tree',
}: JsonEditorFieldProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const editorRef = useRef<JSONEditor | null>(null);
    const [localValue, setLocalValue] = useState<unknown>(value);

    const options: JSONEditorOptions = useMemo(() => {
        return {
            mode,
            mainMenuBar: true,
            navigationBar: true,
            statusBar: true,
            onChange: () => {
                if (!editorRef.current) return;
                try {
                    const next = editorRef.current.get();
                    setLocalValue(next);
                    onChange?.(next);
                } catch {
                    return;
                }
            },
        };
    }, [mode, onChange]);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    useEffect(() => {
        if (!containerRef.current) return;

        const editor = new JSONEditor(containerRef.current, options);
        editorRef.current = editor;

        try {
            editor.set(null);
        } catch (e) {
            void e;
        }

        return () => {
            editor.destroy();
            editorRef.current = null;
        };
    }, [options]);

    useEffect(() => {
        if (!editorRef.current) return;
        try {
            editorRef.current.set(localValue ?? null);
        } catch (e) {
            void e;
        }
        // We intentionally only want to run this once per editor instance creation.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [editorRef.current]);

    useEffect(() => {
        if (!editorRef.current) return;
        try {
            editorRef.current.update(localValue ?? null);
        } catch (e) {
            void e;
        }
    }, [localValue]);

    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} required={required} />

            <div
                id={id}
                className={`relative mt-2 rounded-md border-2 overflow-hidden ${
                    disabled ? 'opacity-60 bg-gray-100 cursor-not-allowed' : ''
                } ${
                    error
                        ? 'border-error'
                        : 'border-accent hover:bg-background focus-within:border-primary'
                }`}
            >
                <div ref={containerRef} className="w-full min-h-[260px]" />
            </div>

            {error && (
                <p className="mt-2 text-body-sm text-error dark:text-error">{error}</p>
            )}
        </div>
    );
}
