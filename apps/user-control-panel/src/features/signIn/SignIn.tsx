import { ManNearTheTarget } from "../signInUp/components/svg/ManNearTheTarget";
import { FormInput } from "../signInUp/components/FormInput";
import { FormButton } from "../signInUp/components/FormButton";
import { AuthLayout } from "../signInUp/components/AuthLayout";
import { Checkbox } from "../signInUp/components/Checkbox";

export function SignIn() {
    return (
        <AuthLayout
            title="Email Confirmation"
            Illustration={ManNearTheTarget}
            actions={<FormButton text="Next" />}
        >
            <FormInput label="Email" id="email" name="email" />
            <FormInput label="Password" id="password" type="password" name="password" />

            <div className="space-y-3 mt-10">
                <Checkbox
                    id="remember-me"
                    name="rememberMe "
                    label="Remember me"
                />
            </div>

            <div>
                <FormButton text="Forgot password?" variant="text" />
            </div>

            <div className="mt-4 text-body-md text-text-secondary dark:text-[var(--color-text-secondary-dark)]">
                Don't have an account ?{" "}
                <FormButton text="Create account" variant="text" />
            </div>
        </AuthLayout>
    );
}
