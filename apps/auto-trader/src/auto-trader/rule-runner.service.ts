import { Injectable } from '@nestjs/common';
import { ActionsRunner } from '../actions-runner/actions-runner';
import { RuleLogsService } from './rule-logs.service';

@Injectable()
export class RuleRunnerService {
    private actionsRunnersByRuleId = new Map<number, ActionsRunner>();

    startRuleRunner(
        ruleId: number,
        userId: number,
        ruleBody: any,
        ruleSettings: any,
        runId: string,
        ruleLogsService: RuleLogsService,
    ): void {
        const actionsRunner = new ActionsRunner(ruleId, userId, ruleBody, ruleSettings, runId, ruleLogsService);
        actionsRunner.run();
        this.actionsRunnersByRuleId.set(ruleId, actionsRunner);
    }

    stopRuleRunner(ruleId: number): void {
        const existing = this.actionsRunnersByRuleId.get(ruleId);
        if (!existing) return;
        existing.stop();
        this.actionsRunnersByRuleId.delete(ruleId);
    }

    rerunRuleRunner(
        ruleId: number,
        userId: number,
        ruleBody: any,
        ruleSettings: any,
        runId: string,
        ruleLogsService: RuleLogsService,
    ): void {
        this.stopRuleRunner(ruleId);
        this.startRuleRunner(ruleId, userId, ruleBody, ruleSettings, runId, ruleLogsService);
    }
}
