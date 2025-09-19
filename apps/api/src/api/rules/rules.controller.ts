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
  ApiParam
} from '@nestjs/swagger';
import { RulesService } from './rules.service';
import { CreateRuleDto } from './dto/create-rule.dto';
import { UpdateRuleDto } from './dto/update-rule.dto';
import { RuleResponseDto } from './dto/rule-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('rules')
@Controller('rules')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class RulesController {
  constructor(private readonly rulesService: RulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new trading rule' })
  @ApiBody({ type: CreateRuleDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Rule created successfully',
    type: RuleResponseDto
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async create(@Request() req, @Body() createRuleDto: CreateRuleDto): Promise<RuleResponseDto> {
    return this.rulesService.create(req.user.id, createRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all rules for the authenticated user' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rules retrieved successfully',
    type: [RuleResponseDto]
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async findAll(@Request() req): Promise<RuleResponseDto[]> {
    // TODO: Add pagination
    // TODO: Add possibility for admin to get all rules
    return this.rulesService.findAllByUser(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific rule by ID' })
  @ApiParam({ name: 'id', description: 'Rule ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rule retrieved successfully',
    type: RuleResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rule not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async findOne(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<RuleResponseDto> {
    // TODO: Add possibility for admin to get any rule
    return this.rulesService.findOne(id, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a rule' })
  @ApiParam({ name: 'id', description: 'Rule ID', type: 'number' })
  @ApiBody({ type: UpdateRuleDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Rule updated successfully',
    type: RuleResponseDto
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rule not found' 
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid input data' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async update(
    @Request() req, 
    @Param('id', ParseIntPipe) id: number, 
    @Body() updateRuleDto: UpdateRuleDto
  ): Promise<RuleResponseDto> {
    // TODO: Add possibility for admin to update any rule
    return this.rulesService.update(id, req.user.id, updateRuleDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a rule' })
  @ApiParam({ name: 'id', description: 'Rule ID', type: 'number' })
  @ApiResponse({ 
    status: 200, 
    description: 'Rule deleted successfully' 
  })
  @ApiResponse({ 
    status: 404, 
    description: 'Rule not found' 
  })
  @ApiResponse({ 
    status: 401, 
    description: 'Unauthorized' 
  })
  async remove(@Request() req, @Param('id', ParseIntPipe) id: number): Promise<{ message: string }> {
    // TODO: Add possibility for admin to remove any rule
    await this.rulesService.remove(id, req.user.id);
    return { message: 'Rule deleted successfully' };
  }
}
