import { ChangeEvent, useState, useRef, useEffect, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { FieldLabel } from "./FieldLabel";
import * as FlagIcons from "country-flag-icons/react/3x2";
import { CountryOption } from "../../data/countries";
import { ChevronDown } from "lucide-react";

interface CountrySelectProps {
    label: string;
    id: string;
    name: string;
    options: CountryOption[];
    placeholder?: string;
    value?: string;
    onChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
    error?: string;
    required?: boolean;
}

export function CountrySelect({
    label,
    id,
    name,
    options,
    placeholder = "Select your country",
    value,
    onChange,
    error,
    required = false,
}: CountrySelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState<CountryOption | null>(
        options.find((opt) => opt.value === value) || null
    );
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0, maxHeight: 0 });
    const containerRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const dropdownMenuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const option = options.find((opt) => opt.value === value);
        setSelectedOption(option || null);
    }, [value, options]);

    useLayoutEffect(() => {
        if (isOpen && buttonRef.current) {
            const rect = buttonRef.current.getBoundingClientRect();
            const viewportHeight = window.innerHeight;
            const availableHeight = viewportHeight - rect.bottom - 4;
            const maxHeight = Math.max(200, availableHeight);

            const position = {
                top: rect.bottom + 4,
                left: rect.left,
                width: rect.width,
                maxHeight: maxHeight,
            };
            setDropdownPosition(position);
        }
    }, [isOpen]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node;
            if (
                containerRef.current &&
                !containerRef.current.contains(target) &&
                dropdownMenuRef.current &&
                !dropdownMenuRef.current.contains(target)
            ) {
                setIsOpen(false);
            }
        };

        const updatePosition = () => {
            if (buttonRef.current) {
                const rect = buttonRef.current.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const availableHeight = viewportHeight - rect.bottom - 4;
                const maxHeight = Math.max(200, availableHeight);

                setDropdownPosition({
                    top: rect.bottom + 4,
                    left: rect.left,
                    width: rect.width,
                    maxHeight: maxHeight,
                });
            }
        };

        if (isOpen) {
            const timeoutId = setTimeout(() => {
                document.addEventListener("mousedown", handleClickOutside);
            }, 0);

            window.addEventListener("scroll", updatePosition, true);
            window.addEventListener("resize", updatePosition);

            return () => {
                clearTimeout(timeoutId);
                document.removeEventListener("mousedown", handleClickOutside);
                window.removeEventListener("scroll", updatePosition, true);
                window.removeEventListener("resize", updatePosition);
            };
        }
    }, [isOpen]);

    const handleSelect = (option: CountryOption) => {
        setSelectedOption(option);
        setIsOpen(false);

        if (onChange) {
            const syntheticEvent = {
                target: { value: option.value, name },
            } as ChangeEvent<HTMLSelectElement>;
            onChange(syntheticEvent);
        }
    };

    return (
        <div className="w-full pt-5">
            <FieldLabel label={label} id={id} required={required} />
            <div className="relative mt-2" ref={containerRef}>
                <input type="hidden" name={name} value={value || ""} />
                <button
                    ref={buttonRef}
                    type="button"
                    onClick={() => {
                        setIsOpen(!isOpen);
                    }}
                    className={`
                        w-full h-12
                        px-4 pr-10
                        text-body-md
                        rounded-md
                        appearance-none
                        transition-colors
                        focus:outline-none
                        flex items-center justify-between
                        ${error
                            ? "border-2 border-error text-text bg-background focus:border-error focus:ring-2 focus:ring-error"
                            : !value || value === ""
                                ? "border-2 border-accent text-text-secondary bg-background hover:bg-background hover:text-text focus:border-primary focus:bg-background focus:text-text focus:ring-2 focus:ring-primary"
                                : "border-2 border-accent text-accent bg-background hover:bg-background hover:text-text focus:border-primary focus:bg-background focus:text-text focus:ring-2 focus:ring-primary"
                        }
                    `}
                >
                    <span className="flex items-center gap-2">
                        {selectedOption ? (
                            <>

                                {(() => {
                                    const Flag =
                                        (FlagIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                                        selectedOption.countryCode.trim().toUpperCase()
                                        ];
                                    return Flag ? (
                                        <Flag className="w-5 h-4 rounded-[2px] shadow-sm overflow-hidden" />
                                    ) : null;
                                })()}
                                <span>{selectedOption.label}</span>
                            </>
                        ) : (
                            <span className="text-text-secondary">{placeholder}</span>
                        )}
                    </span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                </button>

                {isOpen && typeof document !== 'undefined' && createPortal(
                    <div
                        ref={dropdownMenuRef}
                        className="country-select-dropdown fixed z-[9999] bg-background border-2 border-border rounded-md shadow-lg overflow-auto min-w-[200px]"
                        style={{
                            top: `${dropdownPosition.top || 0}px`,
                            left: `${dropdownPosition.left || 0}px`,
                            width: `${dropdownPosition.width || (buttonRef.current?.offsetWidth || 200)}px`,
                            maxHeight: `${dropdownPosition.maxHeight || 400}px`,
                        }}
                    >
                        {options.map((option) => {
                            const Flag =
                                (FlagIcons as Record<string, React.ComponentType<{ className?: string }>>)[
                                option.countryCode
                                ];

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleSelect(option)}
                                    className={`
                                        w-full px-4 py-3
                                        text-left
                                        flex items-center gap-2
                                        text-body-md
                                        transition-colors
                                        hover:bg-primary hover:text-text
                                        ${selectedOption?.value === option.value ? "bg-primary text-text" : "text-text"}
                                    `}
                                >
                                    {Flag && (
                                        <Flag className="w-5 h-4 rounded-[2px] shadow-sm overflow-hidden" />
                                    )}
                                    <span>{option.label}</span>
                                </button>
                            );
                        })}
                    </div>,
                    document.body
                )}
            </div>
            {error && (
                <p className="mt-2 text-body-sm text-error">
                    {error}
                </p>
            )}
        </div>
    );
}