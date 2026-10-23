interface FormProgressBarProps {
    currentStep: number;
    totalSteps?: number;
}

export function FormProgressBar({
    currentStep,
    totalSteps = 4,
}: FormProgressBarProps) {

    const clampedStep = Math.min(Math.max(currentStep, 1), totalSteps);
    const progress = (clampedStep / totalSteps) * 100;

    return (
        <div>
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
                Step {clampedStep} of {totalSteps}
            </p>
            <div
                role="progressbar"
                aria-valuemin={1}
                aria-valuemax={totalSteps}
                aria-valuenow={clampedStep}
                className="mt-2 h-2 rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden"
            >
                <div
                    className="h-full rounded-full bg-forest-300 dark:bg-brand-300 transition-[width] duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                />
            </div>
        </div>
    );
}
