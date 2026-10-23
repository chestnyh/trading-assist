import { ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { FormProgressBar } from "../signInUp/components/FormProgressBar";
import { ThemeToggle } from "../../shared/ui/buttons/ThemeToggle";
import { LogoMark } from "../../shared/components/LogoMark";

interface AuthLayoutProps {
    currentStep?: number;
    title: string;
    Illustration?: ComponentType;
    children: ReactNode;
    actions?: ReactNode;
    totalSteps?: number;
}

const BENEFITS = [
    "Build rules from ready-made blocks, no code needed",
    "Connect Binance, Bybit or Kraken in a few clicks",
    "Get notified wherever you already are",
];

const FOCUS_RING =
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-forest-300 dark:focus-visible:outline-brand-300";

function BrandLink({ className = "" }: { className?: string }) {
    return (
        <Link
            to="/"
            className={`flex items-center gap-2.5 w-fit rounded-full hover:opacity-80 transition-opacity ${className}`}
        >
            <LogoMark />
            <span className="text-lg font-semibold tracking-tight">Trading Assist</span>
        </Link>
    );
}

export function AuthLayout({
    currentStep,
    title,
    Illustration,
    children,
    actions,
    totalSteps
}: AuthLayoutProps) {

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950 font-inter-tight text-neutral-950 dark:text-white">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 min-h-screen p-4 sm:p-6 lg:p-8">
                {/* Brand panel */}
                <aside className="hidden lg:flex flex-col justify-between rounded-2xl bg-forest-300 p-10 xl:p-14 text-white">
                    <BrandLink className="focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-300" />

                    <div className="space-y-6 max-w-lg">
                        <h2 className="text-4xl xl:text-5xl font-semibold tracking-tight leading-tight">
                            Ready to take your <span className="text-brand-300">trading</span> to the next level?
                        </h2>
                        <p className="text-lg text-forest-25">
                            Trading Assist watches the market for you and acts when your conditions are met.
                        </p>
                        <ul className="space-y-3">
                            {BENEFITS.map((benefit) => (
                                <li key={benefit} className="flex items-center gap-3 text-forest-0">
                                    <span className="flex items-center justify-center w-6 h-6 rounded-full bg-brand-300 text-forest-300 shrink-0">
                                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </span>
                                    {benefit}
                                </li>
                            ))}
                        </ul>

                        {Illustration && (
                            <div className="pt-4 w-full">
                                <Illustration />
                            </div>
                        )}
                    </div>

                    <p className="text-sm text-forest-50">© 2025 Trading Assist. All rights reserved.</p>
                </aside>

                {/* Form */}
                <div className="flex flex-col">
                    <div className="flex items-center justify-between lg:justify-end gap-4">
                        <BrandLink className={`lg:hidden ${FOCUS_RING}`} />
                        <ThemeToggle
                            className={`
                                flex items-center justify-center w-9 h-9 flex-shrink-0 rounded-full
                                border border-neutral-200 dark:border-neutral-800
                                text-neutral-700 dark:text-neutral-300
                                hover:bg-neutral-50 dark:hover:bg-neutral-900
                                transition-colors
                                [&>svg]:w-4 [&>svg]:h-4
                                ${FOCUS_RING}
                            `}
                        />
                    </div>

                    <main className="w-full max-w-lg mx-auto flex-1 flex flex-col justify-center py-10">
                        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>

                        {currentStep !== undefined && (
                            <div className="mt-6">
                                <FormProgressBar currentStep={currentStep} totalSteps={totalSteps} />
                            </div>
                        )}
                        <div className="mt-4 space-y-4">{children}</div>
                        {actions && (
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row justify-between">
                                {actions}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </div>
    );
}
