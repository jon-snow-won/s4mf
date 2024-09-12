import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { SettingsService } from './settings.service';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
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
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { User } from '../users/entities/user.entity';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import {
  FilterOptionsDto,
  OrderOptionsDto,
  PaginateOptionsDto,
  PopulateOptionsDto,
} from '../common/dtos/page-options.dto';
import { PartialSetting, Setting } from './entities/settings.entity';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { CommonUpdateQueryFieldsDto } from '../common/dtos/common-update-query-fields.dto';
import { CommonDeleteQueryFieldsDto } from '../common/dtos/common-delete-query-fields.dto';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { RolesGuard } from '../common/guards/roles.guard';
import { SERVICE_ROLES } from '../common/constants/roles.contrant';
import { Roles } from '../common/decorators/roles.decorator';
import {
  ObjectDiffDto,
  RevisionsDiffResponse,
  ObjectDiffSummary,
} from '../common/dtos/object-diff.dto';
import { EntityDiffFieldsDto } from '../common/dtos/entity-diff-fields.dto';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('settings')
@ApiTags('settings')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiExtraModels(PartialSetting, ObjectDiffDto)
@UseGuards(RolesGuard)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Post()
  @ApiOperation({ summary: 'Create setting' })
  @ApiOkResponse({
    type: PartialSetting,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  /**
   * Create a setting with the provided data.
   *
   * @param {@Req() request: RequestWithUser} request - The request object with user information.
   * @param {@Body() createSettingDto: CreateSettingDto} createSettingDto - The data to create the setting.
   * @param {@CurrentUser() user: User} user - The current user creating the setting.
   * @return {Promise<Setting>} The newly created setting.
   */
  create(
    @CurrentUser() user: User,
    @Req() request: RequestWithUser,
    @Body() createSettingDto: CreateSettingDto,
  ): Promise<Setting> {
    return this.settingsService.create(user, createSettingDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all settings' })
  @ApiPaginatedResponse(PartialSetting)
  findAll(
    @CurrentUser() user: User,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.settingsService.findAll(user, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one setting' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialSetting,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.settingsService.findOne(user, { id: +id }, commonQueryDto);
  }

  @Get(':id/revisions')
  @ApiOperation({ summary: 'Get all setting revisions' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
    type: DetailedNotFoundException,
  })
  @ApiPaginatedResponse(PartialSetting)
  findRevisions(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.settingsService.findRevisions(user, +id, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id/revisions/:revision')
  @ApiOperation({ summary: 'Get one setting revision' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialSetting,
  })
  getRevision(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Param('revision') revision: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.settingsService.getRevision(
      user,
      +id,
      +revision,
      commonQueryDto,
    );
  }

  @Get(':fromID/diff/:toID')
  @ApiOperation({ summary: 'Get setting diff between two entities' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
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
    return this.settingsService.getEntitiesDiff(
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
    return this.settingsService.getEntityRevisionsDiff(
      user,
      +id,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update setting' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialSetting,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateSettingDto: UpdateSettingDto,
    @Query() commonUpdateQueryFieldsDto: CommonUpdateQueryFieldsDto,
  ) {
    if (commonUpdateQueryFieldsDto.toReplace) {
      return this.settingsService.update(user, +id, updateSettingDto);
    } else {
      return this.settingsService.updateRevision(user, +id, updateSettingDto);
    }
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete setting' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialSetting,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonDeleteQueryFieldsDto: CommonDeleteQueryFieldsDto,
  ) {
    if (commonDeleteQueryFieldsDto.isHardDelete) {
      return this.settingsService.remove(user, +id);
    } else {
      return this.settingsService.softRemove(user, +id);
    }
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore setting' })
  @ApiNotFoundResponse({
    description: 'Setting not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialSetting,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  restore(@CurrentUser() user: User, @Param('id') id: string) {
    return this.settingsService.restore(user, +id);
  }
}
