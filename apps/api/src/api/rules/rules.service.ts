import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RuleResponseDto } from './dto/rule-response.dto';

@Injectable()
export class RulesService {
  constructor(private modelsService: ModelsService) {}
  private readonly MAX_LIMIT = 100;

  /**
   * Create a new rule for a user
   */
  async create(userId: number, createRuleDto: CreateRuleDto): Promise<RuleResponseDto> {
    const rule = await this.modelsService.runInTransaction(async (tx) => {
      const createdRule = await tx.userRules.create({
        data: {
          name: createRuleDto.name,
          description: createRuleDto.description,
          ruleBody: createRuleDto.ruleBody,
          authorId: userId,
        },
        select: {
          id: true,
          name: true,
          description: true,
          ruleBody: true,
          authorId: true,
        },
      });

      await tx.outboxMessage.create({
        data: {
          topic: 'api.rule.created',
          producer: 'api',
          payload: createdRule as any,
        },
      });

      return createdRule;
    });

    return rule as RuleResponseDto;
  }

  /**
   * Get all rules with pagination. If userId is provided, filters by that user.
   */
  async findAllByUser(userId: number | undefined, page = 1, limit = 20): Promise<{ rules: RuleResponseDto[], total: number }> {
    const safeLimit = Math.min(Math.max(1, Math.floor(limit)), this.MAX_LIMIT);
    const safePage = Math.max(1, Math.floor(page));
    const skip = (safePage - 1) * safeLimit;
    const where = userId !== undefined ? { authorId: userId } : undefined;

    const [rules, total] = await Promise.all([
      this.modelsService.userRules.findMany({
        where,
        skip,
        take: safeLimit,
        select: {
          id: true,
          name: true,
          description: true,
          ruleBody: true,
          authorId: true,
        },
        orderBy: { id: 'desc' },
      }),
      this.modelsService.userRules.count({ where }),
    ]);

    return { rules, total };
  }

  /**
   * Get a specific rule by ID
   */
  async findOne(ruleId: number, userId: number): Promise<RuleResponseDto> {
    const rule = await this.modelsService.userRules.findFirst({
      where: {
        id: ruleId,
        authorId: userId
      },
      select: {
        id: true,
        name: true,
        description: true,
        ruleBody: true,
        authorId: true
      }
    });

    if (!rule) {
      throw new NotFoundException('Rule not found');
    }

    return rule;
  }

  /**
   * Update a rule
   */
  async update(ruleId: number, userId: number, updateRuleDto: UpdateRuleDto): Promise<RuleResponseDto> {
    // First check if the rule exists and belongs to the user
    const existingRule = await this.modelsService.userRules.findFirst({
      where: {
        id: ruleId,
        authorId: userId
      }
    });

    if (!existingRule) {
      throw new NotFoundException('Rule not found');
    }

    const updatedRule = await this.modelsService.runInTransaction(async (tx) => {
      const rule = await tx.userRules.update({
        where: { id: ruleId },
        data: {
          ...(updateRuleDto.name && { name: updateRuleDto.name }),
          ...(updateRuleDto.description && { description: updateRuleDto.description }),
          ...(updateRuleDto.ruleBody && { ruleBody: updateRuleDto.ruleBody }),
        },
        select: {
          id: true,
          name: true,
          description: true,
          ruleBody: true,
          authorId: true,
        },
      });

      await tx.outboxMessage.create({
        data: {
          topic: 'api.rule.updated',
          producer: 'api',
          payload: rule as any,
        },
      });

      return rule;
    });

    return updatedRule as RuleResponseDto;
  }

  /**
   * Delete a rule
   */
  async remove(ruleId: number, userId: number): Promise<void> {
    // First check if the rule exists and belongs to the user
    const existingRule = await this.modelsService.userRules.findFirst({
      where: {
        id: ruleId,
        authorId: userId
      }
    });

    if (!existingRule) {
      throw new NotFoundException('Rule not found');
    }

    await this.modelsService.$transaction([
      this.modelsService.userRules.delete({
        where: { id: ruleId },
      }),
      this.modelsService.outboxMessage.create({
        data: {
          topic: 'api.rule.deleted',
          producer: 'api',
          payload: { id: ruleId } as any,
        },
      }),
    ]);
  }

  /**
   * Get all rules (admin only - for future use)
   */
  async findAll(): Promise<RuleResponseDto[]> {
    const rules = await this.modelsService.userRules.findMany({
      select: {
        id: true,
        name: true,
        description: true,
        ruleBody: true,
        authorId: true
      },
    });

    return rules;
  }
}
