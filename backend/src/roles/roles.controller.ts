import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RolesService } from './roles.service';
import { SwaggerResponse } from '../common/decorators/swagger-api.decorator';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { UpdateRoleDto } from './dto/udpate-role.dto';
import { RolesGuard } from '../common/guards/roles.guard';
import { SERVICE_ROLES } from '../common/constants/roles.contrant';
import { Roles } from '../common/decorators/roles.decorator';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('roles')
@ApiTags('roles')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard, RolesGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @SwaggerResponse({
    operation: 'Get all roles',
    response: Role,
    responseIsArray: true,
  })
  getRoles(): Promise<Role[]> {
    return this.rolesService.findAll();
  }

  @Post()
  @SwaggerResponse({
    operation: 'Create new role',
    response: Role,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  createRole(@Body() createRoleDto: CreateRoleDto): Promise<Role> {
    return this.rolesService.create(createRoleDto);
  }

  @Patch(':id')
  @SwaggerResponse({
    operation: 'Update role',
    response: Role,
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  updateRole(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ) {
    return this.rolesService.updateRole(user, +id, updateRoleDto);
  }

  @Delete(':id')
  @SwaggerResponse({
    operation: 'Delete role',
  })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  deleteRole(@CurrentUser() user: User, @Param('id') id: string) {
    return this.rolesService.deleteRole(user, +id);
  }
}
