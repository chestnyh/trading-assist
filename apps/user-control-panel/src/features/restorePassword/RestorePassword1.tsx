import { useState, ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { ForgotPasswordDtoSchema, customInstance } from "@trading-bot/api-client";

export function RestorePassword1() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (value: string): string => {
        if (!value) {
            return "Email is required";
        }
        try {
            ForgotPasswordDtoSchema.parse({ email: value });
            return "";
        } catch (error: any) {
            if (error.issues && error.issues[0]) {
                return error.issues[0].message;
            }
            return "Please provide a valid email address";
        }
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setEmail(value);
        setFormError("");
        
        if (value) {
            const error = validateEmail(value);
            setEmailError(error);
        } else {
            setEmailError("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError("");

        // Validate email
        const error = validateEmail(email);
        if (error) {
            setEmailError(error);
            return;
        }

        setIsLoading(true);
        try {
            console.log("Sending forgot-password request for email:", email);
            const response = await customInstance<{ token: string; message: string }>(
                "/api/v1/auth/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                }
            );

            console.log("Forgot-password response:", response);

            // Store token in localStorage
            if (response && response.token) {
                localStorage.setItem("password_reset_token", response.token);
                console.log("Token stored in localStorage");
            }

            // Navigate to Step 2
            console.log("Navigating to Step 2");
            navigate("/restore-password-2");
        } catch (error: any) {
            console.error("Forgot-password error:", error);
            console.error("Error status:", error?.status);
            console.error("Error message:", error?.message);
            console.error("Full error object:", JSON.stringify(error, null, 2));
            
            // For security reasons, show same message whether user exists or not
            // This prevents email enumeration attacks
            // According to docs: show message but navigate to Step 2 for security
            if (error?.status === 500 || error?.statusCode === 500) {
                setFormError("An error occurred. Please try again later.");
                // Don't navigate on server error, let user retry
                console.log("Server error (500) - staying on Step 1");
            } else {
                // For 404 or other errors, show security message and navigate to Step 2
                setFormError("If an account with this email exists, a password reset code has been sent to your email.");
                // Navigate to Step 2 even on error for security (prevents email enumeration)
                console.log("Navigating to Step 2 despite error");
                navigate("/restore-password-2");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = email && !emailError;

    return (
        <AuthLayout
            currentStep={1}
            title="Insert your email"
            Illustration={ManNextToTheSafe}
            actions={
                <>
                    <Button
                        text="Send me code on email"
                        type="submit"
                        form="restore-password-form-1"
                        disabled={!isFormValid || isLoading}
                    />
                    <div className="mt-4">
                        <Button
                            text="Back to Sign In"
                            variant="text"
                            onClick={() => navigate("/sign-in")}
                        />
                    </div>
                </>
            }
            totalSteps={3}
        >
            {formError && (
                <div className="mt-4 p-4 bg-error/10 border border-error rounded-md">
                    <p className="text-body-sm text-error">{formError}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} id="restore-password-form-1">
                <Input
                    label="Email *"
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={handleEmailChange}
                    error={emailError}
                />
            </form>
        </AuthLayout>
    );
}
