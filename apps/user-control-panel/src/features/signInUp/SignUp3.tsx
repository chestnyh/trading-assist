import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { FormInput } from "./components/FormInput";
import { FormButton } from "./components/FormButton";
import { Checkbox } from "./components/Checkbox";
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
            <div className="space-y-3 mt-10">
                <Checkbox
                    id="news-updates"
                    name="newsUpdates"
                    label="I want to receive news and updates via email"
                />
                <Checkbox
                    id="tos-privacy"
                    name="tosPrivacy"
                    label="I have read and accept the Terms of Service and Privacy Policy"
                />
            </div>
        </AuthLayout>
    );
}
