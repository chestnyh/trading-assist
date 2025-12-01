import logo from "../../shared/components/logo.svg";
import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { FormInput } from "./components/FormInput";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { FormProgressBar } from "./components/FormProgressBar";

export function SignUp1() {
    return (
        <div className="flex min-h-screen bg-background text-text px-6 py-8 lg:px-20 lg:py-10 3xl:px-32">
            <div className="grid w-full h-full grid-cols-1 gap-8 lg:grid-cols-2">

                <div className="hidden h-full lg:flex lg:flex-col">
                    <div className="flex items-center justify-center lg:justify-start">
                        <img
                            src={logo}
                            alt="Logo"
                            className="w-16 h-16 lg:w-24 lg:h-24 3xl:w-32 3xl:h-32"
                        />
                        <div className="ml-4 flex items-center font-heading font-semibold text-h4 lg:text-h3 3xl:text-h2 text-primary">
                            Trading Assist
                        </div>
                    </div>

                    <div className="mt-6 lg:px-6 lg:py-4">
                        <p className="font-heading font-semibold text-h5 text-primary">
                            Ready to take your trading to the next level?
                        </p>
                    </div>

                    <div className="mt-auto">
                        <ManAtTheTable />
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3 px-4 py-4 lg:hidden">
                    <img src={logo} alt="Logo" className="w-16 h-16" />
                    <div className="font-heading font-semibold text-h4 text-primary">
                        Trading Assist
                    </div>
                </div>


                <div className="flex items-center justify-center mt-8 lg:mt-0 lg:col-span-1 lg:px-6 xl:px-8 3xl:px-16">
                    <div className="w-full max-w-xl">
                        <h1 className="font-heading font-semibold text-h3 lg:text-h2 text-text">
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

                            <div className="pt-2">
                                <FormButton text="Next" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
