import { ComponentType, ReactNode } from "react";
import logo from "../../../shared/components/logo.svg";
import { FormProgressBar } from "./FormProgressBar";
import { ToggleButton } from "./ToggleButton";
import { ErrorPopup } from "./ErrorPopup";

interface AuthLayoutProps {
    currentStep: number;
    title: string;
    Illustration: ComponentType;
    children: ReactNode;
    actions?: ReactNode;
}

export function AuthLayout({
    currentStep,
    title,
    Illustration,
    children,
    actions,
}: AuthLayoutProps) {
    const hasError = currentStep === 3;

    return (
        <div
            className="
        grid grid-cols-1 lg:grid-cols-2
        gap-10
        px-4 md:px-8 lg:px-12 xl:px-20 3xl:px-32
        min-h-screen
        bg-background dark:bg-[var(--color-background-dark)]
        text-text dark:text-[var(--color-text-dark)]
        items-center justify-center
      "
        >

            <div className="hidden lg:flex lg:flex-col pr-6">
                <div className="flex items-center">
                    <img src={logo} alt="Logo" className="w-32 h-32" />
                    <div className="ml-4 font-heading font-semibold text-h2 text-primary dark:text-[var(--color-primary-dark)]">
                        Trading Assist
                    </div>
                </div>

                <div className="mt-5 font-heading font-semibold text-h3 text-primary dark:text-[var(--color-primary-dark)]">
                    Ready to take your trading to the next level?
                </div>

                <div className="mt-10 w-full">
                    <Illustration />
                </div>
            </div>


            <div className="flex items-center justify-between lg:hidden mb-8">
                <div className="flex items-center gap-3">
                    <img src={logo} alt="Logo" className="w-12 h-12" />
                    <span className="font-heading font-semibold text-h4 text-primary dark:text-[var(--color-primary-dark)]">
                        Trading Assist
                    </span>
                </div>


                <ToggleButton />
            </div>


            <div className="w-full max-w-xl mx-auto">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="font-heading font-semibold text-h3 md:text-h2 text-text text-text-secondary dark:text-[var(--color-text-secondary-dark)]">
                        {title}
                    </h1>


                    <ToggleButton />
                </div>

                {hasError && (
                    <div className="mt-4">
                        <ErrorPopup />
                    </div>
                )}

                <div className="mt-4">
                    <FormProgressBar currentStep={currentStep} />
                </div>

                <div className="mt-6 space-y-4">{children}</div>

                {actions && (
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
                        {actions}
                    </div>
                )}
            </div>
        </div>
    );
}
