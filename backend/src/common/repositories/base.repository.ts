import {
  AutoPath,
  Dictionary,
  EntityManager,
  EntityRepository,
  FilterQuery,
  FindOneOptions,
  LoadStrategy,
  OrderDefinition,
  Populate,
  PopulateHint,
  QBFilterQuery,
  QueryOrderMap,
  wrap,
} from '@mikro-orm/postgresql';
import { from, map, Observable } from 'rxjs';
import { BadRequestException, Logger } from '@nestjs/common';
import { MainBaseEntity } from '../entities/main-base.entity';
import { CursorPaginationResponse } from '../types/classes/cursor.response';
import { Buffer } from 'node:buffer';
import {
  getOppositeOrder,
  getQueryOrder,
  OppositeOrder,
  Order,
  PaginateOptions,
} from '../interfaces/pagination.interface';
import { CursorType, QueryOrder } from '../types/enums/misc.enum';
import { PageOptionsDto } from '../dtos/page-options.dto';
import { PageMetaDto } from '../dtos/page-meta.dto';
import { PageDto } from '../dtos/page.dto';
import { DetailedBadRequestException } from '../exceptions/detailed-bad-request.exception';
import { SOFT_DELETE_FILTER_NAME } from '../filters/with-soft-delete.filter';
import { FindOneOrThrowDto } from '../dtos/find-one-or-throw.dto';
import { FindAndPaginateDto } from '../dtos/find-and-paginate.dto';
import {
  MINIMAL_SERVICE_FIELDS,
  MINIMAL_SETTING_FIELDS,
  MINIMAL_STRUCTURE_FIELDS,
} from '../constants/minimal-fields.constant';
import { DetailedNotFoundException } from '../exceptions/detailed-not-found.exception';
import { CommonQueryFieldsDto } from '../dtos/common-query-fields.dto';
import { User } from '../../users/entities/user.entity';
import { WITH_USER_FILTER_NAME } from '../filters/with-user.filter';
import { extractFieldsFromData } from '../helpers/extract-fields-from-data.utils';
import { composeQueryFilter } from '../helpers/compose-query-filter.utils';
import { getObjectDiff, ObjectDiff } from '@donedeal0/superdiff';
import { HelperService } from '../helpers/helpers.utils';
import {
  ObjectDiffDto,
  ObjectDiffMeta,
  RevisionsDiffResponse,
} from '../dtos/object-diff.dto';
import { EntityDiffFieldsDto } from '../dtos/entity-diff-fields.dto';
import { PopulateType } from '../types/enums/populate-type.enum';

export class BaseRepository<
  T extends MainBaseEntity<T>,
