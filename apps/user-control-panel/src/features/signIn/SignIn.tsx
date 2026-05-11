import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { AuthLayout } from "../layout/AuthLayout";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { Checkbox } from "../../shared/ui/forms/Checkbox";
import { ErrorAlert } from "../../shared/ui/feedback/ErrorAlert";
import { AuthSocialButton } from "./components/AuthSocialButton";
import { Google } from "./components/icons/Google";
import { Facebook } from "./components/icons/Facebook";
import { useAuth } from "../../app/contexts/AuthContext";
import { LoginDtoSchema } from "@trading-bot/api-validator";

export function SignIn() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);
    const [emailError, setEmailError] = useState<string | undefined>(undefined);
    const [passwordError, setPasswordError] = useState<string | undefined>(undefined);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

    const validateEmail = (value: string): string | undefined => {
        const result = LoginDtoSchema.shape.email.safeParse(value);
        if (!result.success) {
            return result.error.issues[0]?.message;
        }
        return undefined;
    };

    const validatePassword = (value: string): string | undefined => {
        const result = LoginDtoSchema.shape.password.safeParse(value);
        if (!result.success) {
            return result.error.issues[0]?.message;
        }
        return undefined;
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setServerError(null);

        if (hasAttemptedValidation) {
            setEmailError(validateEmail(value));
        } else if (emailError) {
            setEmailError(undefined);
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setServerError(null);

        if (hasAttemptedValidation) {
            setPasswordError(validatePassword(value));
        } else if (passwordError) {
            setPasswordError(undefined);
        }
    };

    const handleRememberMeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRememberMe(e.target.checked);
    };

    const handleSignInClick = async () => {
        setHasAttemptedValidation(true);

        const emailValidationError = validateEmail(email);
        const passwordValidationError = validatePassword(password);

        setEmailError(emailValidationError);
        setPasswordError(passwordValidationError);
        setServerError(null);

        if (emailValidationError || passwordValidationError) {
            return;
        }

        setIsSubmitting(true);

        const result = await login(email, password, rememberMe);

        if (result.success) {
            navigate("/dashboard");
        } else {
            setEmailError(result.fieldErrors?.email);
            setPasswordError(result.fieldErrors?.password);
            setServerError(result.error || "Login failed. Please try again.");
        }

        setIsSubmitting(false);
    };

    const isSignInDisabled = isSubmitting || (hasAttemptedValidation && (Boolean(emailError) || Boolean(passwordError)));

    return (
        <AuthLayout
            title="Sign In Into Your Account"
            actions={
                <Button
                    text={isSubmitting ? "Signing in..." : "Sign In"}
                    onClick={handleSignInClick}
                    disabled={isSignInDisabled}
                />
            }
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


            <Input
                label={"Email"}
                id="email"
                name="email"
                placeholder={"Enter your email"}
                value={email}
                onChange={handleEmailChange}
                error={emailError}
                required
            />
            <Input
                label="Password"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={password}
                onChange={handlePasswordChange}
                error={passwordError}
                required
            />

            <div className="space-y-3 mt-10">
                <Checkbox
                    id="remember-me"
                    name="rememberMe"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                />
            </div>

            <ErrorAlert message={serverError} />

            <div>
                <Button
                    text="Forgot password?"
                    variant="text"
                    onClick={() => navigate("/restore-password")}
                />
            </div>

            <div className="mt-4 text-body-md text-text-secondary dark:text-[var(--color-text-secondary-dark)]">
                Don't have an account ?{" "}
                <Button
                    text="Create account"
                    variant="text"
                    onClick={() => navigate("/sign-up")}
                />
            </div>
        </AuthLayout>
    );
}
