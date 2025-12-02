import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { FormInput } from "./components/FormInput";
import { FormButton } from "./components/FormButton";
import { AuthLayout } from "./components/AuthLayout";

export function SignUp4() {
    return (
        <AuthLayout
            currentStep={3}
            title="Email Confirmation"
            Illustration={ManNearTheTarget}
            actions={<FormButton text="Send" />}
        >
            <FormInput label="Email" id="email" name="email" />
        </AuthLayout>
    );
}
