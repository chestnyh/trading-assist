import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";

export function RestorePassword3() {
    return (
        <AuthLayout
            currentStep={3}
            title="Enter new password"
            Illustration={ManNextToTheSafe}
            actions={<Button text="Set Up New Password" />}
            totalSteps={3}
        >
            <Input label="Password" id="password" type="password" name="password" />
            <Input label="Confirm Password" id="confirmPassword" type="password" name="confirmPassword" />
        </AuthLayout>
    );
}
