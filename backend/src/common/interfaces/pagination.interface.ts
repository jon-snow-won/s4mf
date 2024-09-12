import { QueryOrder } from '../types/enums/misc.enum';

export type Order = '$gt' | '$lt';
export type OppositeOrder = `${Order}e`;

export interface PaginationAbstractResponse<T, Y> {
  data: T[];
  meta: Y;
}

export interface PaginateOptions<T> {
  instances: T[];
  currentCount: number;
  previousCount: number;
  cursor: keyof T;
  first: number;
  search?: string;
}

export function getQueryOrder(order: QueryOrder): Order {
  return order === QueryOrder.ASC ? '$gt' : '$lt';
}

export function getOppositeOrder(order: QueryOrder): OppositeOrder {
  return order === QueryOrder.ASC ? '$lte' : '$gte';
}
