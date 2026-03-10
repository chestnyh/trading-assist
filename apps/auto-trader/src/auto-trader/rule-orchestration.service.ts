import { Injectable, OnModuleInit } from '@nestjs/common';
import { ServiceCommService, type MessageEnvelope } from '@trading-bot/service-comm';
import { RuleRunnerService } from './rule-runner.service';

@Injectable()
export class RuleOrchestrationService implements OnModuleInit {
    constructor(
        private readonly comm: ServiceCommService,
        private readonly ruleRunner: RuleRunnerService,
    ) {}

    async onModuleInit(): Promise<void> {
        await this.comm.subscribe(
            {
                consumerGroup: 'auto-trader.rules',
                topics: ['api.rule.created', 'api.rule.updated', 'api.rule.deleted'],
                prefetch: 10,
            },
            async (envelope: MessageEnvelope<any>) => {
                const { type: topic, payload } = envelope;

                if (topic === 'api.rule.deleted') {
                    const ruleId = Number(payload?.id);
                    if (!Number.isFinite(ruleId)) return;
                    this.ruleRunner.stopRuleRunner(ruleId);
                    return;
                }

                const ruleId = Number(payload?.id);
                if (!Number.isFinite(ruleId)) return;
                await this.ruleRunner.reloadRuleRunner(ruleId);
            }
        );
    }
}
