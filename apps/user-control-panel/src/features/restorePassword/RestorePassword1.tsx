import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { FormInput } from "../signInUp/components/FormInput";
import { FormButton } from "../signInUp/components/FormButton";
import { AuthLayout } from "../signInUp/components/AuthLayout";

export function RestorePassword1() {
    return (
        <AuthLayout
            currentStep={0}
            title="Insert your email"
            Illustration={ManNextToTheSafe}
            actions={<FormButton text="Send me code on email" />}
            totalSteps={3}
        >
            <FormInput label="Email" id="email" name="email" type="email" />
        </AuthLayout>
    );
}
