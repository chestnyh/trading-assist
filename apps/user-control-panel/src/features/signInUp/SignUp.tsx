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

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return <Step1Content />;
            case 2:
                return <Step2Content />;
            case 3:
                return <Step3Content />;
            case 4:
                return <Step4Content />;
            default:
                return null;
        }
    };

    return (
        <AuthLayout
            currentStep={currentStep}
            totalSteps={4}
            title={config.title}
            Illustration={config.Illustration}
        >
            {renderStepContent()}
        </AuthLayout>
    );
}

export default SignUp;
