import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { NextFunction, Response } from 'express';
import { TokenFields } from '../common/interfaces/token-fields.interface';
import { jwtDecode } from 'jwt-decode';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { HelperService } from '../common/helpers/helpers.utils';
import { ConfigService } from '@nestjs/config';
import { addComputeFieldsToUser } from '../common/helpers/add-compute-fields-to-user.utils';
import { SystemService } from '../system/system.service';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UsersService,
    private readonly configService: ConfigService,
    private readonly systemService: SystemService,
  ) {}

  private readonly logger: Logger = new Logger(AuthMiddleware.name);

  async use(req: RequestWithUser, res: Response, next: NextFunction) {
    const authorization = req.get('authorization');
    const coreAuthorization = req.get('core-authorization');
    const authHeader = coreAuthorization || authorization;

    if (!authHeader) {
      throw new DetailedForbiddenException([
        {
          details: 'No user token in headers',
        },
      ]);
    }

    let parsedToken: TokenFields;

    try {
      parsedToken = jwtDecode(authHeader);
    } catch (e) {
      throw new DetailedForbiddenException([{ details: e.message }]);
    }

    const email = parsedToken.email;
    if (!email) {
      throw new DetailedForbiddenException([
        {
          details: `No email for user [${parsedToken.preferred_username}] in parsed token from headers`,
        },
      ]);
    }
    const user = await this.userService.getByEmail(email);

    if (!user) {
      this.logger.debug(`AuthMiddleware.use: creating new user: ${email}`);
      req.user = await this.userService.create({
        email,
        name: parsedToken.name,
        roles: parsedToken.roles ?? [],
        rolesOverride: [],
      });
    } else {
      this.logger.debug(`AuthMiddleware.use: user ${user.email} exists`);

      if (!user.roles) {
        this.logger.debug(
          `AuthMiddleware.use: setting initial user ${user.email} roles`,
        );
        await this.userService.update(user, {
          roles: [],
        });
      }

      if (!user.rolesOverride) {
        this.logger.debug(
          `AuthMiddleware.use: setting initial user ${user.email} rolesOverride`,
        );
        await this.userService.update(user, {
          rolesOverride: [],
        });
      }

      const FIVE_MINUTES_IN_SECONDS = 300;
      const userDataLifespanInSeconds =
        this.configService.get<number>('USER_DATA_LIFESPAN_IN_SECONDS') ||
        FIVE_MINUTES_IN_SECONDS;
      const userDataAgeInSeconds =
        (HelperService.getTimeInUtc(new Date()).getTime() -
          (
            user.updatedAt || HelperService.getTimeInUtc(new Date())
          ).getTime()) /
        1000;

      if (userDataAgeInSeconds > userDataLifespanInSeconds) {
        this.logger.debug(
          `AuthMiddleware.use: user ${user.email} data expired. Updating...`,
        );

        const existingRolesArray = user.roles || [];
        const updatedRolesArray = parsedToken.roles || [];
        if (
          !HelperService.areArraysEquivalent(
            updatedRolesArray,
            existingRolesArray,
          )
        ) {
          await this.userService.update(user, {
            roles: updatedRolesArray,
          });
        } else {
          await this.userService.update(user, {
            updatedAt: HelperService.getTimeInUtc(new Date()),
          });
        }
      }

      req.user = user;
    }

    req.user = await addComputeFieldsToUser(req.user, this.systemService);

    next();
  }
}
