import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { jwtDecode } from 'jwt-decode';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequestHeadersWithTokenDto } from './dto/request-headers-with-token.dto';
import { HeadersWithToken } from '../common/interfaces/headers-with-token.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UsersService } from '../users/users.service';
import { User } from '../users/entities/user.entity';
import { KubeConfigDto } from '../kube/dto/kube-config.dto';
import { UpdateUserDto } from '../users/dto/update-user.dto';
import { SetKubeConfigDto } from '../kube/dto/set-kube-config.dto';
import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { SERVICE_ROLES } from 'common/constants/roles.contrant';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { RolesDto } from './dto/roles.dto';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';

@Controller('auth')
@ApiTags('auth')
@ApiExtraModels(RequestHeadersWithTokenDto)
@UseGuards(RolesGuard)
@ApiNotFoundResponse({ type: DetailedNotFoundException })
export class AuthController {
  constructor(private readonly userService: UsersService) {}
  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get info about headers and auth token' })
  @ApiOkResponse({
    type: RequestHeadersWithTokenDto,
  })
  getHeaders(
    @Headers() headers: HeadersWithToken,
    @Request() request: RequestWithUser,
  ): RequestHeadersWithTokenDto {
    const token = headers['core-authorization'] || headers.authorization;
    let tokenInfo = 'No token info';

    if (token) {
      try {
        tokenInfo = jwtDecode(token);
      } catch (e) {
        tokenInfo = e.message;
      }
    }

    return { headers, tokenInfo, user: request.user };
  }

  @Get('me/kube')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get info about current user kube config' })
  @ApiOkResponse({
    type: KubeConfigDto,
  })
  async getKubeConfig(@CurrentUser() user: User) {
    return await this.userService.getKubeConfig(user);
  }

  @Post('me/kube')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Set current user kube config in base64 string',
  })
  async setKubeConfig(
    @CurrentUser() user: User,
    @Body() setKubeConfigDto: SetKubeConfigDto,
  ) {
    return await this.userService.setKubeConfig(user, setKubeConfigDto);
  }

  @Delete('me/kube')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete current user kube config' })
  async deleteKubeConfig(@CurrentUser() user: User) {
    return await this.userService.deleteKubeConfig(user);
  }

  @Get('user/data/:email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user data' })
  @ApiOkResponse({ type: User })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  async getUserData(@CurrentUser() user: User, @Param('email') email: string) {
    return await this.userService.getUserData(email);
  }

  @Patch('user/data/:email')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set user data' })
  @Roles([SERVICE_ROLES.SUPERUSER])
  async setUserData(
    @CurrentUser() user: User,
    @Param('email') email: string,
    @Body() userData: UpdateUserDto,
  ) {
    return await this.userService.setUserData(email, userData);
  }

  @Post('user/data/:email/roles-override')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Set user roles override' })
  @Roles([SERVICE_ROLES.SUPERUSER])
  async setRoleOverrides(
    @Param('email') email: string,
    @Query() rolesDto: RolesDto,
  ) {
    return await this.userService.setRolesOverride(email, rolesDto.roles);
  }

  @Delete('user/data/:email/roles-override')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Reset user roles override' })
  @Roles([SERVICE_ROLES.SUPERUSER])
  async resetRoleOverrides(@Param('email') email: string) {
    return await this.userService.resetRolesOverride(email);
  }
}
