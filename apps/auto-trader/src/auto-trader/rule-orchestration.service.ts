import { Injectable, OnModuleInit } from '@nestjs/common';
import { ServiceCommService, type MessageEnvelope, unpackEnvelope } from '@trading-bot/service-comm';
import { ModelsService } from '@trading-bot/models';
import { RuleRunnerService } from './rule-runner.service';
import { RuleLogsService } from './rule-logs.service';

@Injectable()
export class RuleOrchestrationService implements OnModuleInit {
    constructor(
        private readonly comm: ServiceCommService,
        private readonly modelsService: ModelsService,
        private readonly ruleRunner: RuleRunnerService,
        private readonly ruleLogsService: RuleLogsService,
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
                id: true,
                rules: true,
                ruleSettings: true,
            },
        });

        users.forEach((user) => {
            const { id: userId, rules, ruleSettings } = user;
            rules.forEach((rule) => {
                const { ruleBody, id: ruleId } = rule as any;
                const runId = this.generateRunId();
                this.ruleRunner.startRuleRunner(ruleId, userId, ruleBody, ruleSettings, runId, this.ruleLogsService);
            });
        });
    }

    private async reloadRule(ruleId: number): Promise<void> {
        const rule = await this.modelsService.userRules.findUnique({
            where: { id: ruleId },
            select: {
                id: true,
                authorId: true,
                ruleBody: true,
                author: {
                    select: {
                        ruleSettings: true,
                    },
                },
            },
        });

        if (!rule) {
            this.ruleRunner.stopRuleRunner(ruleId);
            return;
        }

        const runId = this.generateRunId();
        this.ruleRunner.rerunRuleRunner(rule.id, rule.authorId, rule.ruleBody as any, rule.author.ruleSettings, runId, this.ruleLogsService);
    }

    private generateRunId(): string {
        return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
    }
}
