import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { VerifyEmailDtoSchema, authControllerVerifyEmail } from "@trading-bot/api-client";

import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { useSignUpContext } from "../../../app/contexts/SignUpContext";

export function Step4Content() {
    const navigate = useNavigate();
    const { prevStep, emailVerificationToken, clearStorage } = useSignUpContext();
    const [code, setCode] = useState("");
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [serverError, setServerError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [hasAttemptedValidation, setHasAttemptedValidation] = useState(false);

    useEffect(() => {
        if (isSuccess) {
            const timer = setTimeout(() => {
                navigate("/sign-in");
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [isSuccess, navigate]);

    const getValidationError = (value: string): string | null => {
        const result = VerifyEmailDtoSchema.shape.code.safeParse(value);
        if (!result.success) {
            return result.error.issues[0]?.message || "Invalid verification code";
        }
        return null;
    };

    const isCodeValid = getValidationError(code) === null;

    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {

        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setCode(value);
        setServerError(null);

        if (hasAttemptedValidation) {
            const error = getValidationError(value);
            setFieldError(error);
        }
    };

    const handleBackClick = () => {
        prevStep();
    };

    const validateCode = (): boolean => {
        setHasAttemptedValidation(true);
        const error = getValidationError(code);
        setFieldError(error);
        return error === null;
    };

    const handleSubmit = async () => {
        if (!validateCode()) {
            return;
        }

        if (!emailVerificationToken) {
            setServerError("Verification token is missing. Please go back and complete registration.");
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        try {
            const response = await authControllerVerifyEmail({
                code,
                token: emailVerificationToken,
            });

            const result = response as unknown as { success?: boolean; message?: string };

            if (result.success === true) {
                setIsSuccess(true);
                clearStorage();
            } else {
                const errorMessage = result.message || "Verification failed. Please try again.";
                setServerError(errorMessage);
                setFieldError("Invalid code");
            }
        } catch (err: unknown) {
            let errorMessage = "Verification failed. Please try again.";

            if (err && typeof err === "object") {
                if ("message" in err) {
                    const message = String(err.message);
                    if (message === "Failed to fetch" || message.includes("fetch")) {
                        errorMessage = "Unable to connect to the server. Please check your internet connection.";
                    } else {
                        errorMessage = message;
                    }
                } else if ("status" in err) {
                    const status = (err as { status: number }).status;
                    if (status === 400) {
                        errorMessage = "Invalid verification code. Please check and try again.";
                        setFieldError("Invalid code");
                    } else if (status === 401) {
                        errorMessage = "Verification code expired or invalid. Please request a new code.";
                        setFieldError("Expired or invalid code");
                    } else if (status >= 500) {
                        errorMessage = "Server error. Please try again later.";
                    }
                }
            }

            setServerError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isSuccess) {
        return (
            <>
                <div className="text-center py-8">
                    <div className="text-6xl mb-4">✓</div>
                    <h2 className="text-h3 font-semibold text-text mb-2">Email Verified!</h2>
                    <p className="text-body-md text-text-secondary">
                        Your email has been successfully verified. You can now sign in to your account.
                    </p>
                    <p className="text-body-sm text-text-secondary mt-2">
                        Redirecting to sign in page...
                    </p>
                </div>
                <div className="mt-8 flex justify-center">
                    <Button
                        text="Go to Sign In"
                        onClick={() => navigate("/sign-in")}
                    />
                </div>
            </>
        );
    }

    const isButtonDisabled = isSubmitting || (hasAttemptedValidation && !isCodeValid) || Boolean(fieldError);

    return (
        <>
            <p className="text-body-md text-text-secondary mb-4">
                We've sent a verification code to your email. Please enter it below to complete your registration.
            </p>

            <Input
                label="Verification Code"
                id="verificationCode"
                name="verificationCode"
                type="text"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={handleCodeChange}
                error={fieldError ?? undefined}
                required
            />

            {serverError && (
                <div className="mt-4 p-4 rounded-md bg-error/10 border border-error">
                    <p className="text-body-sm text-error">{serverError}</p>
                </div>
            )}

            <div className="mt-8 flex justify-between gap-3">
                <Button
                    text="Back"
                    variant="outline"
                    leftIcon={<ChevronLeft />}
                    onClick={handleBackClick}
                />
                <Button
                    text={isSubmitting ? "Verifying..." : "Verify"}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                />
            </div>
        </>
    );
}
