export interface SelectOption {
    value: string;
    label: string;
}

export interface RadioOption {
    value: string;
    label: string;
}

export interface CheckboxOption {
    value: string;
    label: string;
}

// Trading Experience Level options
export const tradingExperienceLevelOptions: RadioOption[] = [
    { value: "Beginner", label: "Beginner" },
    { value: "Intermediate", label: "Intermediate" },
    { value: "Advanced", label: "Advanced" },
];

// Primary Trading Strategy options
export const primaryTradingStrategyOptions: SelectOption[] = [
    { value: "Scalping", label: "Scalping" },
    { value: "DayTrading", label: "Day Trading" },
    { value: "SwingTrading", label: "Swing Trading" },
    { value: "PositionTrading", label: "Position Trading" },
    { value: "Automated", label: "Automated" },
];

// Risk Tolerance options
export const riskToleranceOptions: RadioOption[] = [
    { value: "Conservative", label: "Conservative" },
    { value: "Moderate", label: "Moderate" },
    { value: "Aggressive", label: "Aggressive" },
];

// Preferred Trading Platforms options
export const preferredTradingPlatformsOptions: CheckboxOption[] = [
    { value: "Binance", label: "Binance" },
    { value: "Bybit", label: "Bybit" },
    { value: "Kraken", label: "Kraken" },
    { value: "Other", label: "Other" },
];
