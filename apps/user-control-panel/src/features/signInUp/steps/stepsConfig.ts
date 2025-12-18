import { SIGN_UP_STRINGS } from "../strings/signUpStrings";

const { steps } = SIGN_UP_STRINGS;

export interface StepConfig {
    step: 1 | 2 | 3 | 4;
    title: string;
}

export const stepsConfig: StepConfig[] = [
    {
        step: 1,
        title: steps.step1Title,
    },
    {
        step: 2,
        title: steps.step2Title,
    },
    {
        step: 3,
        title: steps.step3Title,
    },
    {
        step: 4,
        title: steps.step4Title,
    },
];

export function getStepConfig(step: 1 | 2 | 3 | 4): StepConfig {
    return stepsConfig[step - 1];
}
