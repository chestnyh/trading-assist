import logo from "../../shared/components/logo.svg";
import { ManNearTheLamp } from "./components/svg/ManNearTheLamp";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormProgressBar } from "./components/FormProgressBar";
import { FormRadio } from "./components/FormRadio";
import { FormCheckbox } from "./components/FormCheckbox";

export function SignUp2() {
    return (
        <div className="flex h-screen px-[120px]">
            <div className="grid grid-cols-2 gap-5 w-full h-full">
                <div className="col-span-1 flex flex-col relative">
                    <div className="flex">
                        <img src={logo} alt="Logo" className="w-16 h-16" />
                        <div className="font-semibold text-[50px] leading-[61px] flex items-center text-[#1C1C1E] ml-5">Trading Assist</div>
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-5 text-[40px] text-blue-500 pt-4 pl-1">
                            Ready to take your trading to the next level ?
                        </div>
                    </div>
                    <div className="pt-4 pl-1 absolute w-full bottom-0">
                        <ManNearTheLamp />
                    </div>
                </div>
                <div className="col-span-1">
                    <div className="grid grid-cols-6 gap-4 h-screen items-center">
                        <div className="col-start-2 col-span-4 bg-background">
                            <div className="w-full font-medium text-[40px] text-[#747474] self-stretch">Trading Preferences </div>
                            <FormProgressBar currentStep={1} />
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
                                label="Preffered Trading Platforms"
                                name="preferredPlatforms"
                                options={[
                                    { value: "binance", label: "Binance" },
                                    { value: "bybit", label: "Bybit" },
                                    { value: "kraken", label: "Kraken" },
                                    { value: "other", label: "Other" },
                                ]}
                            />
                            <FormButton text="Next" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
