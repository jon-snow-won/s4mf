import { Filter } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { HelperService } from '../helpers/helpers.utils';
import { PUBLIC_ROLE } from '../constants/roles.contrant';

interface FilterArguments {
  user: User;
}

export const WITH_USER_FILTER_NAME = 'withUser';

export const WithUser = (): ClassDecorator => {
  return Filter({
    name: WITH_USER_FILTER_NAME,
    cond: ({ user }: FilterArguments) => {
      if (!user) {
        throw new Error('User parameter is required for WithUser filter');
      }
      if (!user.hasRolesOverride && (user.isSuperuser || user.isAdmin)) {
        return {};
      }
      return {
        roles: {
          name: {
            $in: [PUBLIC_ROLE.name, ...HelperService.getUserRoles(user)],
          },
        },
      };
    },
    default: true,
  });
};
