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
	return this.modelsService.userRuleSettings.create({
	  data: {
		name: dto.name,
		code: dto.code,
		description: dto.description,
		configuration: dto.configuration,
		authorId: userId,
		externalServiceId: dto.externalServiceId,
	  },
	});
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
      },
      orderBy: { id: 'desc' },
    };

    if (page && limit) {
      query.skip = Math.max(0, (page - 1) * limit);
      query.take = limit;
    }

    return this.modelsService.userRuleSettings.findMany(query);
  }

  /**
   * Update setting
   */
  async updateSetting(id: number, userId: number, dto: UpdateUserRuleSettingDto) {
	const setting = await this.modelsService.userRuleSettings.findFirst({
	  where: { id, authorId: userId }
	});

	if (!setting) throw new NotFoundException('Setting not found');

	return this.modelsService.userRuleSettings.update({
	  where: { id },
	  data: dto,
	});
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
