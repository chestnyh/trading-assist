import logo from "../../shared/components/logo.svg";
import { ManNearTheLamp } from "./components/svg/ManNearTheLamp";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormProgressBar } from "./components/FormProgressBar";
import { FormRadio } from "./components/FormRadio";
import { FormCheckbox } from "./components/FormCheckbox";

export function SignUp2() {
    return (
        <div
            className="
        grid
        grid-cols-1
        lg:grid-cols-2
        gap-10
        px-4
        md:px-8
        lg:px-12
        xl:px-20
        3xl:px-32
        min-h-screen
        bg-background text-text
        items-center justify-center
      "
        >

            <div className="hidden lg:flex lg:flex-col pr-6 relative">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="w-32 h-32" />
                    <div className="ml-4 font-heading font-semibold text-h2 text-primary">
                        Trading Assist
                    </div>
                </div>

                <div className="mt-5 font-heading font-semibold text-h3 text-primary">
                    Ready to take your trading to the next level?
                </div>

                <div className="mt-10 w-full">
                    <ManNearTheLamp />
                </div>
            </div>


            <div className="w-full max-w-xl mx-auto">
                <h1 className="font-heading font-semibold text-h3 md:text-h2">
                    Trading Preferences
                </h1>

                <div className="mt-4">
                    <FormProgressBar currentStep={1} />
                </div>

                <div className="mt-6 space-y-4">
                    <FormRadio
                        label="Trading Experience Level"
                        name="experienceLevel"
                        options={[
                            { value: "beginner", label: "Beginner" },
                            { value: "intermediate", label: "Intermediate" },
                            { value: "advanced", label: "Advanced" },
                        ]}
                    />
                </div>

                <div className="mt-6 space-y-4">
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
                </div>

                <div className="mt-6 space-y-4">
                    <FormRadio
                        label="Risk Tolerance"
                        name="riskTolerance"
                        options={[
                            { value: "conservative", label: "Conservative" },
                            { value: "moderate", label: "Moderate" },
                            { value: "aggressive", label: "Aggressive" },
                        ]}
                    />
                </div>

                <div className="mt-6 space-y-4">
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
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
                    <FormButton text="Next →" />
                </div>
            </div>


        </div>
    );
}
