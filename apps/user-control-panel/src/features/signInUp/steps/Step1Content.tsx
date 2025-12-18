import { ChevronRight } from "lucide-react";

import { Input } from "../../../shared/ui/forms/Input";
import { CountrySelect } from "../../../shared/ui/forms/CountrySelect";
import { Button } from "../../../shared/ui/buttons/Button";
import { countries } from "../../../shared/data/countries";
import { createInputHandler, createSelectHandler } from "../../../shared/utils/formHandlers";
import { useSignUpStep1, useSignUpContext } from "../../../app/contexts/SignUpContext";
import { SIGN_UP_STRINGS } from "../strings/signUpStrings";

const { step1, buttons } = SIGN_UP_STRINGS;

export function Step1Content() {
    const { state, setField, validateAndGetResult } = useSignUpStep1();
    const { nextStep } = useSignUpContext();

    const handleNextClick = () => {
        const { ok } = validateAndGetResult();
        if (ok) {
            nextStep();
        }
    };

    const disableNext = state.hasAttemptedValidation && Object.keys(state.errors).length > 0;

    return (
        <>
            <Input
                label={step1.labels.firstName}
                id="firstName"
                name="firstName"
                placeholder={step1.placeholders.firstName}
                value={state.firstName}
                onChange={createInputHandler(setField, "firstName")}
                error={state.errors.firstName}
                required
            />

            <Input
                label={step1.labels.lastName}
                id="lastName"
                name="lastName"
                placeholder={step1.placeholders.lastName}
                value={state.lastName}
                onChange={createInputHandler(setField, "lastName")}
                error={state.errors.lastName}
                required
            />

            <CountrySelect
                label={step1.labels.country}
                id="country"
                name="country"
                placeholder={step1.placeholders.country}
                options={countries}
                value={state.country}
                onChange={createSelectHandler(setField, "country")}
                error={state.errors.country}
                required
            />

            <div className="mt-8">
                <Button
                    text={buttons.next}
                    rightIcon={<ChevronRight />}
                    onClick={handleNextClick}
                    disabled={disableNext}
                />
            </div>
        </>
    );
}
