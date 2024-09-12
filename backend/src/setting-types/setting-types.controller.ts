import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { SettingTypesService } from './setting-types.service';
import { CreateSettingTypeDto } from './dto/create-setting-type.dto';
import { UpdateSettingTypeDto } from './dto/update-setting-type.dto';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { User } from 'users/entities/user.entity';
import {
  FilterOptionsDto,
  OrderOptionsDto,
  PaginateOptionsDto,
  PopulateOptionsDto,
} from 'common/dtos/page-options.dto';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenHeaderGuard } from 'auth/guard/token-header.guard';
import { DetailedBadRequestException } from 'common/exceptions/detailed-bad-request.exception';
import { CommonQueryFieldsDto } from 'common/dtos/common-query-fields.dto';
import { ApiPaginatedResponse } from 'common/decorators/api-paginated-response.decorator';
import { PartialSettingType } from './entities/setting-type.entity';
import { CommonDeleteQueryFieldsDto } from 'common/dtos/common-delete-query-fields.dto';
import { DetailedNotFoundException } from 'common/exceptions/detailed-not-found.exception';
import { RolesGuard } from '../common/guards/roles.guard';
import { SERVICE_ROLES } from '../common/constants/roles.contrant';
import { Roles } from '../common/decorators/roles.decorator';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('setting-types')
@ApiTags('setting-types')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class SettingTypesController {
  constructor(private readonly settingTypesService: SettingTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create setting type' })
  @ApiOkResponse({ type: PartialSettingType })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  create(
    @CurrentUser() user: User,
    @Body() createSettingTypeDto: CreateSettingTypeDto,
  ) {
    return this.settingTypesService.create(user, createSettingTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all setting types' })
  @ApiPaginatedResponse(PartialSettingType)
  findAll(
    @CurrentUser() user: User,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.settingTypesService.findAll(user, {
      paginateOptions,
      populateOptions,
      filterOptions,
      orderOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get setting type by id' })
  @ApiNotFoundResponse({
    description: 'Setting type not found',
    type: DetailedBadRequestException,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.settingTypesService.findOne(user, { id: +id }, commonQueryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update setting type' })
  @ApiNotFoundResponse({
    description: 'Setting type not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({ type: PartialSettingType })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  update(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateSettingTypeDto: UpdateSettingTypeDto,
  ) {
    return this.settingTypesService.update(user, +id, updateSettingTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete setting type' })
  @ApiNotFoundResponse({
    description: 'Setting type not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({ type: PartialSettingType })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  remove(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonDeleteQueryFieldsDto: CommonDeleteQueryFieldsDto,
  ) {
    if (commonDeleteQueryFieldsDto.isHardDelete) {
      return this.settingTypesService.remove(user, +id);
    } else {
      return this.settingTypesService.softRemove(user, +id);
    }
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore setting type' })
  @ApiNotFoundResponse({
    description: 'Setting type not found',
    type: DetailedNotFoundException,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  restore(@CurrentUser() user: User, @Param('id') id: string) {
    return this.settingTypesService.restore(user, +id);
  }
}
