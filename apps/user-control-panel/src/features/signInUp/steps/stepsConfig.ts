import { SIGN_UP_STRINGS } from '../strings/signUpStrings';

const { steps } = SIGN_UP_STRINGS;

export interface StepConfig {
  step: 0 | 1 | 2 | 3;
  title: string;
}

const stepsConfig: StepConfig[] = [
  {
    step: 0,
    title: steps.step1Title,
  },
  {
    step: 1,
    title: steps.step2Title,
  },
  {
    step: 2,
    title: steps.step3Title,
  },
  {
    step: 3,
    title: steps.step4Title,
  },
];

export function getStepConfig(step: 0 | 1 | 2 | 3): StepConfig {
  return stepsConfig[step];
}
