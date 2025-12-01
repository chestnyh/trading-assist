import logo from "../../shared/components/logo.svg";
import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { FormInput } from "./components/FormInput";
import { FormProgressBar } from "./components/FormProgressBar";

export function SignUp3() {
    return (
        <div className="grid grid-cols-2 gap-10    px-[7.5rem]">


            <div className="mt-5 items-center">
                <div className="flex grid-rows-1">
                    <img src={logo} alt="Logo" className="w-30 h-30" />
                    <div className="font-semibold text-h1  flex items-center  text-accent justify-items-start items-end ml-5">Trading Assist</div>
                </div>


                <div className="font-heading font-semibold text-h2 text-primary">
                    Ready to take your trading to the next level ?
                </div>



                <div className=" grid-rows-3   ">
                    <ManNearTheTarget />

                </div>
            </div>


            <div className="grid   h-screen items-center">
                <div className="    gap-10 ">
                    <div className="  text-h2 grid-rows-1  font-semibold text-text">Account Info  </div>
                    <FormProgressBar currentStep={2} />

                    <div className="mt-6 space-y-4" grid-rows-2>
                        <FormInput
                            label="Email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                        />
                        <FormInput
                            label="Nickname"
                            id="nickname"
                            name="nickname"
                            placeholder="Choose your nickname"
                        />
                        <FormInput
                            label="Password"
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Create a password"
                        />
                        <FormInput
                            label="Confirm Password"
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm your password"
                        />
                    </div>

                    <div className="mt-6 space-y-4">
                        <div className="flex items-center">
                            <input
                                id="newsletter"
                                type="checkbox"
                                name="newsletter"
                                className="w-5 h-5 rounded checked:bg-primary focus:bg-primary border border-text appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--primary)' }}
                            />
                            <label htmlFor="newsletter" className="select-none ms-3 text-body-md font-medium text-text cursor-pointer">
                                I want to receive news and updates via email
                            </label>
                        </div>
                        <div className="flex items-center">
                            <input
                                id="terms"
                                type="checkbox"
                                name="terms"
                                className="w-5 h-5 rounded checked:bg-primary focus:bg-primary border border-text appearance-none cursor-pointer"
                                style={{ accentColor: 'var(--primary)' }}
                            />
                            <label htmlFor="terms" className="select-none ms-3 text-body-md font-medium text-text cursor-pointer">
                                I have read and accept the Terms of Service and Privacy Policy
                            </label>
                        </div>
                    </div>


                    <div className="mt-8 flex   gap-3 sm:flex-row sm:justify-between  ">
                        <button
                            type="button"
                            className="flex items-center justify-center w-full sm:w-auto rounded-lg bg-primary text-white px-6 py-3 text-center font-sans font-medium text-btn-lg hover:bg-accent transition-colors"
                            style={{ backgroundColor: 'var(--primary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                        >
                            <span className="mr-2">←</span>
                            Back
                        </button>

                        <button
                            type="button"
                            className="flex items-center justify-center w-full sm:w-auto rounded-lg bg-primary text-white px-6 py-3 text-center font-sans font-medium text-btn-lg hover:bg-accent transition-colors"
                            style={{ backgroundColor: 'var(--primary)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--accent)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--primary)'}
                        >
                            Next
                            <span className="ml-2">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>



    );
}
