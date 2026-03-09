import { Injectable } from '@nestjs/common';
import { ActionsRunner } from "../actions-runner/actions-runner";
import { ModelsService } from "@trading-bot/models";
import { ServiceCommService, type MessageEnvelope } from '@trading-bot/service-comm';

@Injectable()
export class AutoTraderService {

    private actionsRunnersByRuleId = new Map<number, ActionsRunner>();

    constructor(
        private modelsService: ModelsService,
        private readonly comm: ServiceCommService
    ){
        this.init();
    }
    async init(){
        const users = await this.modelsService.user.findMany({
            select: {
              rules: true,
              telegramSettings: true
            },
        });

        users.forEach(user => {
            const {rules, telegramSettings} = user;
            rules.forEach(rule => {
                const {ruleBody, id} = rule as any;
                const actionsRunner = new ActionsRunner(ruleBody, {telegramSettings});
                actionsRunner.run();
                this.actionsRunnersByRuleId.set(id, actionsRunner);
            });
        });

        await this.comm.subscribe(
            {
                consumerGroup: 'auto-trader.rules',
                topics: ['api.rule.created', 'api.rule.updated', 'api.rule.deleted'],
                prefetch: 10,
            },
            async (envelope: MessageEnvelope<any>) => {
                const topic = envelope.type;
                const payload = envelope.payload;

                if (topic === 'api.rule.deleted') {
                    const ruleId = Number(payload?.id);
                    if (!Number.isFinite(ruleId)) return;
                    this.stopRuleRunner(ruleId);
                    return;
                }

                const ruleId = Number(payload?.id);
                if (!Number.isFinite(ruleId)) return;
                await this.reloadRuleRunner(ruleId);
            }
        );
    }

    private stopRuleRunner(ruleId: number): void {
        const existing = this.actionsRunnersByRuleId.get(ruleId);
        if (!existing) return;
        existing.stop();
        this.actionsRunnersByRuleId.delete(ruleId);
    }

    private async reloadRuleRunner(ruleId: number): Promise<void> {
        const rule = await this.modelsService.userRules.findUnique({
            where: { id: ruleId },
            select: {
                id: true,
                ruleBody: true,
                authorId: true,
                author: {
                    select: {
                        telegramSettings: true,
                    },
                },
            },
        });

        if (!rule) {
            this.stopRuleRunner(ruleId);
            return;
        }

        this.stopRuleRunner(ruleId);

        const actionsRunner = new ActionsRunner(rule.ruleBody as any, {
            telegramSettings: rule.author.telegramSettings,
        });
        actionsRunner.run();
        this.actionsRunnersByRuleId.set(rule.id, actionsRunner);
    }
}
