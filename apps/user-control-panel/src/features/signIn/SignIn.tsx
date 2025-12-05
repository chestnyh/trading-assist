import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { FormInput } from "../signInUp/components/FormInput";
import { FormButton } from "../signInUp/components/FormButton";
import { AuthLayout } from "../signInUp/components/AuthLayout";
import { Checkbox } from "../signInUp/components/Checkbox";
import { AuthSocialButton } from "./components/AuthSocialButton";
import { Google } from "./components/icons/Google";
import { Facebook } from "./components/icons/Facebook";

export function SignIn() {
    return (
        <AuthLayout
            title="Sign In Into Your Account"
            Illustration={ManNextToTheSafe}
            actions={<FormButton text="Next" />}
        >
            <div className="flex gap-3">
                <AuthSocialButton
                    text="Log in with Google"
                    icon={<Google className="w-5 h-5" />}
                />
                <AuthSocialButton
                    text="Log in with Facebook"
                    icon={<Facebook className="w-5 h-5" />}
                />
            </div>

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
