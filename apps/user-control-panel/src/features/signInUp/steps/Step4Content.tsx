import { useState, ChangeEvent } from "react";
import { ChevronLeft } from "lucide-react";

import { Input } from "../../../shared/ui/forms/Input";
import { Button } from "../../../shared/ui/buttons/Button";
import { useSignUpContext } from "../../../app/contexts/SignUpContext";

export function Step4Content() {
    const { prevStep } = useSignUpContext();
    const [code, setCode] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleCodeChange = (e: ChangeEvent<HTMLInputElement>) => {
        setCode(e.target.value);
        setError(null);
    };

    const handleBackClick = () => {
        prevStep();
    };

    const handleSubmit = async () => {
        if (!code.trim()) {
            setError("Please enter the verification code");
            return;
        }

        setIsSubmitting(true);
        // TODO: Implement email verification API call
        console.log("Verifying code:", code);
        setIsSubmitting(false);
    };

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
                error={error ?? undefined}
                required
            />

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
                    disabled={isSubmitting || !code.trim()}
                />
            </div>
        </>
    );
}
