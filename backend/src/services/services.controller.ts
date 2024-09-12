import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import {
  FilterOptionsDto,
  OrderOptionsDto,
  PaginateOptionsDto,
  PopulateOptionsDto,
} from '../common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { PartialService } from './entities/service.entity';
import { CommonUpdateQueryFieldsDto } from '../common/dtos/common-update-query-fields.dto';
import { CommonDeleteQueryFieldsDto } from '../common/dtos/common-delete-query-fields.dto';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { ConflictResourceException } from '../common/exceptions/conflict-resource.exception';
import { RolesGuard } from '../common/guards/roles.guard';
import { SERVICE_ROLES } from '../common/constants/roles.contrant';
import { Roles } from '../common/decorators/roles.decorator';
import {
  RevisionsDiffResponse,
  ObjectDiffSummary,
} from '../common/dtos/object-diff.dto';
import { EntityDiffFieldsDto } from '../common/dtos/entity-diff-fields.dto';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('services')
@ApiTags('services')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiExtraModels(PartialService)
@UseGuards(RolesGuard)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  /**
   * A description of the entire function.
   *
   * @param {CurrentUser} user - description of parameter
   * @param {CreateServiceDto} createServiceDto - description of parameter
   *
   */
  @Post()
  @ApiOperation({ summary: 'Create service' })
  @ApiOkResponse({
    type: PartialService,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  create(
    @CurrentUser() user: User,
    @Body() createServiceDto: CreateServiceDto,
  ) {
    return this.servicesService.create(user, createServiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all services' })
  @ApiPaginatedResponse(PartialService)
  findAll(
    @CurrentUser() user: User,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.servicesService.findAll(user, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one service' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialService,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.servicesService.findOne(user, { id: +id }, commonQueryDto);
  }

  @Get(':id/revisions')
  @ApiOperation({ summary: 'Get all service revisions' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiPaginatedResponse(PartialService)
  findRevisions(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.servicesService.findRevisions(user, +id, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id/revisions/:revision')
  @ApiOperation({ summary: 'Get one service revision' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialService,
  })
  getRevision(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('revision') revision: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.servicesService.getRevision(
      user,
      +id,
      +revision,
      commonQueryDto,
    );
  }

  @Get(':fromID/diff/:toID')
  @ApiOperation({ summary: 'Get service diff between two entities' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: ObjectDiffSummary,
  })
  getEntitiesDiff(
    @CurrentUser() user: User,
    @Param('fromID') fromID: string,
    @Param('toID') toID: string,
    @Query() entityDiffFieldsDto: EntityDiffFieldsDto,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.servicesService.getEntitiesDiff(
      user,
      +fromID,
      +toID,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  @Get(':id/revisionsDiff')
  @ApiOperation({ summary: 'Get diff between all service revisions' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: RevisionsDiffResponse,
  })
  getEntityRevisionsDiff(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() entityDiffFieldsDto: EntityDiffFieldsDto,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.servicesService.getEntityRevisionsDiff(
      user,
      +id,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update service' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiConflictResponse({
    description: 'Service descendants list contain itself',
    type: ConflictResourceException,
  })
  @ApiOkResponse({
    type: PartialService,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @Query() commonUpdateQueryFieldsDto: CommonUpdateQueryFieldsDto,
  ) {
    if (commonUpdateQueryFieldsDto.toReplace) {
      return this.servicesService.update(user, +id, updateServiceDto);
    } else {
      return this.servicesService.updateRevision(user, +id, updateServiceDto);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete service' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialService,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonDeleteQueryFieldsDto: CommonDeleteQueryFieldsDto,
  ) {
    if (commonDeleteQueryFieldsDto.isHardDelete) {
      return this.servicesService.remove(user, +id);
    } else {
      return this.servicesService.softRemove(user, +id);
    }
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore service' })
  @ApiNotFoundResponse({
    description: 'Service not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialService,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  restore(@CurrentUser() user: User, @Param('id') id: string) {
    return this.servicesService.restore(user, +id);
  }
}
