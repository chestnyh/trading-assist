import { useState, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { LoginDtoSchema, authControllerLogin } from "@trading-bot/api-client";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { Checkbox } from "../../shared/ui/forms/Checkbox";
import { ErrorAlert } from "../../shared/ui/feedback/ErrorAlert";
import { AuthLayout } from "../layout/AuthLayout";
import { AuthSocialButton } from "./components/AuthSocialButton";
import { Google } from "./components/icons/Google";
import { Facebook } from "./components/icons/Facebook";

export function SignIn() {
    const navigate = useNavigate();
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
        }
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setServerError(null);
        if (hasAttemptedValidation) {
            setPasswordError(validatePassword(value));
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

        try {
            const loginData = {
                email,
                password,
                ...(rememberMe && { rememberMe }),
            } as Parameters<typeof authControllerLogin>[0];

            const response = await authControllerLogin(loginData);

            let access_token: string | undefined;
            let userData: { id: number; nickname: string; email: string; name?: string } | undefined;

            if ('status' in response && response.status === 200 && 'data' in response && response.data) {
                access_token = response.data.access_token;
                userData = response.data.user as { id: number; nickname: string; email: string; name?: string };
            } else if ('access_token' in response && 'user' in response && typeof response === 'object' && response !== null) {
                const directResponse = response as unknown as { access_token: string; user: { id: number; nickname: string; email: string; name?: string } };
                access_token = directResponse.access_token;
                userData = directResponse.user;
            } else if ('status' in response && response.status === 401) {
                setServerError("Invalid credentials");
                return;
            } else {
                setServerError("Unexpected response format from server");
                return;
            }

            if (access_token && userData) {
                localStorage.setItem('auth_token', access_token);
                localStorage.setItem('user_data', JSON.stringify(userData));

                navigate("/dashboard");
            } else {
                setServerError("Invalid response from server");
            }
        } catch (error: unknown) {
            let errorMessage = "Login failed. Please try again.";

            if (error && typeof error === "object") {
                if ("message" in error) {
                    const message = String(error.message);

                    if (message === "Failed to fetch" || message.includes("fetch")) {
                        errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
                    } else {
                        errorMessage = message;
                    }
                } else if ("status" in error) {
                    const status = (error as { status: number }).status;
                    if (status === 400) {
                        errorMessage = "Please verify your email address before logging in. Check your email for the verification code.";
                    } else if (status === 401) {
                        errorMessage = "Invalid credentials";
                    } else if (status >= 500) {
                        errorMessage = "Server error. Please try again later.";
                    }
                }
            } else if (error instanceof TypeError && error.message === "Failed to fetch") {
                errorMessage = "Unable to connect to the server. Please check your internet connection and ensure the server is running.";
            }

            setServerError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    const isSignInDisabled = (hasAttemptedValidation && (Boolean(emailError) || Boolean(passwordError))) || isSubmitting;

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
                    onClick={() => navigate("/restore-password-1")}
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
