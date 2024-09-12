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
import { StructuresService } from './structures.service';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { PartialStructure } from './entities/structures.entity';
import {
  FilterOptionsDto,
  OrderOptionsDto,
  PaginateOptionsDto,
  PopulateOptionsDto,
} from '../common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { CommonUpdateQueryFieldsDto } from '../common/dtos/common-update-query-fields.dto';
import { CommonDeleteQueryFieldsDto } from '../common/dtos/common-delete-query-fields.dto';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { ActiveStructureDto } from './dto/active-structure.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { SERVICE_ROLES } from '../common/constants/roles.contrant';
import { Roles } from '../common/decorators/roles.decorator';
import {
  RevisionsDiffResponse,
  ObjectDiffSummary,
} from '../common/dtos/object-diff.dto';
import { EntityDiffFieldsDto } from '../common/dtos/entity-diff-fields.dto';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('structures')
@ApiTags('structures')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiExtraModels(PartialStructure)
@UseGuards(RolesGuard)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class StructuresController {
  constructor(private readonly structuresService: StructuresService) {}

  @Post()
  @ApiOperation({ summary: 'Create structure' })
  @ApiOkResponse({
    type: PartialStructure,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  create(
    @CurrentUser() user: User,
    @Body() createManifestDto: CreateStructureDto,
  ) {
    return this.structuresService.create(user, createManifestDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all structures' })
  @ApiPaginatedResponse(PartialStructure)
  findAll(
    @CurrentUser() user: User,
    @Query() activeStructureDto: ActiveStructureDto,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.structuresService.findAll(user, activeStructureDto.onlyActive, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single structure' })
  @ApiNotFoundResponse({
    description: 'Structure not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialStructure,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.structuresService.findOne(user, { id: +id }, commonQueryDto);
  }

  @Get(':id/revisions')
  @ApiOperation({ summary: 'Get all structure revisions' })
  @ApiPaginatedResponse(PartialStructure)
  @ApiNotFoundResponse({
    description: 'Structure not found',
    type: DetailedNotFoundException,
  })
  findRevisions(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.structuresService.findRevisions(user, +id, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id/revisions/:revision')
  @ApiOperation({ summary: 'Get one structure revision' })
  @ApiNotFoundResponse({
    description: 'Structure not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialStructure,
  })
  getRevision(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('revision') revision: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.structuresService.getRevision(
      user,
      +id,
      +revision,
      commonQueryDto,
    );
  }

  @Get(':fromID/diff/:toID')
  @ApiOperation({ summary: 'Get structure diff between two revisions' })
  @ApiNotFoundResponse({
    description: 'Structure not found',
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
    return this.structuresService.getEntitiesDiff(
      user,
      +fromID,
      +toID,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  @Get(':id/revisionsDiff')
  @ApiOperation({ summary: 'Get diff between all setting revisions' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
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
    return this.structuresService.getEntityRevisionsDiff(
      user,
      +id,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update structure' })
  @ApiNotFoundResponse({
    description: 'Structure not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialStructure,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateManifestDto: UpdateStructureDto,
    @Query() commonUpdateQueryFieldsDto: CommonUpdateQueryFieldsDto,
  ) {
    if (commonUpdateQueryFieldsDto.toReplace) {
      return this.structuresService.update(user, +id, updateManifestDto);
    } else {
      return this.structuresService.updateRevision(
        user,
        +id,
        updateManifestDto,
      );
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete structure' })
  @ApiNotFoundResponse({
    description: 'Structure not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialStructure,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonDeleteQueryFieldsDto: CommonDeleteQueryFieldsDto,
  ) {
    if (commonDeleteQueryFieldsDto.isHardDelete) {
      return this.structuresService.remove(user, +id);
    } else {
      return this.structuresService.softRemove(user, +id);
    }
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore structure' })
  @ApiNotFoundResponse({
    description: 'Structure not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialStructure,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  restore(@CurrentUser() user: User, @Param('id') id: string) {
    return this.structuresService.restore(user, +id);
  }
}
