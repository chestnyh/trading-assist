import { ChangeEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Select } from "../../../shared/ui/forms/Select";
import { Button } from "../../../shared/ui/buttons/Button";
import { Radio } from "../../../shared/ui/forms/Radio";
import { CheckboxGroup } from "../../../shared/ui/forms/CheckboxGroup";
import {
    tradingExperienceLevelOptions,
    primaryTradingStrategyOptions,
    riskToleranceOptions,
    preferredTradingPlatformsOptions,
} from "../../../shared/data/tradingOptions";
import { useSignUpStep2, useSignUpContext } from "../../../app/contexts/SignUpContext";
import { SIGN_UP_STRINGS } from "../strings/signUpStrings";

const { step2, buttons } = SIGN_UP_STRINGS;

export function Step2Content() {
    const { state, setField, validateAndGetResult } = useSignUpStep2();
    const { nextStep, prevStep } = useSignUpContext();

    const handleExperienceLevelChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "Beginner" || value === "Intermediate" || value === "Advanced") {
            setField("tradingExperienceLevel", value);
        } else {
            setField("tradingExperienceLevel", undefined);
        }
    };

    const handleTradingStrategyChange = (e: ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        if (!value) {
            setField("primaryTradingStrategy", undefined);
            return;
        }
        const enumValue = value as
            | "Scalping"
            | "DayTrading"
            | "SwingTrading"
            | "PositionTrading"
            | "Automated"
            | undefined;
        setField("primaryTradingStrategy", enumValue);
    };

    const handleRiskToleranceChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (value === "Conservative" || value === "Moderate" || value === "Aggressive") {
            setField("riskTolerance", value);
        } else {
            setField("riskTolerance", undefined);
        }
    };

    const handlePlatformsChange = (selectedValues: string[]) => {
        const enumValues = selectedValues as ("Binance" | "Bybit" | "Kraken" | "Other")[];
        setField("preferredTradingPlatforms", enumValues.length > 0 ? enumValues : undefined);
    };

    const handleNextClick = () => {
        const { ok } = validateAndGetResult();
        if (ok) {
            nextStep();
        }
    };

    const disableNext = state.hasAttemptedValidation && Object.keys(state.errors).length > 0;

    return (
        <>
            <Radio
                label={step2.labels.tradingExperience}
                name="tradingExperienceLevel"
                value={state.tradingExperienceLevel}
                onChange={handleExperienceLevelChange}
                options={tradingExperienceLevelOptions}
            />
            {state.errors.tradingExperienceLevel && (
                <p className="mt-2 text-body-sm text-error">{state.errors.tradingExperienceLevel}</p>
            )}

            <Select
                label={step2.labels.tradingStrategy}
                id="primaryTradingStrategy"
                name="primaryTradingStrategy"
                placeholder={step2.placeholders.tradingStrategy}
                value={state.primaryTradingStrategy || ""}
                onChange={handleTradingStrategyChange}
                error={state.errors.primaryTradingStrategy}
                options={primaryTradingStrategyOptions}
            />

            <Radio
                label={step2.labels.riskTolerance}
                name="riskTolerance"
                value={state.riskTolerance}
                onChange={handleRiskToleranceChange}
                options={riskToleranceOptions}
            />
            {state.errors.riskTolerance && (
                <p className="mt-2 text-body-sm text-error">{state.errors.riskTolerance}</p>
            )}

            <CheckboxGroup
                label={step2.labels.tradingPlatforms}
                name="preferredTradingPlatforms"
                value={state.preferredTradingPlatforms}
                onChange={handlePlatformsChange}
                options={preferredTradingPlatformsOptions}
            />
            {state.errors.preferredTradingPlatforms && (
                <p className="mt-2 text-body-sm text-error">{state.errors.preferredTradingPlatforms}</p>
            )}

            <div className="mt-8 flex justify-between gap-3">
                <Button
                    text={buttons.back}
                    variant="outline"
                    leftIcon={<ChevronLeft />}
                    onClick={prevStep}
                />
                <Button
                    text={buttons.next}
                    rightIcon={<ChevronRight />}
                    onClick={handleNextClick}
                    disabled={disableNext}
                />
            </div>
        </>
    );
}
