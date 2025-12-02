import logo from "../../shared/components/logo.svg";
import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { FormInput } from "./components/FormInput";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormProgressBar } from "./components/FormProgressBar";

export function SignUp1() {
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
                    <ManAtTheTable />
                </div>
            </div>


            <div className="flex items-center justify-center gap-3 lg:hidden mb-8">
                <img src={logo} alt="Logo" className="w-12 h-12" />
                <span className="font-heading font-semibold text-h4 text-primary">
                    Trading Assist
                </span>
            </div>


            <div className="w-full max-w-xl mx-auto">
                <h1 className="font-heading font-semibold text-h3 md:text-h2">
                    Let&apos;s Start!
                </h1>

                <div className="mt-4">
                    <FormProgressBar currentStep={0} />
                </div>

                <div className="mt-6 space-y-4">
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
                </div>
                <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
                    <FormButton text="Next →" />
                </div>
            </div>
        </div>
    );
}
