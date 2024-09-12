import { Filter } from '@mikro-orm/core';

export const SOFT_DELETE_FILTER_NAME = 'softDelete';

export const WithSoftDelete = (): ClassDecorator => {
  return Filter({
    name: SOFT_DELETE_FILTER_NAME,
    cond: {
      deletedAt: null,
    },
    default: true,
  });
};
