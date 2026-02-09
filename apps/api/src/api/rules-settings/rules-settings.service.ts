import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CreateUserRuleSettingDto } from './dto/create-user-rule-setting.dto';
import { UpdateUserRuleSettingDto } from './dto/update-user-rule-setting.dto';

@Injectable()
export class RulesSettingsService {
  constructor(private modelsService: ModelsService) {}

  /**
   * Creating a universal rule setting (Binance, Telegram, etc.)
   */
  async createSetting(userId: number, dto: CreateUserRuleSettingDto) {
    const created = await this.modelsService.userRuleSettings.create({
      data: {
        name: dto.name,
        code: dto.code,
        description: dto.description,
        configuration: dto.configuration,
        authorId: userId,
        externalServiceId: dto.externalServiceId,
        tags: {
          create: dto.tags?.map((tagName) => ({
            ruleSettingTag: {
              connectOrCreate: {
                where: { name_userId: { name: tagName, userId } },
                create: { name: tagName, userId },
              },
            },
          })),
        },
      },
      include: {
        externalService: true,
        tags: { include: { ruleSettingTag: true } },
      },
    });

    return this.mapToResponse(created);
  }

  /**
   * Getting all universal user settings with optional filtering and pagination
   */
  async findAllSettingsByUser(userId: number, externalServiceId?: number, page?: number, limit?: number) {
    const where: any = { authorId: userId };
    if (externalServiceId) {
      where.externalServiceId = externalServiceId;
    }
 
    const query: any = {
      where,
      include: {
        externalService: true,
        tags: { include: { ruleSettingTag: true } },
      },
      orderBy: { id: 'desc' },
    };
 
    if (page && limit) {
      query.skip = Math.max(0, (page - 1) * limit);
      query.take = limit;
    }
 
    const settings = await this.modelsService.userRuleSettings.findMany(query);
    return settings.map((s) => this.mapToResponse(s));
  }

  private mapToResponse(setting: any) {
    return {
      ...setting,
      tags: setting.tags?.map((t: any) => t.ruleSettingTag.name) || [],
    };
  }
 
  /**
   * Update setting
   */
  async updateSetting(id: number, userId: number, dto: UpdateUserRuleSettingDto) {
    const setting = await this.modelsService.userRuleSettings.findFirst({
      where: { id, authorId: userId },
    });

    if (!setting) throw new NotFoundException('Setting not found');

    const { tags, ...rest } = dto;
    const data: any = { ...rest };

    if (tags) {
      data.tags = {
        deleteMany: {},
        create: tags.map((tagName) => ({
          ruleSettingTag: {
            connectOrCreate: {
              where: { name_userId: { name: tagName, userId } },
              create: { name: tagName, userId },
            },
          },
        })),
      };
    }

    const updated = await this.modelsService.userRuleSettings.update({
      where: { id },
      data,
      include: {
        externalService: true,
        tags: { include: { ruleSettingTag: true } },
      },
    });

    return this.mapToResponse(updated);
  }

  /**
   * Remote setting
   */
  async removeSetting(id: number, userId: number) {
	const setting = await this.modelsService.userRuleSettings.findFirst({
	  where: { id, authorId: userId }
	});

	if (!setting) throw new NotFoundException('Setting not found');

	return this.modelsService.userRuleSettings.delete({ where: { id } });
  }
}
