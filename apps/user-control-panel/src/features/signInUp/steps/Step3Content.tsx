import { ChangeEvent } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { Checkbox } from "../../../shared/ui/forms/Checkbox";
import { useSignUpStep3, useSignUpContext } from "../../../app/contexts/SignUpContext";

export function Step3Content() {
    const { state, setField, validateAndGetResult } = useSignUpStep3();
    const { registerUser, isSubmitting, serverError, nextStep, prevStep } = useSignUpContext();

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField("email", e.target.value);
    };

    const handleNicknameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField("nickname", e.target.value);
    };

    const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField("password", e.target.value);
    };

    const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField("confirmPassword", e.target.value);
    };

    const handleNewsUpdatesChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField("newsUpdates", e.target.checked);
    };

    const handleTosPrivacyChange = (e: ChangeEvent<HTMLInputElement>) => {
        setField("tosPrivacy", e.target.checked);
    };

    const handleBackClick = () => {
        prevStep();
    };

    const handleNextClick = async () => {
        const { ok } = validateAndGetResult();
        if (ok) {
            const result = await registerUser();
            if (result.ok) {
                nextStep();
            }
        }
    };

    const disableNext =
        (state.hasAttemptedValidation && Object.keys(state.errors).length > 0) || isSubmitting;

    return (
        <>
            <Input
                label="Email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={state.email}
                onChange={handleEmailChange}
                error={state.errors.email}
                required
            />

            <Input
                label="Nickname"
                id="nickname"
                name="nickname"
                placeholder="Enter your nickname"
                value={state.nickname}
                onChange={handleNicknameChange}
                error={state.errors.nickname}
                required
            />

            <Input
                label="Password"
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                value={state.password}
                onChange={handlePasswordChange}
                error={state.errors.password}
                required
            />

            <Input
                label="Confirm Password"
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder="Confirm your password"
                value={state.confirmPassword}
                onChange={handleConfirmPasswordChange}
                error={state.errors.confirmPassword}
                required
            />

            <div className="space-y-3 mt-10">
                <Checkbox
                    id="news-updates"
                    name="newsUpdates"
                    label="I want to receive news and updates via email"
                    checked={state.newsUpdates}
                    onChange={handleNewsUpdatesChange}
                />
                <Checkbox
                    id="tos-privacy"
                    name="tosPrivacy"
                    label="I have read and accept the Terms of Service and Privacy Policy"
                    checked={state.tosPrivacy}
                    onChange={handleTosPrivacyChange}
                    required
                    error={state.errors.tosPrivacy}
                />
            </div>

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
                    text={isSubmitting ? "Submitting..." : "Next"}
                    rightIcon={<ChevronRight />}
                    onClick={handleNextClick}
                    disabled={disableNext}
                />
            </div>
        </>
    );
}
