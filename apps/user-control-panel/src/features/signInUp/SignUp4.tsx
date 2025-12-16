import { ManNearTheTarget } from "./components/svg/ManNearTheTarget";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";

export function SignUp4() {
    return (
        <AuthLayout
            currentStep={4}
            title="Email Confirmation"
            Illustration={ManNearTheTarget}
            actions={<Button text="Send" />}
            totalSteps={4}
        >
            <Input label="Insert code here " id="text" name="text" type="text" />
        </AuthLayout>
    );
}
