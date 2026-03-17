import { Injectable } from '@nestjs/common';
import { ActionsRunner } from '../actions-runner/actions-runner';

@Injectable()
export class RuleRunnerService {
    private actionsRunnersByRuleId = new Map<number, ActionsRunner>();

    startRuleRunner(ruleId: number, ruleBody: any, telegramSettings: any): void {
        const actionsRunner = new ActionsRunner(ruleBody, { telegramSettings });
        actionsRunner.run();
        this.actionsRunnersByRuleId.set(ruleId, actionsRunner);
    }

    stopRuleRunner(ruleId: number): void {
        const existing = this.actionsRunnersByRuleId.get(ruleId);
        if (!existing) return;
        existing.stop();
        this.actionsRunnersByRuleId.delete(ruleId);
    }

    rerunRuleRunner(ruleId: number, ruleBody: any, telegramSettings: any): void {
        this.stopRuleRunner(ruleId);
        this.startRuleRunner(ruleId, ruleBody, telegramSettings);
    }
}
