import { Injectable, OnModuleInit } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { ActionsRunner } from '../actions-runner/actions-runner';

@Injectable()
export class RuleRunnerService implements OnModuleInit {
    private actionsRunnersByRuleId = new Map<number, ActionsRunner>();

    constructor(private readonly modelsService: ModelsService) {}

    async onModuleInit(): Promise<void> {
        await this.loadAndRunAllRules();
    }

    async loadAndRunAllRules(): Promise<void> {
        const users = await this.modelsService.user.findMany({
            select: {
                rules: true,
                telegramSettings: true,
            },
        });

        users.forEach((user) => {
            const { rules, telegramSettings } = user;
            rules.forEach((rule) => {
                const { ruleBody, id } = rule as any;
                const actionsRunner = new ActionsRunner(ruleBody, { telegramSettings });
                actionsRunner.run();
                this.actionsRunnersByRuleId.set(id, actionsRunner);
            });
        });
    }

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

    async reloadRuleRunner(ruleId: number): Promise<void> {
        this.stopRuleRunner(ruleId);

        const rule = await this.modelsService.userRules.findUnique({
            where: { id: ruleId },
            select: {
                id: true,
                ruleBody: true,
                author: {
                    select: {
                        telegramSettings: true,
                    },
                },
            },
        });

        if (!rule) {
            return;
        }

        this.startRuleRunner(rule.id, rule.ruleBody as any, rule.author.telegramSettings);
    }
}
