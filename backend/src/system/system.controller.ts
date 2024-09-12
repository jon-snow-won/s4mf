import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { SystemService } from './system.service';
import { SetActiveStructureDto } from './dto/set-active-structure.dto';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { TokenHeaderGuard } from 'auth/guard/token-header.guard';
import { CurrentUser } from 'common/decorators/current-user.decorator';
import { User } from 'users/entities/user.entity';
import { UserEmailDto } from './dto/add-super-user.dto';
import { RolesGuard } from 'common/guards/roles.guard';
import { SERVICE_ROLES } from 'common/constants/roles.contrant';
import { Roles } from 'common/decorators/roles.decorator';
import { System } from './entities/system.entity';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';

@Controller('system')
@ApiTags('system')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard, RolesGuard)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
@ApiNotFoundResponse({ type: DetailedNotFoundException })
export class SystemController {
  constructor(private readonly systemService: SystemService) {}

  @Get()
  @ApiOperation({ summary: 'Get system settings' })
  @ApiOkResponse({ type: System })
  getSystem() {
    return this.systemService.getSystem();
  }

  @Get('active-structure-id')
  @ApiOperation({ summary: 'Get active structure ID' })
  @ApiOkResponse({ type: Number })
  getActiveStructure() {
    return this.systemService.getActiveStructureID();
  }

  @Post('active-structure-id')
  @ApiOperation({ summary: 'Set active structure ID' })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  setActiveStructure(
    @CurrentUser() user: User,
    @Body() setActiveStructureDto: SetActiveStructureDto,
  ) {
    return this.systemService.setActiveStructureID(
      user,
      setActiveStructureDto.structureId,
    );
  }

  @Get('super-user-list')
  @ApiOperation({ summary: 'Get super user list' })
  @ApiOkResponse({ type: [String] })
  getSuperUserList() {
    return this.systemService.getSuperUserList();
  }

  @Post('super-user-list/:email')
  @ApiOperation({ summary: 'Add super user' })
  @Roles([SERVICE_ROLES.SUPERUSER])
  addSuperUser(@Param() user: UserEmailDto) {
    return this.systemService.addSuperUser(user.email);
  }

  @Delete('super-user-list/:email')
  @ApiOperation({ summary: 'Delete super user' })
  @Roles([SERVICE_ROLES.SUPERUSER])
  deleteSuperUser(@Param() params: UserEmailDto) {
    return this.systemService.deleteSuperUser(params.email);
  }

  @Get('admin-user-list')
  @ApiOperation({ summary: 'Get admin user list' })
  @ApiOkResponse({ type: [String] })
  getAdminUserList() {
    return this.systemService.getAdminUserList();
  }

  @Post('admin-user-list/:email')
  @ApiOperation({ summary: 'Add admin user' })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  addAdminUser(@Param() user: UserEmailDto) {
    return this.systemService.addAdminUser(user.email);
  }

  @Delete('admin-user-list/:email')
  @ApiOperation({ summary: 'Delete admin user' })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  deleteAdminUser(@Param() params: UserEmailDto) {
    return this.systemService.deleteAdminUser(params.email);
  }
}
