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
  ParseIntPipe
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserRuleSettingDto } from './dto/create-user-rule-setting.dto';
import { UpdateUserRuleSettingDto } from './dto/update-user-rule-setting.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RulesSettingsService } from './rules-settings.service';

@ApiTags('rules-settings')
@Controller('rules-settings')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RulesSettingsController {
  constructor(private readonly rulesSettingsService: RulesSettingsService) {}

  @Post('')
  @ApiOperation({ summary: 'Create a new universal rule setting (Binance, Telegram, etc.)' })
  @ApiBody({ type: CreateUserRuleSettingDto })
  @ApiResponse({
	status: 201,
	description: 'Setting created successfully'
  })
  async createSetting(
	@Request() req,
	@Body() dto: CreateUserRuleSettingDto
  ) {
	return this.rulesSettingsService.createSetting(req.user.id, dto);
  }

  @Get('')
  @ApiOperation({ summary: 'Get all universal rule settings for user' })
  async findAllSettings(@Request() req) {
	return this.rulesSettingsService.findAllSettingsByUser(req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule setting' })
  async updateSetting(
	@Request() req,
	@Param('id', ParseIntPipe) id: number,
	@Body() dto: UpdateUserRuleSettingDto
  ) {
	return this.rulesSettingsService.updateSetting(id, req.user.id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule setting' })
  async removeSetting(@Request() req, @Param('id', ParseIntPipe) id: number) {
	return this.rulesSettingsService.removeSetting(id, req.user.id);
  }
}