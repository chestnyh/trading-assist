import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { ResetPasswordDtoSchema, customInstance } from "@trading-bot/api-client";

export function RestorePassword3() {
    const navigate = useNavigate();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");
    const [formError, setFormError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    // Restore token from localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem("password_reset_token");
        if (storedToken) {
            setToken(storedToken);
        } else {
            // If no token, redirect to Step 1
            navigate("/restore-password-1");
        }
    }, [navigate]);

    const validatePassword = (value: string): string => {
        if (!value) {
            return "Password is required";
        }
        try {
            // Extract password schema from ResetPasswordDtoSchema
            const passwordSchema = ResetPasswordDtoSchema.shape.password;
            passwordSchema.parse(value);
            return "";
        } catch (error: any) {
            if (error.issues && error.issues[0]) {
                return error.issues[0].message;
            }
            return "Password does not meet requirements";
        }
    };

    const validateConfirmPassword = (value: string, passwordValue: string): string => {
        if (!value) {
            return "Confirm password is required";
        }
        if (value !== passwordValue) {
            return "Passwords do not match";
        }
        return "";
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setPassword(value);
        setFormError("");
        
        if (value) {
            const error = validatePassword(value);
            setPasswordError(error);
        } else {
            setPasswordError("");
        }

        // Re-validate confirm password if it has a value
        if (confirmPassword) {
            const confirmError = validateConfirmPassword(confirmPassword, value);
            setConfirmPasswordError(confirmError);
        }
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setConfirmPassword(value);
        setFormError("");
        
        if (value) {
            const error = validateConfirmPassword(value, password);
            setConfirmPasswordError(error);
        } else {
            setConfirmPasswordError("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!token) {
            setFormError("Invalid or expired token. Please start the password reset process again.");
            return;
        }

        // Validate password
        const passwordError = validatePassword(password);
        if (passwordError) {
            setPasswordError(passwordError);
            return;
        }

        // Validate confirm password
        const confirmError = validateConfirmPassword(confirmPassword, password);
        if (confirmError) {
            setConfirmPasswordError(confirmError);
            return;
        }

        setIsLoading(true);
        try {
            await customInstance<{ message: string }>(
                "/api/v1/auth/reset-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password, token }),
                }
            );

            // Remove all password reset related data from localStorage
            localStorage.removeItem("password_reset_token");

            // Navigate to login page
            navigate("/sign-in");
        } catch (error: any) {
            if (error.status === 401) {
                setFormError("Invalid or expired token. Please start the password reset process again.");
            } else if (error.status === 400) {
                if (error.message?.includes("already been used")) {
                    setFormError("This password reset link has already been used. Please request a new one.");
                } else if (error.message?.includes("requirements")) {
                    setFormError("Password does not meet requirements");
                } else {
                    setFormError(error.message || "An error occurred. Please try again later.");
                }
            } else {
                setFormError("An error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const isFormValid = password && !passwordError && confirmPassword && !confirmPasswordError && token;

    return (
        <AuthLayout
            currentStep={3}
            title="Enter new password"
            Illustration={ManNextToTheSafe}
            actions={
                <Button
                    text="Set Up New Password"
                    type="submit"
                    form="restore-password-form-3"
                    disabled={!isFormValid || isLoading}
                />
            }
            totalSteps={3}
        >
            {formError && (
                <div className="mt-4 p-4 bg-error/10 border border-error rounded-md">
                    <p className="text-body-sm text-error">{formError}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} id="restore-password-form-3">
                <Input
                    label="Password *"
                    id="password"
                    type="password"
                    name="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={handlePasswordChange}
                    error={passwordError}
                />
                <Input
                    label="Confirm Password *"
                    id="confirmPassword"
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    error={confirmPasswordError}
                />
            </form>
        </AuthLayout>
    );
}
