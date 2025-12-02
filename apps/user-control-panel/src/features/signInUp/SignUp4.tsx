import logo from "../../shared/components/logo.svg";
import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { FormInput } from "./components/FormInput";
import { FormProgressBar } from "./components/FormProgressBar";
import { FormButton } from "./components/FormButton";

export function SignUp4() {
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
                    Email Confirmation
                </h1>

                <div className="mt-4">
                    <FormProgressBar currentStep={3} />
                </div>

                <div className="mt-6 space-y-4">
                    <FormInput label="Email" id="email" name={"email"} />
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
                    <FormButton text="Send" />
                </div>
            </div>
        </div>
    );
}