> extends EntityRepository<T> {
  private readonly encoding: BufferEncoding = 'base64';
  private readonly logger: Logger = new Logger(BaseRepository.name);

  exists(where: QBFilterQuery<T>): Observable<boolean> {
    return from(this.qb().where(where).getCount()).pipe(
      map((count) => count > 0),
    );
  }

  throwIfEntityIsActive(entity: T) {
    if ('isActive' in entity && entity.isActive) {
      throw new DetailedBadRequestException([
        {
          reason: 'Cannot modify active entity',
          details: `Entity of type [${this.getEntityName()}] with id [${entity.id}] is active`,
        },
      ]);
    }
  }

  getEntityName(): string {
    return this.entityName.toString();
  }

  getMinimalFields() {
    switch (this.getEntityName()) {
      case 'Service':
        return MINIMAL_SERVICE_FIELDS;
      case 'Structure':
        return MINIMAL_STRUCTURE_FIELDS;
      case 'Setting':
        return MINIMAL_SETTING_FIELDS;
      default:
        return [];
    }
  }

  /**
   * Finds a single entity that matches the given filter and populates the specified fields.
   * Throws a NotFoundException if no entity is found.
   *
   * @param {User} user - The user who is performing the operation.
   * @param {FindOneOrThrowDto<T>} findOneOrThrowDto - The DTO containing filter, populate options, and withDeleted flag.
   * @return {Promise<T>} The found entity.
   * @throws {DetailedNotFoundException} If no entity is found for the given filter.
   */
  async findOneOrThrow(
    user: User,
    findOneOrThrowDto: FindOneOrThrowDto<T>,
  ): Promise<T> {
    const { filter, populateOptions, withDeleted, fieldsOptions } =
      findOneOrThrowDto;

    let entity;
    const findOneOptions: FindOneOptions<T> = {
      populate: populateOptions as Populate<T>,
      populateWhere: PopulateHint.INFER,
      fields: fieldsOptions as AutoPath<T, any>,
      filters: {
        [SOFT_DELETE_FILTER_NAME]: !withDeleted,
        [WITH_USER_FILTER_NAME]: { user },
      },
      strategy: LoadStrategy.SELECT_IN,
    };

    try {
      entity = await this.findOne(filter, findOneOptions);
    } catch (error) {
      throw new DetailedBadRequestException([
        { reason: error.message, details: error.detail },
      ]);
    }

    if (!entity) {
      throw new DetailedNotFoundException([
        {
          details: `No ${this.getEntityName()} found for filter: ${HelperService.objectToString(filter)}`,
          resourceId: HelperService.objectToString(filter),
          resourceName: this.getEntityName(),
        },
      ]);
    }

    return entity;
  }

  softRemove(entity: T): EntityManager {
    entity.deletedAt = new Date();
    entity.isDeleted = true;
    this.em.persist(entity);

    return this.em;
  }

  /**
   * Soft removes the entity and flushes the changes to the database.
   *
   * @param {T} entity - the entity to be soft removed
   * @return {Promise<T>} the entity after being soft removed and flushed
   * @throws {DetailedBadRequestException} if the entity cannot be soft removed
   */
  async softRemoveAndFlush(entity: T): Promise<T> {
    entity.deletedAt = new Date();
    entity.isDeleted = true;

    try {
      await this.em.persistAndFlush(entity);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return entity;
  }

  delete(entity: T): T {
    this.em.remove(entity);

    return entity;
  }

  /**
   * Finds and deletes an entity based on the provided filter query.
   *
   * @param {User} user - The user who is performing the operation.
   * @param {FilterQuery<T>} filter - The filter query used to find the entity.
   * @return {Promise<T>} The deleted entity.
   * @throws {DetailedNotFoundException} If no entity is found for the given filter.
   * @throws {DetailedBadRequestException} If the entity cannot be deleted.
   */
  async findAndDelete(user: User, filter: FilterQuery<T>): Promise<T> {
    const entity = await this.findOneOrThrow(user, { filter });

    this.throwIfEntityIsActive(entity);

    try {
      await this.em.remove(entity).flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return entity;
  }

  /**
   * Find and soft delete an entity based on the provided filter.
   *
   * @param {User} user - The user who is performing the operation.
   * @param {FilterQuery<T>} filter - The filter query to find the entity.
   * @return {Promise<T>} The entity that was soft deleted.
   * @throws {DetailedNotFoundException} If no entity is found for the given filter.
   * @throws {DetailedBadRequestException} If the entity cannot be soft deleted.
   */
  async findAndSoftDelete(user: User, filter: FilterQuery<T>): Promise<T> {
    const entity = await this.findOneOrThrow(user, { filter });

    this.throwIfEntityIsActive(entity);

    return this.softRemoveAndFlush(entity);
  }

  private getFilters<T>(
    cursor: keyof T,
    decoded: string | number | Date,
    order: Order | OppositeOrder,
  ): FilterQuery<Dictionary<T>> {
    return {
      [cursor]: {
        [order]: decoded,
      },
    };
  }

  private getOrderBy<T>(
    cursor: keyof T,
    order: QueryOrder,
  ): OrderDefinition<T> {
    return {
      [cursor]: order,
    } as QueryOrderMap<T>;
  }

  encodeCursor(value: Date | string | number): string {
    let string = value.toString();

    if (value instanceof Date) {
      string = value.getTime().toString();
    }

    return Buffer.from(string, 'utf8').toString('base64');
  }

  private paginateCursor<T>(
    dto: PaginateOptions<T>,
  ): CursorPaginationResponse<T> {
    const { instances, currentCount, previousCount, cursor, first, search } =
      dto;

    const pages: CursorPaginationResponse<T> = {
      data: instances,
      meta: {
        nextCursor: '',
        hasPreviousPage: false,
        hasNextPage: false,
        search: search ?? '',
      },
    };
    const length = instances.length;

    if (length > 0) {
      const last = instances[length - 1]![cursor] as string | number | Date;

      pages.meta.nextCursor = this.encodeCursor(last);
      pages.meta.hasNextPage = currentCount > first;
      pages.meta.hasPreviousPage = previousCount > 0;
    }

    return pages;
  }

  async findAndCountPagination<T extends Dictionary>(
    cursor: keyof T,
    first: number,
    order: QueryOrder,
    repo: EntityRepository<T>,
    where: FilterQuery<T> & { $and: any },
    after?: string,
    afterCursor: CursorType = CursorType.STRING,
  ): Promise<CursorPaginationResponse<T>> {
    let previousCount = 0;

    if (after) {
      const decoded = this.decodeCursor(after, afterCursor);
      const queryOrder = getQueryOrder(order);
      const oppositeOrder = getOppositeOrder(order);
      const countWhere = where;

      // @ts-expect-error intentional
      countWhere['$and'] = this.getFilters('createdAt', decoded, oppositeOrder);
      previousCount = await repo.count(countWhere);

      // @ts-expect-error intentional
      where['$and'] = this.getFilters('createdAt', decoded, queryOrder);
    }

    const [entities, count] = await repo.findAndCount(where, {
      orderBy: this.getOrderBy(cursor, order),
      limit: first,
    });

    return this.paginateCursor({
      instances: entities,
      currentCount: count,
      previousCount,
      cursor,
      first,
    });
  }

  private decodeCursor(
    cursor: string,
    cursorType: CursorType = CursorType.STRING,
  ): string | number | Date {
    const string = Buffer.from(cursor, this.encoding).toString('utf-8');

    switch (cursorType) {
      case CursorType.DATE:
        const millisUnix = Number.parseInt(string, 10);

        if (Number.isNaN(millisUnix)) {
          throw new BadRequestException('Invalid date for cursor');
        }

        return new Date(millisUnix);
      case CursorType.NUMBER:
        const number = Number.parseInt(string, 10);

        if (Number.isNaN(number)) {
          throw new BadRequestException('Invalid number for cursor');
        }

        return number;
      default:
        return string;
    }
  }

  /**
   * Finds and paginates entities based on the provided criteria.
   *
   * @param {User} user - The user who is performing the operation.
   * @param {FindAndPaginateDto<T>} findAndPaginateDto - The DTO containing the filter, orderBy, populateOptions, fieldsOptions, and paginateOptionsDto.
   * @returns {Promise<PageDto<T>>} A promise that resolves to a PageDto containing the entities and pagination metadata.
   */
  async findAndPaginate(
    user: User,
    findAndPaginateDto: FindAndPaginateDto<T>,
  ): Promise<PageDto<T>> {
    const { pageOptionsDto, filter: initialFilter } = findAndPaginateDto;
    const { orderBy } = pageOptionsDto.orderOptions ?? {};
    const { populateItems, populateType } =
      pageOptionsDto.populateOptions ?? {};
    const { populate: populateOptions, fields: fieldsOptions } =
      this.getPopulateOptions(populateType, populateItems);

    const orderByFields = orderBy?.split(',') || [];

    const orderByDefinition = {} as any;

    for (const orderItem of orderByFields) {
      const [orderName, orderType] = orderItem.split(':');
      orderByDefinition[orderName] = orderType;
    }

    const { skip, take } = pageOptionsDto.paginateOptions;
    const { withDeleted } = pageOptionsDto.populateOptions ?? {};
    const { extractFields, filterBy } = pageOptionsDto.filterOptions ?? {};
    const composeFilter = initialFilter
      ? initialFilter
      : (composeQueryFilter(filterBy) as FilterQuery<T>);

    const [entities, itemCount] = await this.em.findAndCount<T>(
      this.getEntityName(),
      composeFilter,
      {
        orderBy: orderByDefinition as OrderDefinition<T>,
        offset: skip,
        limit: take,
        populate: (populateOptions ? populateOptions : undefined) as any,
        fields: fieldsOptions as AutoPath<T, any>,
        filters: {
          [SOFT_DELETE_FILTER_NAME]: !withDeleted,
          [WITH_USER_FILTER_NAME]: { user },
        },
      },
    );

    const pageMetaDto = new PageMetaDto({
      itemCount,
      paginateOptions: pageOptionsDto.paginateOptions,
    });
    const extractedEntities = extractFieldsFromData<T>(entities, extractFields);

    return new PageDto(extractedEntities as T[], pageMetaDto);
  }

  /**
   * An asynchronous function to find revisions.
   *
   * @param {User} user - The user who is performing the operation.
   * @param {number} id - The ID to search for.
   * @param {PageOptionsDto} pageOptionsDto - The options for paginating the results.
   * @return {Promise<PageDto<T>>} A promise that resolves to a page of revisions.
   * @throws {DetailedNotFoundException} If the entity is not found.
   * @throws {DetailedBadRequestException} If there is an error retrieving the revisions.
   */
  async findRevisions(
    user: User,
    id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<T>> {
    const { filterBy: initialFilterBy } = pageOptionsDto.filterOptions ?? {};
    const initialComposeFilter = composeQueryFilter(initialFilterBy);
    const entity: T = await this.findOneOrThrow(user, {
      filter: {
        id,
      } as FilterQuery<T>,
      fieldsOptions: ['idx'],
    });

    const idx = entity.idx;
    const filter = initialComposeFilter
      ? ({ $and: [initialComposeFilter, { idx }] } as FilterQuery<T>)
      : ({ idx } as FilterQuery<T>);

    try {
      return await this.findAndPaginate(user, {
        filter,
        pageOptionsDto,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Find one item by filter with additional common query fields.
   *
   * @param {User} user - The user object initiating the search.
   * @param {FilterQuery<T>} filter - The filter query to apply.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields DTO.
   * @return {Promise<T>} A promise that resolves to the found item.
   */
  async findOneByFilter(
    user: User,
    filter: FilterQuery<T>,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<T> {
    const { populateItems, populateType, extractFields } = commonQueryDto;
    const { populate: populateOptions, fields: fieldsOptions } =
      this.getPopulateOptions(populateType, populateItems);
    const entity = await this.findOneOrThrow(user, {
      filter,
      populateOptions,
      fieldsOptions,
    });

    return extractFieldsFromData<T>(entity, extractFields) as T;
  }

  /**
   * Retrieve a specific revision of an item based on the provided id and revision number.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id The id of the item to retrieve the revision from.
   * @param {number} revision The revision number of the item to retrieve.
   * @param {CommonQueryFieldsDto} commonQueryDto Additional query fields to apply.
   * @returns {Promise<T>} The item revision based on the provided id and revision number.
   */
  async getRevision(
    user: User,
    id: number,
    revision: number,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<T> {
    const { idx } = await this.findOneOrThrow(user, {
      filter: {
        id,
      } as FilterQuery<T>,
      populateOptions: ['idx'],
    });
    return this.findOneByFilter(
      user,
      { idx, revision } as FilterQuery<T>,
      commonQueryDto,
    );
  }

  /**
   * Get the populate options based on the provided items and populateAll flag.
   *
   * @param {string | undefined} populateItems - The items to populate.
   * @param {boolean} populateAll - Flag to populate all items.
   * @return {string[]} An array of populate options.
   */
  getPopulateOptions(
    populateType?: PopulateType,
    populateItems?: string | null | undefined,
  ): { populate?: string[]; fields?: string[] } {
    this.logger.debug(
      `getPopulateOptions.params: ${HelperService.objectToString({ populateType, populateItems })}`,
    );
    const compPopulate: { populate?: string[]; fields?: string[] } = {};
    const populateItemsArray = populateItems?.split(',') || undefined;
    if (populateType === PopulateType.ALL) {
      compPopulate.populate = ['*'];
      compPopulate.fields = populateItemsArray;
    }
    if (populateType === PopulateType.MINIMAL) {
      compPopulate.fields = [
        ...this.getMinimalFields(),
        ...(populateItemsArray ?? []),
      ];
    }
    if (populateType === PopulateType.NONE) {
      compPopulate.populate = populateItemsArray;
    }

    return compPopulate;
  }

  /**
   * Finds and restores an entity based on the provided filter.
   *
   * @param {User} user The user performing the operation.
   * @param {FilterQuery<T>} filter - The filter to apply when searching for the entity.
   * @return {Promise<T>} The restored entity.
   * @throws {DetailedNotFoundException} If the entity cannot be found.
   * @throws {DetailedBadRequestException} If the entity cannot be restored.
   */
  async findAndRestore(user: User, filter: FilterQuery<T>): Promise<T> {
    const entity = await this.findOneOrThrow(user, {
      filter,
      withDeleted: true,
      populateOptions: ['isDeleted', 'deletedAt'],
    });
    entity.isDeleted = false;
    entity.deletedAt = null;
    try {
      await this.em.persistAndFlush(entity);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return entity;
  }

  /**
   * Retrieves the difference between two entities.
   *
   * @param {User} user - The user performing the operation.
   * @param {number} fromID - The ID of the first entity.
   * @param {number} toID - The ID of the second entity.
   * @param {EntityDiffFieldsDto} entityDiffFieldsDto - The fields to include in the diff.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields.
   * @return {Promise<ObjectDiff>} The difference between the two entities.
   */
  async getEntitiesDiff(
    user: User,
    fromID: number,
    toID: number,
    entityDiffFieldsDto: EntityDiffFieldsDto,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<ObjectDiff> {
    const [fromEntity, toEntity] = await Promise.all([
      this.findOneByFilter(
        user,
        { id: fromID } as FilterQuery<T>,
        commonQueryDto,
      ),
      this.findOneByFilter(
        user,
        { id: toID } as FilterQuery<T>,
        commonQueryDto,
      ),
    ]);

    try {
      const fromEntityObject = wrap(fromEntity).toObject();
      const toEntityObject = wrap(toEntity).toObject();
      const stripedFromEntity =
        HelperService.convertNestedCollectionsToIdArray(fromEntityObject);
      const stripedToEntity =
        HelperService.convertNestedCollectionsToIdArray(toEntityObject);

      return getObjectDiff(stripedFromEntity, stripedToEntity, {
        showOnly: entityDiffFieldsDto.onlyChanges
          ? { statuses: ['added', 'deleted', 'updated'] }
          : undefined,
        ignoreArrayOrder: false,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Retrieves the difference between revisions of an entity.
   *
   * @param {User} user - The user performing the operation.
   * @param {number} id - The ID of the entity.
   * @param {EntityDiffFieldsDto} entityDiffFieldsDto - The fields to include in the diff.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields.
   * @return {Promise<RevisionsDiffResponse>} The difference between the revisions of the entity.
   * @throws {DetailedNotFoundException} If not enough revisions are found.
   * @throws {DetailedBadRequestException} If an unexpected error occurs.
   */
  async getEntityRevisionsDiff(
    user: User,
    id: number,
    entityDiffFieldsDto: EntityDiffFieldsDto,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<RevisionsDiffResponse> {
    const existingEntity = await this.findOneOrThrow(user, {
      filter: { id } as FilterQuery<T>,
      fieldsOptions: ['idx'],
    });
    const idx = existingEntity.idx;
    try {
      const revisions = await this.find({ idx } as FilterQuery<T>, {
        fields: ['id', 'revision'] as any,
        filters: {
          [WITH_USER_FILTER_NAME]: { user },
        },
      });

      if (revisions.length <= 1) {
        throw new DetailedNotFoundException([
          {
            details: `Not enough revisions of type [${this.getEntityName()}] found for id [${id}] to compare`,
            resourceId: HelperService.objectToString(id),
            resourceName: this.getEntityName(),
          },
        ]);
      }

      const sortedRevisions = revisions.sort((a, b) => a.revision - b.revision);

      const diffMeta: ObjectDiffMeta = {
        entityIdx: idx,
        revisionCount: sortedRevisions.length,
      };
      const diffArray: Array<ObjectDiffDto> = [];
      for (const [index, revision] of sortedRevisions.entries()) {
        if (index === 0) {
          continue;
        }

        const fromId = revisions[index - 1].id;
        const toId = revision.id;

        const diffSummary = (await this.getEntitiesDiff(
          user,
          fromId,
          toId,
          entityDiffFieldsDto,
          commonQueryDto,
        )) as any;

        diffArray.push({ fromId, toId, diffSummary });
      }

      return { meta: diffMeta, diffList: diffArray };
    } catch (e) {
      if (!(e instanceof DetailedNotFoundException)) {
        throw new DetailedBadRequestException([
          { reason: e.message, details: e.detail },
        ]);
      } else {
        throw e;
      }
    }
  }
}
