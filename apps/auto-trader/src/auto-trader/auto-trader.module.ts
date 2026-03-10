import { Module } from '@nestjs/common';

import { RuleRunnerService } from './rule-runner.service';
import { RuleOrchestrationService } from './rule-orchestration.service';

import { ModelsModule } from '@trading-bot/models';
import { ServiceCommModule } from '@trading-bot/service-comm';

import { ServicesConfigs } from '@trading-bot/configs';

const config = new ServicesConfigs();

@Module({
  imports: [
    ServiceCommModule.forRoot({
      rmq: {
        connection: {
          host: config.get('RMQ_HOST'),
          port: Number(config.get('RMQ_PORT')),
          username: config.get('RMQ_USER'),
          password: config.get('RMQ_PASSWORD'),
        },
        topology: {
          exchange: 'service_comm.topic',
        },
      },
    }),
    ModelsModule.forRoot({
      host: config.get('DB_HOST'),
      port: config.get('DB_PORT'),
      user: config.get('DB_USER'),
      password: config.get('DB_PASSWORD'),
      database: config.get('DB_NAME'),
    }),
  ],
  controllers: [],
  providers: [
    RuleRunnerService,
    RuleOrchestrationService,
  ],
})
export class AutoTraderModule {}
