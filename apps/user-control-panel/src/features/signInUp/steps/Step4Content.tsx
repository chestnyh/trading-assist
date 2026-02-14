import { useState, ChangeEvent, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Check } from "lucide-react";
import { VerifyEmailDtoSchema, authControllerVerifyEmail } from "@trading-bot/api-client";

import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { ErrorAlert } from "../../../shared/ui/feedback/ErrorAlert";
import { useSignUpContext } from "../../../app/contexts/SignUpContext";
import { SIGN_UP_STRINGS } from "../strings/signUpStrings";

const { step4, buttons } = SIGN_UP_STRINGS;

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
            return result.error.issues[0]?.message || step4.errors.invalidCodeField;
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
            setServerError(step4.errors.tokenMissing);
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        try {
            const response = await authControllerVerifyEmail({
                code,
                token: emailVerificationToken,
            });

            const result = response as unknown as {
                success?: boolean;
                message?: string;
                data?: { success?: boolean; message?: string };
            };
            const isVerified = result.success === true || result.data?.success === true;
            const serverMessage = result.message ?? result.data?.message;

            if (isVerified) {
                setIsSuccess(true);
                clearStorage();
            } else {
                const errorMessage = serverMessage || step4.errors.verificationFailed;
                setServerError(errorMessage);
                setFieldError(step4.errors.invalidCodeField);
            }
        } catch (err: unknown) {
            let errorMessage: string = step4.errors.verificationFailed;

            if (err && typeof err === "object") {
                if ("message" in err) {
                    const message = String(err.message);
                    if (message === "Failed to fetch" || message.includes("fetch")) {
                        errorMessage = step4.errors.networkError;
                    } else {
                        errorMessage = message;
                    }
                } else if ("status" in err) {
                    const status = (err as { status: number }).status;
                    if (status === 400) {
                        errorMessage = step4.errors.invalidCode;
                        setFieldError(step4.errors.invalidCodeField);
                    } else if (status === 401) {
                        errorMessage = step4.errors.expiredCode;
                        setFieldError(step4.errors.expiredCodeField);
                    } else if (status >= 500) {
                        errorMessage = step4.errors.serverError;
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
                    <h2 className="text-h3 font-semibold text-text mb-2">{step4.messages.successTitle}</h2>
                    <p className="text-body-md text-text-secondary">
                        {step4.messages.successMessage}
                    </p>
                    <p className="text-body-sm text-text-secondary mt-2">
                        {step4.messages.redirecting}
                    </p>
                </div>
                <div className="mt-8 flex justify-center">
                    <Button
                        text={buttons.goToSignIn}
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
                {step4.messages.instructions}
            </p>

            <Input
                label={step4.labels.verificationCode}
                id="verificationCode"
                name="verificationCode"
                type="text"
                placeholder={step4.placeholders.verificationCode}
                value={code}
                onChange={handleCodeChange}
                error={fieldError ?? undefined}
                required
            />

            <ErrorAlert message={serverError} />

            <div className="mt-8 flex justify-between gap-3">
                <Button
                    text={buttons.back}
                    variant="outline"
                    leftIcon={<ChevronLeft />}
                    onClick={prevStep}
                />
                <Button
                    text={isSubmitting ? buttons.verifying : buttons.verify}
                    rightIcon={<Check />}
                    onClick={handleSubmit}
                    disabled={isButtonDisabled}
                />
            </div>
        </>
    );
}
