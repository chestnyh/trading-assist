import { ChangeEvent } from "react";
import { ChevronRight } from "lucide-react";

import { Input } from "../../../shared/ui/forms/Input";
import { CountrySelect } from "../../../shared/ui/forms/CountrySelect";
import { Button } from "../../../shared/ui/buttons/Button";
import { countries } from "../../../shared/data/countries";
import { useSignUpStep1, useSignUpContext } from "../../../app/contexts/SignUpContext";

export function Step1Content() {
    const { state, setField, validateAndGetResult } = useSignUpStep1();
    const { nextStep } = useSignUpContext();

    const handleInput =
        (field: "firstName" | "lastName") =>
            (e: ChangeEvent<HTMLInputElement>) => {
                setField(field, e.target.value);
            };

    const handleCountryChange = (e: ChangeEvent<HTMLSelectElement>) => {
        setField("country", e.target.value);
    };

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
                label="First Name"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
                value={state.firstName}
                onChange={handleInput("firstName")}
                error={state.errors.firstName}
                required
            />

            <Input
                label="Last Name"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                value={state.lastName}
                onChange={handleInput("lastName")}
                error={state.errors.lastName}
                required
            />

            <CountrySelect
                label="Country"
                id="country"
                name="country"
                placeholder="Select your country"
                options={countries}
                value={state.country}
                onChange={handleCountryChange}
                error={state.errors.country}
                required
            />

            <div className="mt-8 flex justify-end">
                <Button
                    text="Next"
                    rightIcon={<ChevronRight />}
                    onClick={handleNextClick}
                    disabled={disableNext}
                />
            </div>
        </>
    );
}
