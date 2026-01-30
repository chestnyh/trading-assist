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
   * Getting all universal user settings
   */
  async findAllSettingsByUser(userId: number) {
	return this.modelsService.userRuleSettings.findMany({
	  where: { authorId: userId },
	  include: {
		externalService: true,
	  },
	});
  }

  /**
   * Get user settings filtered by external service with pagination
   */
  async findSettingsByService(userId: number, externalServiceId: number, page = 1, limit = 20) {
    const skip = Math.max(0, (page - 1) * limit);
    return this.modelsService.userRuleSettings.findMany({
      where: {
        authorId: userId,
        externalServiceId,
      },
      include: {
        externalService: true,
      },
      skip,
      take: limit,
      orderBy: { id: 'desc' },
    });
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
