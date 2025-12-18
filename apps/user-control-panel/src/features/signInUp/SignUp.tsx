import { ChevronRight } from "lucide-react"
import { Button } from "../../shared/ui/buttons/Button"
import { AuthLayout } from "../layout/AuthLayout"
import { ManAtTheTable } from "./components/svg/ManAtTheTable"
import { useSignUpStep1 } from "../../app/contexts/SignUpContext"


const SignUp = () => {
    const { state, validateAndGetResult } = useSignUpStep1();

    const handleNextClick = () => {
        const { ok } = validateAndGetResult();
        if (ok) {

        }
    };

    const disableNext = state.hasAttemptedValidation && Object.keys(state.errors).length > 0;
    return (

        <AuthLayout
            currentStep={1}
            title="Let's Start!"
            Illustration={ManAtTheTable}
            actions={<Button
                text="Next"
                rightIcon={<ChevronRight />}
                onClick={handleNextClick}
                disabled={disableNext} />}
            totalSteps={4} children={undefined}        >


        </AuthLayout>
    )
}

export default SignUp