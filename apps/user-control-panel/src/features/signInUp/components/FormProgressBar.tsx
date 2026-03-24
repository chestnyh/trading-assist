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
    const fadeWidth = 8;

    const fadeStart = Math.max(progress - fadeWidth, 0);
    const gradient = `
    linear-gradient(
      to right,
   var(--color-success) 0%,
      var(--color-success) ${fadeStart}%,
      transparent ${progress}%,
      transparent 100%
    )
  `;

    return (
        <div className="pt-5">
            <div
                className="
                      h-6
                    rounded-md
                    border-2 border-accent
                    bg-background
                    overflow-hidden
        "
                style={{
                    background: gradient,
                    transition: "background 400ms ease-out",
                }}
            />
        </div>
    );
}
