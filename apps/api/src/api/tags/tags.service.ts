import { Injectable, NotFoundException } from '@nestjs/common';
import { ModelsService } from '@trading-bot/models';
import { CreateTagDto } from './dto/create-tag.dto';

@Injectable()
export class RuleSettingsTagsService {
  constructor(private modelsService: ModelsService) {}

  /**
   * Create a new tag
   */
  async createTag(userId: number, dto: CreateTagDto) {
    return this.modelsService.ruleSettingsTags.create({
      data: {
        name: dto.name,
        userId: userId,
      },
    });
  }

  /**
   * Get all user tags
   */
  async findAllTags(userId: number) {
    return this.modelsService.ruleSettingsTags.findMany({
      where: { userId: userId },
    });
  }

  /**
   * Remove tag
   */
  async removeTag(id: number, userId: number) {
    const tag = await this.modelsService.ruleSettingsTags.findFirst({
      where: { id, userId: userId }
    });
    if (!tag) throw new NotFoundException('Tag not found');

    return this.modelsService.ruleSettingsTags.delete({ where: { id } });
  }
}
