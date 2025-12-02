import { ManNearTheLamp } from "./components/svg/ManNearTheLamp";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormRadio } from "./components/FormRadio";
import { FormCheckbox } from "./components/FormCheckbox";
import { AuthLayout } from "./components/AuthLayout";

export function SignUp2() {
    return (
        <AuthLayout
            currentStep={1}
            title="Trading Preferences"
            Illustration={ManNearTheLamp}
            actions={<FormButton text="Next →" />}
        >
            <FormRadio
                label="Trading Experience Level"
                name="experienceLevel"
                options={[
                    { value: "beginner", label: "Beginner" },
                    { value: "intermediate", label: "Intermediate" },
                    { value: "advanced", label: "Advanced" },
                ]}
            />
            <FormSelect
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
            <FormRadio
                label="Risk Tolerance"
                name="riskTolerance"
                options={[
                    { value: "conservative", label: "Conservative" },
                    { value: "moderate", label: "Moderate" },
                    { value: "aggressive", label: "Aggressive" },
                ]}
            />
            <FormCheckbox
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
