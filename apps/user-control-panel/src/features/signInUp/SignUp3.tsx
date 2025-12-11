import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { Checkbox } from "../../shared/ui/forms/Checkbox";
import { AuthLayout } from "../layout/AuthLayout";
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
                    <Button text="Back" variant="outline" leftIcon={<ArrowLeft />} />
                    <Button text="Next" rightIcon={<ArrowRight />} />
                </>
            }
            totalSteps={4}
        >
            <Input label="Email" id="email" name="email" />
            <Input label="Nickname" id="nickname" name="nickname" />
            <Input label="Password" id="password" type="password" name="password" />
            <Input label="Confirm Password" id="confirmPassword" type="password" name="confirmPassword" />
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
