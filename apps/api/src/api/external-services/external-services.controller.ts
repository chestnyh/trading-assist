import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiOkResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ExternalServicesService } from './external-services.service';
import { ExternalServiceResponseDto } from './dto/external-service-response.dto';

@ApiTags('external-services')
@Controller('external-services')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ExternalServicesController {
  constructor(private readonly externalServicesService: ExternalServicesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all external services' })
  @ApiOkResponse({
    description: 'List of external services',
    type: [ExternalServiceResponseDto]
  })
  async findAll() {
    return this.externalServicesService.findAll();
  }
}
