export interface StepConfig {
  step: 0 | 1 | 2;
  title: string;
}

export const stepsConfig: StepConfig[] = [
  {
    step: 0,
    title: "Insert your email",
  },
  {
    step: 1,
    title: "Insert code",
  },
  {
    step: 2,
    title: "Enter new password",
  },
];

export function getStepConfig(step: 0 | 1 | 2): StepConfig {
  return stepsConfig[step];
}

