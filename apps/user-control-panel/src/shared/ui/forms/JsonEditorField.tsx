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
    const [heightPx, setHeightPx] = useState<number>(320);
    const resizeStateRef = useRef<{
        startY: number;
        startHeight: number;
        isResizing: boolean;
    } | null>(null);

    const options: JSONEditorOptions = useMemo(() => {
        return {
            mode,
            mainMenuBar: true,
            navigationBar: true,
            statusBar: true,
            onChange: async () => {
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

        // jsoneditor sets _debouncedValidate = debounce(this._validateAndCatch.bind(this), ...)
        // inside textmode.create / treemode.create (after extend(this, mixin)).
        // _validateAndCatch calls this.validate()["catch"](...) but validate() can return
        // undefined on transient invalid JSON → crash. We replace _debouncedValidate
        // with a safe wrapper AFTER the instance is fully initialised.
        const editorAny = editor as any;
        const safeValidate = () => {
            try {
                const result: unknown = typeof editorAny.validate === 'function'
                    ? editorAny.validate()
                    : undefined;
                const promise = (result != null && typeof (result as any).catch === 'function')
                    ? result as Promise<unknown>
                    : Promise.resolve([]);
                promise.catch(() => {
                // ignore  
                });
            } catch {
                // ignore transient parse errors
            }
        };
        if ('_debouncedValidate' in editorAny) {
            editorAny._debouncedValidate = safeValidate;
        }

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
        // jsoneditor recalculates layout on window resize
        window.dispatchEvent(new Event('resize'));
    }, [heightPx]);

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
                <div ref={containerRef} className="w-full" style={{ height: heightPx }} />
                {!disabled && (
                    <div
                        role="separator"
                        aria-label="Resize JSON editor"
                        className="absolute bottom-0 left-0 w-full h-3 cursor-ns-resize bg-transparent"
                        onMouseDown={(e) => {
                            resizeStateRef.current = {
                                startY: e.clientY,
                                startHeight: heightPx,
                                isResizing: true,
                            };

                            const onMove = (ev: MouseEvent) => {
                                const state = resizeStateRef.current;
                                if (!state?.isResizing) return;
                                const delta = ev.clientY - state.startY;
                                const next = Math.max(260, state.startHeight + delta);
                                setHeightPx(next);
                            };

                            const onUp = () => {
                                const state = resizeStateRef.current;
                                if (state) state.isResizing = false;
                                window.removeEventListener('mousemove', onMove);
                                window.removeEventListener('mouseup', onUp);
                            };

                            window.addEventListener('mousemove', onMove);
                            window.addEventListener('mouseup', onUp);
                        }}
                    />
                )}
            </div>

            {error && (
                <p className="mt-2 text-body-sm text-error dark:text-error">{error}</p>
            )}
        </div>
    );
}
