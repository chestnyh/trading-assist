import { Logo } from "../../shared/components/Logo";
import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { FormInput } from "./components/FormInput";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormProgressBar } from "./components/FormProgressBar";

export function SignUp1() {
    return (
        <div className="flex h-screen px-[120px]">
            <div className="grid grid-cols-2 gap-5 w-full h-full">
                <div className="col-span-1 flex flex-col relative">
                    <div className="flex">
                        <Logo />
                        <div className="font-semibold text-[50px] leading-[61px] flex items-center text-[#1C1C1E] ml-5">Trading Assist</div>
                    </div>
                    <div className="grid grid-cols-6 gap-4">
                        <div className="col-span-5 text-[40px] text-blue-500 pt-4 pl-1">
                            Ready to take your trading to the next level ?
                        </div>
                    </div>
                    <div className="pt-4 pl-1 absolute w-full bottom-0">
                        <ManAtTheTable />
                    </div>
                </div>
                <div className="col-span-1 px-[75px] h-screen flex flex-col justify-center">
                    <div className="w-full font-medium text-[40px] text-[#747474] self-stretch">Let's Start!</div>
                    <FormProgressBar currentStep={1} />
                    <FormInput
                        label="First Name"
                        id="firstName"
                        name="firstName"
                        placeholder="Enter your first name"
                    />
                    <FormInput
                        label="Last Name"
                        id="lastName"
                        name="lastName"
                        placeholder="Enter your last name"
                    />
                    <FormSelect
                        label="Country"
                        id="country"
                        name="country"
                        placeholder="Select your country"
                        options={[
                            { value: "US", label: "🇺🇸 United States" },
                            { value: "UK", label: "🇬🇧 United Kingdom" },
                            { value: "CA", label: "🇨🇦 Canada" },
                            { value: "AU", label: "🇦🇺 Australia" },
                            { value: "DE", label: "🇩🇪 Germany" },
                            { value: "FR", label: "🇫🇷 France" },
                            { value: "IT", label: "🇮🇹 Italy" },
                            { value: "ES", label: "🇪🇸 Spain" },
                            { value: "NL", label: "🇳🇱 Netherlands" },
                            { value: "BE", label: "🇧🇪 Belgium" },
                            { value: "CH", label: "🇨🇭 Switzerland" },
                            { value: "AT", label: "🇦🇹 Austria" },
                            { value: "SE", label: "🇸🇪 Sweden" },
                            { value: "NO", label: "🇳🇴 Norway" },
                            { value: "DK", label: "🇩🇰 Denmark" },
                            { value: "FI", label: "🇫🇮 Finland" },
                            { value: "PL", label: "🇵🇱 Poland" },
                            { value: "CZ", label: "🇨🇿 Czech Republic" },
                            { value: "IE", label: "🇮🇪 Ireland" },
                            { value: "PT", label: "🇵🇹 Portugal" },
                            { value: "GR", label: "🇬🇷 Greece" },
                            { value: "UA", label: "🇺🇦 Ukraine" },
                        ]}
                    />
                    <FormButton text="Next" />
                </div>
            </div>
        </div>
    );
}
