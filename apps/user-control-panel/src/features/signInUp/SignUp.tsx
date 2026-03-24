import { AuthLayout } from "../layout/AuthLayout";
import { useSignUpContext } from "../../app/contexts/SignUpContext";
import { Step1Content } from "./steps/Step1Content";
import { Step2Content } from "./steps/Step2Content";
import { Step3Content } from "./steps/Step3Content";
import { Step4Content } from "./steps/Step4Content";
import { getStepConfig } from "./steps/stepsConfig";

function SignUp() {
    const { currentStep } = useSignUpContext();
    const config = getStepConfig(currentStep);

    const renderStepContent = [
        <Step1Content />,
        <Step2Content />,
        <Step3Content />,
        <Step4Content />,
    ];

    return (
        <AuthLayout
            currentStep={currentStep + 1}
            totalSteps={4}
            title={config.title}
        >
            {renderStepContent[currentStep] || null}
        </AuthLayout>
    );
}

export default SignUp;
