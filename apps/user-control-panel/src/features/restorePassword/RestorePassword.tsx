import { useState } from "react";
import { AuthLayout } from "../layout/AuthLayout";
import { Step1Content } from "./steps/Step1Content";
import { Step2Content } from "./steps/Step2Content";
import { Step3Content } from "./steps/Step3Content";
import { getStepConfig } from "./steps/stepsConfig";

type RestorePasswordStep = 0 | 1 | 2;

export function RestorePassword() {
  const [step, setStep] = useState<RestorePasswordStep>(0);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(null);

  const config = getStepConfig(step);

  const goBack = () => {
    setStep((prev) => (prev > 0 ? ((prev - 1) as RestorePasswordStep) : prev));
  };

  const handleRequestNewCode = () => {
    // Clear all form state and go back to Step 1
    setEmail("");
    setCode("");
    setPassword("");
    setConfirmPassword("");
    setFormError(null);
    setEmailError(null);
    setCodeError(null);
    setPasswordError(null);
    setConfirmPasswordError(null);
    localStorage.removeItem("password_reset_token");
    setStep(0);
  };

  const handleEmailChange = (value: string) => {
    setEmail(value);
    setEmailError(null);
    setFormError(null);
  };

  const handleCodeChange = (value: string) => {
    setCode(value);
    setCodeError(null);
    setFormError(null);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    setPasswordError(null);
    setFormError(null);
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    setConfirmPasswordError(null);
    setFormError(null);
  };

  const renderStepContent = [
    <Step1Content
      key="step1"
      email={email}
      emailError={emailError}
      formError={formError}
      isLoading={isLoading}
      onEmailChange={handleEmailChange}
      setStep={setStep}
      setIsLoading={setIsLoading}
      setFormError={setFormError}
      setEmailError={setEmailError}
    />,
    <Step2Content
      key="step2"
      code={code}
      codeError={codeError}
      formError={formError}
      isLoading={isLoading}
      onCodeChange={handleCodeChange}
      setStep={setStep}
      setIsLoading={setIsLoading}
      setFormError={setFormError}
      setCodeError={setCodeError}
      onBack={goBack}
      onRequestNewCode={handleRequestNewCode}
    />,
    <Step3Content
      key="step3"
      password={password}
      confirmPassword={confirmPassword}
      passwordError={passwordError}
      confirmPasswordError={confirmPasswordError}
      formError={formError}
      isLoading={isLoading}
      onPasswordChange={handlePasswordChange}
      onConfirmPasswordChange={handleConfirmPasswordChange}
      setIsLoading={setIsLoading}
      setFormError={setFormError}
      setPasswordError={setPasswordError}
      setConfirmPasswordError={setConfirmPasswordError}
    />,
  ];

  return (
    <AuthLayout
      currentStep={step + 1}
      totalSteps={3}
      title={config.title}
    >
      {renderStepContent[step] || null}
    </AuthLayout>
  );
}
