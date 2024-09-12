import { Controller, Get } from '@nestjs/common';
import { TypesService } from './types.service';
import { ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { ServiceType } from '../services/entities/service-type.entity';
import { SwaggerResponse } from '../common/decorators/swagger-api.decorator';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('types')
@ApiTags('types')
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class TypesController {
  constructor(private readonly typesService: TypesService) {}
  @Get('/serviceTypes')
  @SwaggerResponse({
    operation: 'Get all service types',
    response: ServiceType,
    responseIsArray: true,
  })
  getServiceTypes(): Promise<ServiceType[]> {
    return this.typesService.getServiceTypes();
  }
}
