import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { FormInput } from "./components/FormInput";
import { FormButton } from "./components/FormButton";
import { FormCheckbox } from "./components/FormCheckbox";
import { AuthLayout } from "./components/AuthLayout";
import { ArrowLeft } from "./components/icons/ArrowLeft";
import { ArrowRight } from "./components/icons/ArrowRight";

export function SignUp3() {
    return (
        <AuthLayout
            currentStep={2}
            title="Account Info"
            Illustration={ManNearTheTarget}
            actions={
                <>
                    <FormButton text="Back" variant="outline" leftIcon={<ArrowLeft />} />
                    <FormButton text="Next" rightIcon={<ArrowRight />} />
                </>
            }
        >
            <FormInput label="Email" id="email" name="email" />
            <FormInput label="Nickname" id="nickname" name="nickname" />
            <FormInput label="Password" id="password" type="password" name="password" />
            <FormInput label="Confirm Password" id="confirmPassword" type="password" name="confirmPassword" />
            <FormCheckbox
                label="Policy and email confirmation"
                name="policyAndEmailConfirmation"
                variant="secondary"
                options={[
                    { value: "News & Updates confirmed", label: "I want to receive news and updates via email" },
                    { value: "ToS & Privacy Policy confirmed", label: "I have read and accept the Terms of Service and Privacy Policy" },
                ]}
            />
        </AuthLayout>
    );
}
