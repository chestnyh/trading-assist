import { ManAtTheTable } from "./components/svg/ManAtTheTable";
import { FormInput } from "./components/FormInput";
import { FormSelect } from "./components/FormSelect";
import { FormButton } from "./components/FormButton";
import { AuthLayout } from "./components/AuthLayout";
import { ArrowRight } from "./components/icons/ArrowRight";

export function SignUp1() {
    return (
        <AuthLayout
            currentStep={0}
            title="Let’s Start!"
            Illustration={ManAtTheTable}
            actions={<FormButton text="Next" rightIcon={<ArrowRight />} />}
        >
            <FormInput
                label="First Name"
                id="firstName"
                name="firstName"
                placeholder="Enter your first name"
            />
            <FormInput
                label="Last Name"
                id="lastName"
                name="lastName"
                placeholder="Enter your last name"
                error="This field is required"
            />
            <FormSelect
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
