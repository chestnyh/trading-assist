import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ManNextToTheSafe } from "./components/svg/ManNextToTheSafe";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { ArrowLeft } from "../signInUp/components/icons/ArrowLeft";
import { ArrowRight } from "../signInUp/components/icons/ArrowRight";
import { VerifyPasswordResetDtoSchema, customInstance } from "@trading-bot/api-client";

export function RestorePassword2() {
    const navigate = useNavigate();
    const [code, setCode] = useState("");
    const [codeError, setCodeError] = useState("");
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

    const validateCode = (value: string): string => {
        if (!value) {
            return "Verification code is required";
        }
        try {
            // Use VerifyPasswordResetDtoSchema for validation (code part)
            // We validate code separately, token is validated on submit
            VerifyPasswordResetDtoSchema.shape.code.parse(value);
            return "";
        } catch (error: any) {
            if (error.issues && error.issues[0]) {
                return error.issues[0].message;
            }
            return "Verification code must be 6 digits";
        }
    };

    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.replace(/\D/g, "").slice(0, 6); // Only allow digits, max 6
        setCode(value);
        setFormError("");
        
        if (value) {
            const error = validateCode(value);
            setCodeError(error);
        } else {
            setCodeError("");
        }
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!token) {
            setFormError("Invalid or expired token. Please start the password reset process again.");
            return;
        }

        // Validate code
        const error = validateCode(code);
        if (error) {
            setCodeError(error);
            return;
        }

        setIsLoading(true);
        try {
            await customInstance<{ message: string }>(
                "/api/v1/auth/verify-password-reset",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ code, token }),
                }
            );

            // Navigate to Step 3
            navigate("/restore-password-3");
        } catch (error: any) {
            if (error.status === 401) {
                setFormError("Invalid or expired token. Please start the password reset process again.");
            } else if (error.status === 400) {
                if (error.message?.includes("expired")) {
                    setFormError("Verification code has expired. Please request a new code.");
                } else {
                    setFormError("Invalid verification code. Please check your email and try again.");
                }
            } else {
                setFormError("An error occurred. Please try again later.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleBack = () => {
        navigate("/restore-password-1");
    };

    const isFormValid = code && !codeError && token;

    return (
        <AuthLayout
            currentStep={2}
            title="Insert code"
            Illustration={ManNextToTheSafe}
            actions={
                <>
                    <Button
                        text="Back"
                        variant="outline"
                        leftIcon={<ArrowLeft />}
                        onClick={handleBack}
                    />
                    <Button
                        text="Reset password"
                        rightIcon={<ArrowRight />}
                        type="submit"
                        form="restore-password-form-2"
                        disabled={!isFormValid || isLoading}
                    />
                </>
            }
            totalSteps={3}
        >
            {formError && (
                <div className="mt-4 p-4 bg-error/10 border border-error rounded-md">
                    <p className="text-body-sm text-error">{formError}</p>
                </div>
            )}
            <form onSubmit={handleSubmit} id="restore-password-form-2">
                <Input
                    label="Verification Code *"
                    id="code"
                    name="code"
                    type="text"
                    placeholder="Enter verification code"
                    value={code}
                    onChange={handleCodeChange}
                    error={codeError}
                />
            </form>
        </AuthLayout>
    );
}
