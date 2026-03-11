import { Injectable, OnModuleInit } from '@nestjs/common';
import { ServiceCommService, type MessageEnvelope, unpackEnvelope } from '@trading-bot/service-comm';
import { ModelsService } from '@trading-bot/models';
import { RuleRunnerService } from './rule-runner.service';

@Injectable()
export class RuleOrchestrationService implements OnModuleInit {
    constructor(
        private readonly comm: ServiceCommService,
        private readonly modelsService: ModelsService,
        private readonly ruleRunner: RuleRunnerService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.loadAndRunAllRules();

        await this.comm.subscribe(
            {
                consumerGroup: 'auto-trader.rules',
                topics: ['api.rule.created', 'api.rule.updated', 'api.rule.deleted'],
                prefetch: 10,
            },
            async (envelope: MessageEnvelope<any>) => {
                const { topic, payload } = unpackEnvelope(envelope);

                if (topic === 'api.rule.deleted') {
                    const ruleId = Number(payload?.id);
                    if (!Number.isFinite(ruleId)) return;
                    this.ruleRunner.stopRuleRunner(ruleId);
                    return;
                }

                const ruleId = Number(payload?.id);
                if (!Number.isFinite(ruleId)) return;
                await this.reloadRule(ruleId);
            }
        );
    }

    private async loadAndRunAllRules(): Promise<void> {
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
                this.ruleRunner.startRuleRunner(id, ruleBody, telegramSettings);
            });
        });
    }

    private async reloadRule(ruleId: number): Promise<void> {
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
            this.ruleRunner.stopRuleRunner(ruleId);
            return;
        }

        this.ruleRunner.rerunRuleRunner(rule.id, rule.ruleBody as any, rule.author.telegramSettings);
    }
}
