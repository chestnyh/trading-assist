export function FormProgressBar({ currentStep }: { currentStep: number }) {

    const gradientStyles = [
        'linear-gradient(to right, #47B262 0%, #47B262 25%, white 27%, white 100%)',
        'linear-gradient(to right, #47B262 0%, #47B262 41%, white 49%, white 100%)',
        'linear-gradient(to right, #47B262 0%, #47B262 62%, white 87%, white 100%)',
        'linear-gradient(to right, #47B262 0%, #47B262 95%, white 95%, white 100%)',
    ]

    return (
        <div className="pt-5">
            <div className="h-[30px] rounded-[10px] border border-formInputBg" style={{ background: gradientStyles[currentStep] }}></div>
        </div>
    );
}