import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function RestorePassword2() {
    return (
        <AuthLayout
            currentStep={2}
            title="Insert code"
            Illustration={ManNextToTheSafe}
            actions={
                <>
                    <Button text="Back" variant="outline" leftIcon={<ChevronLeft />} />
                    <Button text="Reset password" rightIcon={<ChevronRight />} />
                </>
            }
            totalSteps={3}
        >
            <Input label="Secret code" id="text" name="text" type="text" />
        </AuthLayout>
    );
}
