import { Reflector } from '@nestjs/core';
import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Roles } from 'common/decorators/roles.decorator';
import { SERVICE_ROLES } from 'common/constants/roles.contrant';
import { HelperService } from 'common/helpers/helpers.utils';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(Roles, context.getHandler());
    if (!requiredRoles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const { user } = request;

    const hasSuperuserRole = user.isSuperuser;
    const hasAdminRole = user.isAdmin;
    const userRoles = HelperService.getUserRoles(user);

    const hasRequiredRole =
      (requiredRoles.includes(SERVICE_ROLES.SUPERUSER) && hasSuperuserRole) ||
      (requiredRoles.includes(SERVICE_ROLES.ADMIN) &&
        (hasAdminRole || hasSuperuserRole)) ||
      HelperService.areArraysIntersect(requiredRoles, userRoles);

    if (hasRequiredRole) {
      return true;
    }

    const errorMessage = `To use this endpoint, User must have one of the following roles: ${requiredRoles.join(', ')}.`;
    throw new ForbiddenException(errorMessage);
  }
}
