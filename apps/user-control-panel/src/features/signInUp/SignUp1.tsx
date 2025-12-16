import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { Input } from "../../shared/ui/forms/Input";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { CountrySelect } from "../../shared/ui/forms/CountrySelect";
import { countries } from "../../shared/data/countries";
import { ChevronRight } from "lucide-react";

export function SignUp1() {
    return (
        <AuthLayout
            currentStep={1}
            title="Let’s Start!"
            Illustration={ManAtTheTable}
            actions={<Button text="Next" rightIcon={<ChevronRight />} />}
            totalSteps={4}
        >
            <Input
                label="First Name"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
            />
            <Input
                label="Last Name"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
            />
            <CountrySelect
                label="Country"
                id="country"
                name="country"
                placeholder="Select your country"
                options={countries}
            />
        </AuthLayout>
    );
}
