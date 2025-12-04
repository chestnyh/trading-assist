import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { FormInput } from "../signInUp/components/FormInput";
import { FormButton } from "../signInUp/components/FormButton";
import { AuthLayout } from "../signInUp/components/AuthLayout";
import { ArrowLeft } from "../signInUp/components/icons/ArrowLeft";
import { ArrowRight } from "../signInUp/components/icons/ArrowRight";

export function RestorePassword2() {
    return (
        <AuthLayout
            currentStep={1}
            title="Insert code"
            Illustration={ManNextToTheSafe}
            actions={
                <>
                    <FormButton text="Back" variant="outline" leftIcon={<ArrowLeft />} />
                    <FormButton text="Reset password" rightIcon={<ArrowRight />} />
                </>
            }
            totalSteps={3}
        >
            <FormInput label="Secret code" id="text" name="text" type="text" />
        </AuthLayout>
    );
}
