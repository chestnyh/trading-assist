import { ComponentType } from "react";
import { ManAtTheTable } from "../components/svg/ManAtTheTable";
import { ManNearTheLamp } from "../components/svg/ManNearTheLamp";
import { ManNearTheTarget } from "../components/svg/ManNearTheTarget";

export interface StepConfig {
    step: 1 | 2 | 3 | 4;
    title: string;
    Illustration: ComponentType;
}

export const stepsConfig: StepConfig[] = [
    {
        step: 1,
        title: "Let's Start!",
        Illustration: ManAtTheTable,
    },
    {
        step: 2,
        title: "Trading Preferences",
        Illustration: ManNearTheLamp,
    },
    {
        step: 3,
        title: "Account Info",
        Illustration: ManNearTheTarget,
    },
    {
        step: 4,
        title: "Email Confirmation",
        Illustration: ManNearTheTarget,
    },
];

export function getStepConfig(step: 1 | 2 | 3 | 4): StepConfig {
    return stepsConfig[step - 1];
}
