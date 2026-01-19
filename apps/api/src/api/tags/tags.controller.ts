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
  ApiBearerAuth,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RuleSettingsTagsService} from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';

@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RulesSettingsTagsController {
  constructor(private readonly rulesSettingsService: RuleSettingsTagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag for rule settings' })
  async createTag(@Request() req, @Body() dto: CreateTagDto) {
    return this.rulesSettingsService.createTag(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user tags' })
  async findAllTags(@Request() req) {
    return this.rulesSettingsService.findAllTags(req.user.id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  async removeTag(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.rulesSettingsService.removeTag(id, req.user.id);
  }
}