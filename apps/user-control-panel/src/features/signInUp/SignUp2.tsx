import { ManNearTheLamp } from "./components/svg/ManNearTheLamp";
import { Select } from "../../shared/ui/forms/Select";
import { Button } from "../../shared/ui/buttons/Button";
import { Radio } from "../../shared/ui/forms/Radio";
import { CheckboxGroup } from "../../shared/ui/forms/CheckboxGroup";
import { AuthLayout } from "../layout/AuthLayout";
import { ChevronRight } from "lucide-react";

export function SignUp2() {
    return (
        <AuthLayout
            currentStep={1}
            title="Trading Preferences"
            Illustration={ManNearTheLamp}
            actions={<Button text="Next" rightIcon={<ChevronRight />} />}
            totalSteps={4}
        >
            <Radio
                label="Trading Experience Level"
                name="experienceLevel"
                options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                ]}
            />
            <Select
                label="Primary Trading Strategy"
                id="tradingStyle"
                name="tradingStyle"
                placeholder="Select your trading style"
                options={[
                    { value: "scalping", label: "Scalping" },
                    { value: "dayTrading", label: "Day Trading" },
                    { value: "swingTrading", label: "Swing Trading" },
                    { value: "positionTrading", label: "Position Trading" },
                    { value: "automated", label: "Automated" },
                ]}
            />
            <Radio
                label="Risk Tolerance"
                name="riskTolerance"
                options={[
                    { value: "conservative", label: "Conservative" },
                    { value: "moderate", label: "Moderate" },
                    { value: "aggressive", label: "Aggressive" },
                ]}
            />
            <CheckboxGroup
                label="Preferred Trading Platforms"
                name="preferredPlatforms"
                options={[
                    { value: "binance", label: "Binance" },
                    { value: "bybit", label: "Bybit" },
                    { value: "kraken", label: "Kraken" },
                    { value: "other", label: "Other" },
                ]}
            />
        </AuthLayout>
    );
}
