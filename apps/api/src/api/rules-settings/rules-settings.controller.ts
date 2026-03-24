import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiQuery
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RulesSettingsService } from './rules-settings.service';
import { CreateUserRuleSettingDto } from './dto/create-user-rule-setting.dto';
import { UpdateUserRuleSettingDto } from './dto/update-user-rule-setting.dto';
import { RuleSettingResponseDto } from './dto/rule-setting-response.dto';

@ApiTags('rules-settings')
@Controller('rules-settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RulesSettingsController {
  constructor(private readonly rulesSettingsService: RulesSettingsService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new universal rule setting' })
  @ApiCreatedResponse({
    description: 'Setting created successfully',
    type: RuleSettingResponseDto
  })
  async createSetting(@Request() req, @Body() dto: CreateUserRuleSettingDto) {
    return this.rulesSettingsService.createSetting(req.user.id, dto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all universal rule settings for user' })
  @ApiQuery({ name: 'externalServiceId', required: false, type: Number, description: 'Filter by External Service ID' })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiOkResponse({
    description: 'List of rule settings',
    type: [RuleSettingResponseDto]
  })
  async findAllSettings(
    @Request() req,
    @Query('externalServiceId') externalServiceId?: number,
    @Query('page') page?: number,
    @Query('limit') limit?: number
  ) {
    const serviceId = externalServiceId ? +externalServiceId : undefined;
    const pageNum = page ? +page : undefined;
    const limitNum = limit ? +limit : undefined;
    return this.rulesSettingsService.findAllSettingsByUser(req.user.id, serviceId, pageNum, limitNum);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule setting' })
  @ApiOkResponse({
    description: 'Setting updated successfully',
    type: RuleSettingResponseDto
  })
  async updateSetting(
    @Request() req,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateUserRuleSettingDto
  ) {
    return this.rulesSettingsService.updateSetting(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule setting' })
  @ApiOkResponse({ description: 'Setting deleted successfully' })
  async removeSetting(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.rulesSettingsService.removeSetting(id, req.user.id);
  }

  @Get('telegram-chat-id/:id')
  @ApiOperation({ summary: 'Get Telegram chat ID for a rule setting' })
  @ApiParam({ name: 'id', type: Number, description: 'Rule setting ID' })
  @ApiOkResponse({ description: 'Telegram chat ID', type: String })
  async getTelegramChatId(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.rulesSettingsService.getTelegramChatId(id, req.user.id);
  }
}
