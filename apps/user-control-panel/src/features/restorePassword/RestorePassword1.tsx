import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";

export function RestorePassword1() {
    return (
        <AuthLayout
            currentStep={1}
            title="Insert your email"
            Illustration={ManNextToTheSafe}
            actions={<Button text="Send me code on email" />}
            totalSteps={3}
        >
            <Input label="Email" id="email" name="email" type="email" />
        </AuthLayout>
    );
}
