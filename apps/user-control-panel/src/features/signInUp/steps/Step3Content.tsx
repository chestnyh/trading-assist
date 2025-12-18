import { ChevronLeft, ChevronRight } from "lucide-react";

import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { Checkbox } from "../../../shared/ui/forms/Checkbox";
import { ErrorAlert } from "../../../shared/ui/feedback/ErrorAlert";
import { createInputHandler, createCheckboxHandler } from "../../../shared/utils/formHandlers";
import { useSignUpStep3, useSignUpContext } from "../../../app/contexts/SignUpContext";
import { SIGN_UP_STRINGS } from "../strings/signUpStrings";

const { step3, buttons } = SIGN_UP_STRINGS;

export function Step3Content() {
    const { state, setField, validateAndGetResult } = useSignUpStep3();
    const { registerUser, isSubmitting, serverError, nextStep, prevStep } = useSignUpContext();

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
                label={step3.labels.email}
                id="email"
                name="email"
                placeholder={step3.placeholders.email}
                value={state.email}
                onChange={createInputHandler(setField, "email")}
                error={state.errors.email}
                required
            />

            <Input
                label={step3.labels.nickname}
                id="nickname"
                name="nickname"
                placeholder={step3.placeholders.nickname}
                value={state.nickname}
                onChange={createInputHandler(setField, "nickname")}
                error={state.errors.nickname}
                required
            />

            <Input
                label={step3.labels.password}
                id="password"
                type="password"
                name="password"
                placeholder={step3.placeholders.password}
                value={state.password}
                onChange={createInputHandler(setField, "password")}
                error={state.errors.password}
                required
            />

            <Input
                label={step3.labels.confirmPassword}
                id="confirmPassword"
                type="password"
                name="confirmPassword"
                placeholder={step3.placeholders.confirmPassword}
                value={state.confirmPassword}
                onChange={createInputHandler(setField, "confirmPassword")}
                error={state.errors.confirmPassword}
                required
            />

            <div className="space-y-3 mt-10">
                <Checkbox
                    id="news-updates"
                    name="newsUpdates"
                    label={step3.labels.newsUpdates}
                    checked={state.newsUpdates}
                    onChange={createCheckboxHandler(setField, "newsUpdates")}
                />
                <Checkbox
                    id="tos-privacy"
                    name="tosPrivacy"
                    label={step3.labels.tosPrivacy}
                    checked={state.tosPrivacy}
                    onChange={createCheckboxHandler(setField, "tosPrivacy")}
                    required
                    error={state.errors.tosPrivacy}
                />
            </div>

            <ErrorAlert message={serverError} />

            <div className="mt-8 flex justify-between gap-3">
                <Button
                    text={buttons.back}
                    variant="outline"
                    leftIcon={<ChevronLeft />}
                    onClick={prevStep}
                />
                <Button
                    text={isSubmitting ? buttons.submitting : buttons.next}
                    rightIcon={<ChevronRight />}
                    onClick={handleNextClick}
                    disabled={disableNext}
                />
            </div>
        </>
    );
}
