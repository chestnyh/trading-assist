import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Request,
  ParseIntPipe,
  Query,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RuleSettingsTagsService } from './tags.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { TagResponseDto } from './dto/tag-response.dto';

@ApiTags('tags')
@Controller('tags')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RulesSettingsTagsController {
  constructor(private readonly rulesSettingsService: RuleSettingsTagsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new tag for rule settings' })
  @ApiCreatedResponse({
    description: 'The tag has been successfully created.',
    type: TagResponseDto,
  })
  async createTag(@Request() req, @Body() dto: CreateTagDto) {
    return this.rulesSettingsService.createTag(req.user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all user tags' })
  @ApiOkResponse({
    description: 'Return all tags for the current user.',
    type: [TagResponseDto],
  })
  async findAllTags(
    @Request() req,
    @Query('search') search?: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit?: number,
  ) {
    return this.rulesSettingsService.findAllTags(req.user.id, { search, limit });
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a tag' })
  @ApiOkResponse({
    description: 'The tag has been successfully deleted.',
    type: TagResponseDto
  })
  async removeTag(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.rulesSettingsService.removeTag(id, req.user.id);
  }
}