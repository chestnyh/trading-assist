import logo from "../../shared/components/logo.svg";
import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { FormInput } from "./components/FormInput";
import { FormProgressBar } from "./components/FormProgressBar";
import { FormButton } from "./components/FormButton";
import { FormCheckbox } from "./components/FormCheckbox";

export function SignUp3() {
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
                    <ManNearTheTarget />
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
                    Account Info
                </h1>

                <div className="mt-4">
                    <FormProgressBar currentStep={2} />
                </div>


                <FormInput label="Email" id="email" name={"email"} />
                <FormInput label="Nickname" id="nickname" name={"nickname"} />
                <FormInput label="Password" id="password" type="password" name={"password"} />
                <FormInput label="Confirm Password" id="confirmPassword" type="password" name={"confirmPassword"} />


                <div className=" space-y-3">
                    <FormCheckbox
                        label="Policy and email confirmation"
                        name="policyAndEmailConfirmation"
                        variant="secondary"
                        options={[
                            { value: "News & Updates confirmed", label: "I want to receive news and updates via email" },
                            { value: "ToS & Privacy Policy confirmed", label: "I have read and accept the Terms of Service and Privacy Policy" },
                        ]}
                    />
                </div>

                <div className=" flex flex-col gap-3 sm:flex-row justify-between">
                    <FormButton text="← Back" variant="outline" />
                    <FormButton text="Next →" />
                </div>
            </div>
        </div>
    );
}
