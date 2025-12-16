import { ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { AuthLayout } from "../layout/AuthLayout";
import { Input } from "../../shared/ui/forms/Input";
import { CountrySelect } from "../../shared/ui/forms/CountrySelect";
import { Button } from "../../shared/ui/buttons/Button";
import { countries } from "../../shared/data/countries";

import { useSignUpStep1 } from "../../app/contexts/SignUpContext";

export function SignUp1() {
    const navigate = useNavigate();
    const { state, setField, validateAndGetResult } = useSignUpStep1();

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
            navigate("/sign-up-2");
        }
    };

    const disableNext = state.hasAttemptedValidation && Object.keys(state.errors).length > 0;

    return (
        <AuthLayout
            currentStep={1}
            title="Let's Start!"
            Illustration={ManAtTheTable}
            actions={
                <Button
                    text="Next"
                    rightIcon={<ChevronRight />}
                    onClick={handleNextClick}
                    disabled={disableNext}
                />
            }
            totalSteps={4}
        >
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
        </AuthLayout>
    );
}
