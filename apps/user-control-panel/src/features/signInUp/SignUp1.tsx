import logo from "../../shared/components/logo.svg";
import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { FormInput } from "./components/FormInput";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormProgressBar } from "./components/FormProgressBar";

export function SignUp1() {
    return (
        <div className="flex h-screen 3xl:px-[120px] xl1440:px-[100px] lg:px-[80px] lg:py-[36px] px-[48px] py-[32px]">
            <div className="lg:grid lg:grid-cols-2 grid-cols-1 gap-5 w-full h-full">
                <div className="hidden lg:flex lg:flex-col h-full">
                    <div className="flex lg:justify-start items-center justify-center">
                        <img src={logo} alt="Logo" className="3xl:w-[130px] 3xl:h-[130px] lg:w-[98px] lg:h-[98px] w-16 h-16" />
                        <div className="font-inter font-semibold lg:text-[32px] text-[50px] leading-[61px] flex items-center text-brand ml-5">Trading Assist</div>
                    </div>
                    <div className="grid grid-cols-6 gap-4 lg:px-6 lg:py-4">
                        <div className="font-inter font-semibold col-span-5 text-[24px] text-blue-500 pt-4 pl-1">
                            Ready to take your trading to the next level ?
                        </div>
                    </div>
                    <div className="mt-auto">
                        <ManAtTheTable />
                    </div>
                </div>
                <div className="lg:col-span-1 lg:hidden flex justify-center px-[24px] py-[16px]">
                    <img src={logo} alt="Logo" className="w-[150px] h-[150px]" />
                    <div className="font-inter tracking-[-0.04em] font-semibold text-[50px] leading-[61px] flex items-center text-brand px-[12px]">Trading Assist</div>
                </div>
                <div className="lg:col-span-1 3xl:px-[75px] xl1440:px-6 lg:px-[10px] lg:mt-0 mt-[32px] lg:flex lg:items-center lg:justify-center">
                    <div className="w-full px-[32px]">
                        <div className="font-inter tracking-[0] font-semibold lg:text-[40px] text-[32px] text-formHeader self-stretch">Let's Start!</div>
                    <FormProgressBar currentStep={0} />
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
        </div>
    );
}
