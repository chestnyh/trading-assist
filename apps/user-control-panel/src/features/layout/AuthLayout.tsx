import { ReactNode } from "react";
import logo from "../../shared/components/logo.svg";
import { FormProgressBar } from "../signInUp/components/FormProgressBar";
import { ThemeToggle } from "../../shared/ui/buttons/ThemeToggle";
import { TypewriterText } from "../../shared/ui/TypewriterText";
import { FloatingBlobs } from "../../shared/ui/FloatingBlobs";

interface AuthLayoutProps {
    currentStep?: number;
    title: string;
    children: ReactNode;
    actions?: ReactNode;
    totalSteps?: number;
}

export function AuthLayout({
    currentStep,
    title,
    children,
    actions,
    totalSteps
}: AuthLayoutProps) {

    return (
        <div className="relative min-h-screen bg-background text-text">
            <FloatingBlobs />
            <div
                className="
                    relative z-10
                    grid grid-cols-1 lg:grid-cols-2
                    gap-10
                    px-4 md:px-8 lg:px-12 xl:px-20 3xl:px-32
                    min-h-screen
                "
            >
                <div className="h-full hidden lg:flex lg:flex-col pr-6">
                    <div className="flex items-end mt-10">
                        <img src={logo} alt="Logo" className="w-20 h-20" />
                        <div className="ml-4 font-heading font-semibold text-h3 text-primary">
                            Trading Assist
                        </div>
                    </div>

                    <div className="flex flex-col place-items-center justify-center flex-grow  mb-25">
                        <div className="font-heading font-semibold text-h3 text-primary">
                            <TypewriterText text="Ready to take your trading to the next level?" speed={120} />
                        </div>

                    </div>
                </div>

                <div className="flex items-center justify-between lg:hidden mb-8">
                    <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-12 h-12" />
                        <span className="font-heading font-semibold text-h4 text-primary">
                            Trading Assist
                        </span>
                    </div>
                </div>

                <div className="w-full max-w-xl mx-auto h-full flex flex-col justify-center  ">
                    <div className="
                    bg-gradient-to-br from-bg-secondary/60 to-bg-secondary/10
                    backdrop-blur-2xl 
                    border border-border  
                    rounded-2xl 
                    shadow-2xl
                    shadow-black/20  
                    md:p-8 
                    p-6
                    transition-all duration-300 ease-in-out
                    relative
                    overflow-hidden
                    ring-1 ring-white/10 dark:ring-white/5
                ">
                        <div className="flex items-center justify-between gap-4">
                            <h1 className=" font-semibold text-h3 md:text-h2 text-text text-text-secondary dark:text-text-secondary-dark">
                                {title}
                            </h1>
                            <ThemeToggle />
                        </div>

                        {currentStep !== undefined && (
                            <div className="mt-4">
                                <FormProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                            </div>
                        )}
                        <div className="mt-6 space-y-4">{children}</div>
                        {actions && (
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
                                {actions}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
