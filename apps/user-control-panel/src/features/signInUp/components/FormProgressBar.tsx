interface FormProgressBarProps {
    currentStep: number;
    totalSteps?: number;
}

export function FormProgressBar({
    currentStep,
    totalSteps = 4,
}: FormProgressBarProps) {

    const clampedStep = Math.min(Math.max(currentStep, 0), totalSteps - 1);
    const progress = ((clampedStep + 1) / totalSteps) * 100;
    const fadeWidth = 8;

    const fadeStart = Math.max(progress - fadeWidth, 0);
    const gradient = `
    linear-gradient(
      to right,
      #47B262 0%,
      #47B262 ${fadeStart}%,
      white ${progress}%,
      white 100%
    )
  `;

    return (
        <div className="pt-5">
            <div
                className="
                 h-[1.875rem]            
          rounded-[0.75rem] 
          h-4
          rounded-2xl
          border border-bgSecondary
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
