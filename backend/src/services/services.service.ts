import { Injectable, Logger } from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import {
  Collection,
  EntityManager,
  FilterQuery,
  QueryOrder,
  wrap,
} from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Service } from './entities/service.entity';
import { BaseRepository } from '../common/repositories/base.repository';
import { User } from '../users/entities/user.entity';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { PageDto } from '../common/dtos/page.dto';
import { Structure } from '../structures/entities/structures.entity';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { ConflictResourceException } from '../common/exceptions/conflict-resource.exception';
import { HelperService } from '../common/helpers/helpers.utils';
import { WITH_USER_FILTER_NAME } from '../common/filters/with-user.filter';
import { extractFieldsFromData } from '../common/helpers/extract-fields-from-data.utils';
import { EntityDiffFieldsDto } from '../common/dtos/entity-diff-fields.dto';
import { ServiceTypeEnum } from '../common/types/enums/service-type.enum';
import { isNumber } from 'class-validator';

@Injectable()
export class ServicesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Service)
    private readonly servicesRepository: BaseRepository<Service>,
    @InjectRepository(Structure)
    private readonly structuresRepository: BaseRepository<Structure>,
  ) {}

  private readonly logger: Logger = new Logger(ServicesService.name);

  private async throwIfBaseInDescendants(
    user: User,
    descendants: Collection<Service> | Service[] | undefined,
    servicesRepository: BaseRepository<Service>,
  ): Promise<void> {
    if (descendants && descendants.length > 0) {
      for (const descendant of descendants) {
        const baseDescendant = await servicesRepository.findOne(
          {
            id: isNumber(descendant) ? descendant : descendant.id,
            type: ServiceTypeEnum.base,
          },
          {
            filters: {
              [WITH_USER_FILTER_NAME]: { user },
            },
          },
        );
        if (baseDescendant) {
          throw new ConflictResourceException([
            {
              description: `Cant add a base service as a descendant.`,
              conflictResourceId: baseDescendant.id.toString(),
              conflictResourceName: 'Service',
            },
          ]);
        }
      }
    }
  }

  private throwIfContainsSelf(
    serviceId: number,
    descendants: Service[] | undefined,
  ): void {
    if (descendants && descendants.length > 0) {
      const containingSelf = descendants?.some((descendant) => {
        if (isNumber(descendant)) {
          return descendant === serviceId;
        }
        descendant.id === serviceId;
      });

      if (containingSelf) {
        throw new ConflictResourceException([
          {
            description: `Service with ID [${serviceId}] is being updated with descendants list containing the same ID`,
            conflictResourceId: serviceId.toString(),
            conflictResourceName: 'Service',
          },
        ]);
      }
    }
  }

  /**
   * Create a new service.
   *
   * @param {CreateServiceDto} createServiceDto - the data to create the service
   * @param {User} user - the user creating the service
   * @return {Promise<Service>} the newly created service
   * @throws {DetailedBadRequestException} if there is a bad request during creation
   */
  async create(
    user: User,
    createServiceDto: CreateServiceDto,
  ): Promise<Service> {
    const newService = this.servicesRepository.create({
      ...createServiceDto,
      user,
      ...HelperService.getInitialEntityFields(),
    });

    await this.throwIfBaseInDescendants(
      user,
      newService.descendants,
      this.servicesRepository,
    );

    try {
      await this.em.persistAndFlush(newService);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }

    return newService;
  }

  /**
   * Retrieves all services with pagination and optional population of related fields.
   *
   * @param {User} user - The user performing the operation.
   * @param {PageOptionsDto} pageOptionsDto - The options for pagination and population.
   * @return {Promise<PageDto<Service>>} A promise that resolves to a PageDto containing the services.
   * @throws {DetailedBadRequestException} If there is an error retrieving the services.
   */
  async findAll(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Service>> {
    try {
      return await this.servicesRepository.findAndPaginate(user, {
        pageOptionsDto,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Finds a single service based on the provided filter and common query fields.
   *
   * @param {User} user The user performing the operation.
   * @param {FilterQuery<Service>} filter - The filter to apply when searching for the service.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields to use for populating and field options.
   * @return {Promise<Service>} A promise that resolves to the found service.
   * @throws {DetailedNotFoundException} If the service is not found.
   */
  async findOne(
    user: User,
    filter: FilterQuery<Service>,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Partial<Service>> {
    return await this.servicesRepository.findOneByFilter(
      user,
      filter,
      commonQueryDto,
    );
  }

  /**
   * Finds revisions for a given service ID with pagination options.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the service.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @return {Promise<PageDto<Service>>} - A promise that resolves to a paginated result of revisions.
   * @throws {DetailedNotFoundException} - If the service is not found.
   * @throws {DetailedBadRequestException} - If there is an error while finding the revisions.
   */
  async findRevisions(
    user: User,
    id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Service>> {
    return await this.servicesRepository.findRevisions(
      user,
      id,
      pageOptionsDto,
    );
  }

  /**
   * Retrieves a specific revision of a service based on the given ID and revision number.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the service.
   * @param {number} revision - The revision number of the service.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields DTO.
   * @return {Promise<Service>} A promise that resolves to the service with the specified ID and revision.
   * @throws {DetailedNotFoundException} - If the service is not found.
   */
  async getRevision(
    user: User,
    id: number,
    revision: number,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Partial<Service>> {
    const data = await this.servicesRepository.getRevision(
      user,
      id,
      revision,
      commonQueryDto,
    );

    return extractFieldsFromData(
      data,
      commonQueryDto.extractFields,
    ) as Partial<Service>;
  }

  /**
   * Updates a service with the specified ID using the provided data.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the service to update.
   * @param {UpdateServiceDto} updateServiceDto - The data to update the service with.
   * @return {Promise<Service>} - A promise that resolves to the updated service.
   * @throws {ConflictResourceException} - If the descendants array of the updateServiceDto contains the ID of the service being updated.
   * @throws {DetailedNotFoundException} - If the service is not found.
   * @throws {DetailedBadRequestException} - If something went wrong.
   */
  async update(
    user: User,
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    this.logger.debug(
      `Service.update(${HelperService.objectToString({ user, id, updateServiceDto })})`,
    );
    this.throwIfContainsSelf(id, updateServiceDto.descendants);
    await this.throwIfBaseInDescendants(
      user,
      updateServiceDto.descendants,
      this.servicesRepository,
    );

    const toUpdate = await this.servicesRepository.findOneOrThrow(user, {
      filter: {
        id,
      },
      populateOptions: ['*'],
    });

    try {
      this.em.assign(toUpdate, updateServiceDto);
      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return toUpdate;
  }

  /**
   * Update the revision of a service.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - the ID of the service
   * @param {UpdateServiceDto} updateServiceDto - the DTO containing the updated service information
   * @return {Promise<Service>} the updated service
   * @throws {DetailedNotFoundException} if the service is not found
   * @throws {DetailedBadRequestException} if there is an error while updating the service
   *
   * This method updates the revision of a service identified by the provided ID. It retrieves the existing service based on the ID and extracts relevant information such as roles, settings, and descendants. It calculates a new revision based on the last service revision and creates a new service with the updated information. The method also updates the service references in existing structures and persists the changes using the EntityManager.
   */
  async updateRevision(
    user: User,
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<Service> {
    this.logger.debug(
      `updateRevision(${HelperService.objectToString({ user, id, updateServiceDto })})`,
    );
    await this.throwIfBaseInDescendants(
      user,
      updateServiceDto.descendants,
      this.servicesRepository,
    );
    this.throwIfContainsSelf(id, updateServiceDto.descendants);
    const existingService = await this.servicesRepository.findOneOrThrow(user, {
      filter: {
        id,
      },
      populateOptions: ['settings', 'roles', 'descendants', 'idx'],
    });

    const revisionIdx = existingService.idx;
    const roles = await existingService.roles.loadItems();
    const settings = await existingService.settings.loadItems();
    const descendants = await existingService.descendants.loadItems();
    const lastServiceRevision = await this.servicesRepository.findOne(
      { idx: revisionIdx },
      {
        orderBy: { revision: QueryOrder.DESC },
        filters: {
          [WITH_USER_FILTER_NAME]: { user },
        },
      },
    );
    if (!lastServiceRevision) {
      throw new DetailedNotFoundException([
        {
          details: `No Service found for filter: {idx: ${revisionIdx}}`,
          resourceId: `${revisionIdx}`,
          resourceName: 'Service',
        },
      ]);
    }
    const newRevision = lastServiceRevision.revision + 1;
    const partialToUpdate: Partial<Service> = Object.assign(
      {},
      existingService,
    );
    delete partialToUpdate.id;
    delete partialToUpdate.createdAt;
    delete partialToUpdate.updatedAt;
    delete partialToUpdate.deletedAt;
    const newService = new Service();
    const updateObject = {
      ...partialToUpdate,
      roles,
      settings,
      descendants,
      ...updateServiceDto,
      user,
      revision: newRevision,
      isDeleted: false,
    };
    try {
      wrap(newService).assign(
        {
          ...updateObject,
        },
        { em: this.em },
      );

      this.em.persist(newService);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }

    const existingStructures = await this.structuresRepository.find(
      {
        services: { id },
      },
      {
        populate: ['*'],
        filters: {
          [WITH_USER_FILTER_NAME]: { user },
        },
      },
    );

    for (const structure of existingStructures) {
      if (!structure.services.isInitialized()) {
        await structure.services.init();
        this.logger.debug(`updateRevision.structure.services: initialized`);
      }
      // @ts-expect-error https://mikro-orm.io/docs/6.2/guide/type-safety#loaded-type
      structure.services.$.remove(existingService);
      this.logger.debug(`updateRevision.structure.services: removed`);
      // @ts-expect-error https://mikro-orm.io/docs/6.2/guide/type-safety#loaded-type
      structure.services.$.add(newService);
      this.logger.debug(`updateRevision.structure.services: added`);
      try {
        this.em.persist(structure);
        this.logger.debug(`updateRevision.structure: persisted`);
      } catch (e) {
        throw new DetailedBadRequestException([
          { reason: e.message, details: e.detail },
        ]);
      }
    }

    const existingServices = await this.servicesRepository.find(
      {
        descendants: { id },
      },
      {
        populate: ['*'],
        filters: {
          [WITH_USER_FILTER_NAME]: { user },
        },
      },
    );

    for (const service of existingServices) {
      if (!service.descendants.isInitialized()) {
        await service.descendants.init();
        this.logger.debug(`updateRevision.service.descendants: initialized`);
      }

      // @ts-expect-error https://mikro-orm.io/docs/6.2/guide/type-safety#loaded-type
      service.descendants.$.remove(existingService);
      this.logger.debug(`updateRevision.service.descendants: removed`);
      // @ts-expect-error https://mikro-orm.io/docs/6.2/guide/type-safety#loaded-type
      service.descendants.$.add(newService);
      this.logger.debug(`updateRevision.service.descendants: added`);
      try {
        this.em.persist(service);
        this.logger.debug(`updateRevision.service: persisted`);
      } catch (e) {
        throw new DetailedBadRequestException([
          { reason: e.message, details: e.detail },
        ]);
      }
    }

    try {
      this.em.persist(existingStructures);
      this.logger.debug(`updateRevision.existingStructures: persisted`);
      await this.em.flush();
      this.logger.debug(`updateRevision.em.flush: done`);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }

    return newService;
  }

  /**
   * Removes a service with the specified ID from the database.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the service to be removed.
   * @return {Promise<Service>} A promise that resolves to the removed service.
   * @throws {DetailedNotFoundException} if the service is not found
   * @throws {DetailedBadRequestException} if there is an error while removing the service
   */
  async remove(user: User, id: number): Promise<Service> {
    return this.servicesRepository.findAndDelete(user, { id });
  }

  /**
   * Soft deletes a service by its ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the service to be soft deleted.
   * @returns {Promise<Service>} A promise that resolves to the soft deleted service.
   * @throws {DetailedNotFoundException} if the service is not found
   * @throws {DetailedBadRequestException} if there is an error while soft deleting the service
   */
  softRemove(user: User, id: number): Promise<Service> {
    return this.servicesRepository.findAndSoftDelete(user, { id });
  }

  /**
   * Restores a soft-deleted service with the given ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the service to restore.
   * @return {Promise<Service>} A promise that resolves to the restored service.
   * @throws {DetailedNotFoundException} if the service is not found
   * @throws {DetailedBadRequestException} if there is an error while restoring the service
   */
  restore(user: User, id: number): Promise<Service> {
    return this.servicesRepository.findAndRestore(user, { id });
  }

  async getEntitiesDiff(
    user: User,
    fromID: number,
    toID: number,
    entityDiffFieldsDto: EntityDiffFieldsDto,
    commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.servicesRepository.getEntitiesDiff(
      user,
      fromID,
      toID,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  async getEntityRevisionsDiff(
    user: User,
    id: number,
    entityDiffFieldsDto: EntityDiffFieldsDto,
    commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.servicesRepository.getEntityRevisionsDiff(
      user,
      id,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }
}
