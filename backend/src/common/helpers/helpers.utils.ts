import { format, zonedTimeToUtc } from 'date-fns-tz';
import process from 'node:process';
import { randomUUID } from 'node:crypto';
import { PageDto } from '../dtos/page.dto';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { PageMetaDto } from '../dtos/page-meta.dto';
import { Order } from '../constants/order.constant';
import { User } from '../../users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';
import { compareBy, CompareKey } from 'compare-by';
import { DetailedBadRequestException } from '../exceptions/detailed-bad-request.exception';
import { Collection } from '@mikro-orm/core';

export const HelperService = {
  /**
   * Checks if the current environment is in development mode.
   *
   * @return {boolean} Returns true if the environment is in development mode, false otherwise.
   */
  isDev(): boolean {
    return process.env.NODE_ENV?.startsWith('dev') || false;
  },
  isProd(): boolean {
    return process.env.NODE_ENV?.startsWith('prod') || false;
  },
  getTimeInUtc(date: Date | string): Date {
    const newDate = date instanceof Date ? date : new Date(date);
    const currentUtcTime = zonedTimeToUtc(newDate, 'UTC');

    return new Date(format(currentUtcTime, 'yyyy-MM-dd HH:mm:ss'));
  },
  /**
   * Returns an object with initial entity fields.
   *
   * @return {Object} An object with the following properties:
   *   - idx: a randomly generated UUID
   *   - revision: an integer representing the revision number (0)
   *   - isActive: a boolean indicating whether the entity is active (false)
   *   - isDeleted: a boolean indicating whether the entity is deleted (false)
   *   - deletedAt: a null value indicating the deletion date
   *   - createdAt: a Date object representing the creation date in UTC
   *   - updatedAt: a Date object representing the last update date in UTC
   */
  getInitialEntityFields() {
    return {
      idx: randomUUID(),
      revision: 0,
      isActive: false,
      isDeleted: false,
      deletedAt: null,
      createdAt: HelperService.getTimeInUtc(new Date()),
      updatedAt: HelperService.getTimeInUtc(new Date()),
    };
  },
  get(data: { [key: string]: any }, path: string) {
    if (path === '') {
      return data;
    }
    return path.split('.').reduce((o, i) => o?.[i], data);
  },
  set(data: any, path: string, value: any) {
    if (path === '') {
      return value;
    }
    const [k, next] = path.split({
      [Symbol.split](s) {
        const i = s.indexOf('.');
        return i === -1 ? [s, ''] : [s.slice(0, i), s.slice(i + 1)];
      },
    });
    if (data !== undefined && typeof data !== 'object') {
      throw new Error(`Cannot set property ${k} of ${typeof data}`);
    }
    return Object.assign(data ?? (/^\d+$/.test(k) ? [] : {}), {
      [k]: this.set(data?.[k], next, value),
    });
  },
  sortArray(array: Array<any>, orderBy: string | undefined): Array<any> {
    if (!orderBy) {
      return array;
    }

    const sortFields = orderBy.split(',').map((field) => field.trim());
    const sortedArray = [...array];

    const criteria = sortFields.map((sortField) => {
      const [field, order] = sortField.split(':').map((value) => value.trim());

      if (!field || !order) {
        throw new BadRequestException(`Invalid sort field: ${sortField}`);
      }

      if (
        order.toUpperCase() !== Order.ASC &&
        order.toUpperCase() !== Order.DESC
      ) {
        throw new BadRequestException(`Invalid order: ${order}`);
      }

      return {
        key: (el) => this.get(el, field),
        dir: order.toLowerCase(),
      } as CompareKey<any>;
    });

    sortedArray.sort(compareBy(criteria));

    return sortedArray;
  },
  paginateAndSortArray(
    array: Array<any>,
    pageOptionsDto: PageOptionsDto,
  ): PageDto<any> {
    const { page: page_number, take: page_size } =
      pageOptionsDto.paginateOptions;
    const { orderBy } = pageOptionsDto.orderOptions ?? {};
    const itemCount = array.length;
    const pageMetaDto = new PageMetaDto({
      itemCount,
      paginateOptions: pageOptionsDto.paginateOptions,
    });
    const orderedData = this.sortArray(array, orderBy);
    const data = orderedData.slice(
      (page_number - 1) * page_size,
      page_number * page_size,
    );
    return new PageDto(data, pageMetaDto);
  },
  applyMixins(derivedCtor: any, constructors: any[]) {
    constructors.forEach((baseCtor) => {
      Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
        Object.defineProperty(
          derivedCtor.prototype,
          name,
          Object.getOwnPropertyDescriptor(baseCtor.prototype, name) ||
            Object.create(null),
        );
      });
    });
  },
  areArraysEquivalent<T extends string | number | symbol>(a: T[], b: T[]) {
    const keysAppears: Record<T, number> = {} as Record<T, number>;

    if (a === null || b === null) {
      return false;
    }

    for (const key of a) {
      keysAppears[key] = keysAppears[key]
        ? (keysAppears[key] as number) + 1
        : 1;
    }

    for (const key of b) {
      if (!keysAppears[key]) {
        return false;
      }
      keysAppears[key] = (keysAppears[key] as number) - 1;
    }

    return Object.values(keysAppears).every((value) => value === 0);
  },
  areArraysIntersect<T extends string | number | symbol>(a: T[], b: T[]) {
    const setA = new Set(a);
    const setB = new Set(b);
    return [...setA].some((value) => setB.has(value));
  },
  getUserRoles(user: User) {
    if (user.hasRolesOverride) {
      return user.rolesOverride;
    }
    return user.roles;
  },
  returnOnlyIdsFromCollections(entity: any, collectionNames: string[]) {
    const updatedEntity = { ...entity };

    for (const collectionName of collectionNames) {
      const collection = updatedEntity[collectionName];

      if (collection instanceof Collection) {
        updatedEntity[collectionName] = collection
          .getItems()
          .map((item) => ({ id: item.id, name: item.name }));
      } else if (collection instanceof Date) {
        updatedEntity[collectionName] = collection.toLocaleString('ru-RU');
      } else if (collection && 'id' in collection) {
        updatedEntity[collectionName] = {
          id: collection.id,
          name: collection.name,
        };
      }
    }

    return updatedEntity;
  },
  stripParametersFromEntity(entity: any, parameters: string[]) {
    const formatedEntity = { ...entity };
    parameters.forEach((parameter) => {
      formatedEntity[parameter] = undefined;
    });
    return formatedEntity;
  },
  convertNestedCollectionsToIdArray(entity: any) {
    try {
      const formattedEntity = this.returnOnlyIdsFromCollections({ ...entity }, [
        'createdAt',
        'updatedAt',
        'deletedAt',
      ]);

      return formattedEntity;
    } catch (error) {
      throw new DetailedBadRequestException([
        { reason: error.message, details: error.detail },
      ]);
    }
  },
  objectToString(object: any) {
    return JSON.stringify(object, (k, v) => (v === undefined ? null : v));
  },
  isBooleanString(value: string) {
    const lowerCaseValue = value?.toLowerCase();
    return lowerCaseValue === 'true' || lowerCaseValue === 'false';
  },
};
