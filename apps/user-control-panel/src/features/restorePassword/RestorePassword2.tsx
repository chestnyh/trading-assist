import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
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
                    <Button text="Back" variant="outline" leftIcon={<ArrowLeft />} />
                    <Button text="Reset password" rightIcon={<ArrowRight />} />
                </>
            }
            totalSteps={3}
        >
            <Input label="Secret code" id="text" name="text" type="text" />
        </AuthLayout>
    );
}
