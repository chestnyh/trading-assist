import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { FormInput } from "../signInUp/components/FormInput";
import { FormButton } from "../signInUp/components/FormButton";
import { AuthLayout } from "../signInUp/components/AuthLayout";

export function RestorePassword3() {
    return (
        <AuthLayout
            currentStep={2}
            title="Enter new password"
            Illustration={ManNextToTheSafe}
            actions={<FormButton text="Set Up New Password" />}
            totalSteps={3}
        >
            <FormInput label="Password" id="password" type="password" name="password" />
            <FormInput label="Confirm Password" id="confirmPassword" type="password" name="confirmPassword" />
        </AuthLayout>
    );
}
