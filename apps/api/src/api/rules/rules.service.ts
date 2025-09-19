import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RuleResponseDto } from './dto/rule-response.dto';

@Injectable()
export class RulesService {
  constructor(private modelsService: ModelsService) {}

  /**
   * Create a new rule for a user
   */
  async create(userId: number, createRuleDto: CreateRuleDto): Promise<RuleResponseDto> {
    const rule = await this.modelsService.userRules.create({
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
      }
    });

    return rule;
  }

  /**
   * Get all rules for a user
   */
  async findAllByUser(userId: number): Promise<RuleResponseDto[]> {
    const rules = await this.modelsService.userRules.findMany({
      where: { authorId: userId },
      select: {
        id: true,
        name: true,
        description: true,
        ruleBody: true,
        authorId: true,
      },
    });

    return rules;
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

    const updatedRule = await this.modelsService.userRules.update({
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
        authorId: true
      }
    });

    return updatedRule;
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

    await this.modelsService.userRules.delete({
      where: { id: ruleId }
    });
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
