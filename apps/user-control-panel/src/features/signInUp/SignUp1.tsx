import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { Input } from "../../shared/ui/forms/Input";
import { Select } from "../../shared/ui/forms/Select";
import { Button } from "../../shared/ui/buttons/Button";
import { AuthLayout } from "../layout/AuthLayout";
import { ArrowRight } from "./components/icons/ArrowRight";

export function SignUp1() {
    return (
        <AuthLayout
            currentStep={0}
            title="Let’s Start!"
            Illustration={ManAtTheTable}
            actions={<Button text="Next" rightIcon={<ArrowRight />} />}
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
                error="This field is required"
            />
            <Select
                label="Country"
                id="country"
                name="country"
                placeholder="Select your country"
                options={[
                    { value: "US", label: "🇺🇸 United States" },
                    { value: "UK", label: "🇬🇧 United Kingdom" },
                    { value: "US", label: "🇺🇸 United States" },
                    { value: "UK", label: "🇬🇧 United Kingdom" },
                    { value: "CA", label: "🇨🇦 Canada" },
                    { value: "AU", label: "🇦🇺 Australia" },
                    { value: "DE", label: "🇩🇪 Germany" },
                    { value: "FR", label: "🇫🇷 France" },
                    { value: "IT", label: "🇮🇹 Italy" },
                    { value: "ES", label: "🇪🇸 Spain" },
                    { value: "NL", label: "🇳🇱 Netherlands" },
                    { value: "BE", label: "🇧🇪 Belgium" },
                    { value: "CH", label: "🇨🇭 Switzerland" },
                    { value: "AT", label: "🇦🇹 Austria" },
                    { value: "SE", label: "🇸🇪 Sweden" },
                    { value: "NO", label: "🇳🇴 Norway" },
                    { value: "DK", label: "🇩🇰 Denmark" },
                    { value: "FI", label: "🇫🇮 Finland" },
                    { value: "PL", label: "🇵🇱 Poland" },
                    { value: "CZ", label: "🇨🇿 Czech Republic" },
                    { value: "IE", label: "🇮🇪 Ireland" },
                    { value: "PT", label: "🇵🇹 Portugal" },
                    { value: "GR", label: "🇬🇷 Greece" },
                    { value: "UA", label: "🇺🇦 Ukraine" },
                ]}
            />
        </AuthLayout>
    );
}
