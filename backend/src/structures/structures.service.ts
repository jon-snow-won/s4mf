import { Injectable } from '@nestjs/common';
import { CreateStructureDto } from './dto/create-structure.dto';
import { UpdateStructureDto } from './dto/update-structure.dto';
import {
  EntityManager,
  FilterQuery,
  QueryOrder,
  wrap,
} from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Structure } from './entities/structures.entity';
import { BaseRepository } from '../common/repositories/base.repository';
import { User } from '../users/entities/user.entity';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { PageDto } from '../common/dtos/page.dto';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { HelperService } from '../common/helpers/helpers.utils';
import { extractFieldsFromData } from '../common/helpers/extract-fields-from-data.utils';
import { WITH_USER_FILTER_NAME } from '../common/filters/with-user.filter';
import { EntityDiffFieldsDto } from '../common/dtos/entity-diff-fields.dto';

@Injectable()
export class StructuresService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Structure)
    private readonly structuresRepository: BaseRepository<Structure>,
  ) {}
  /**
   * Creates a new structure using the provided data and associates it with the given user.
   *
   * @param {CreateStructureDto} createStructureDto - the data to create the structure
   * @param {User} user - the user associated with the structure
   * @return {Promise<Structure>} the newly created structure
   * @throws {DetailedBadRequestException} if there is an error creating the structure
   */
  async create(
    user: User,
    createStructureDto: CreateStructureDto,
  ): Promise<Structure> {
    const newStructure = this.structuresRepository.create({
      ...createStructureDto,
      user,
      ...HelperService.getInitialEntityFields(),
    });

    try {
      await this.em.persistAndFlush(newStructure);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return newStructure;
  }

  /**
   * Retrieves all structures with pagination and optional population of related fields.
   *
   * @param {User} user The user performing the operation.
   * @param {PageOptionsDto} pageOptionsDto - The options for pagination and population.
   * @return {Promise<PageDto<Structure>>} A promise that resolves to a PageDto containing the structures.
   * @throws {DetailedBadRequestException} If there is an error retrieving the structures.
   */
  async findAll(
    user: User,
    onlyActive: boolean,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Partial<Structure>>> {
    const ormFilter = onlyActive
      ? {
          isActive: true,
        }
      : undefined;

    try {
      return await this.structuresRepository.findAndPaginate(user, {
        filter: ormFilter as FilterQuery<Structure>,
        pageOptionsDto,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Finds and returns a single structure based on the provided filter and common query fields.
   *
   * @param {User} user The user performing the operation.
   * @param {FilterQuery<Structure>} filter - The filter to apply when searching for the structure.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields to use when searching for the structure.
   * @returns {Promise<Structure>} - A promise that resolves to the found structure.
   * @throws {DetailedNotFoundException} - If the structure is not found.
   */
  async findOne(
    user: User,
    filter: FilterQuery<Structure>,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Partial<Structure>> {
    return await this.structuresRepository.findOneByFilter(
      user,
      filter,
      commonQueryDto,
    );
  }

  /**
   * Finds and returns revisions based on the provided id and page options.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID used to find the revisions.
   * @param {PageOptionsDto} pageOptionsDto - The page options for pagination.
   * @return {Promise<PageDto<Structure>>} A promise that resolves to a PageDto of Structures.
   * @throws {DetailedNotFoundException} - If the structure is not found.
   * @throws {DetailedBadRequestException} - If there is an error while finding the revisions.
   */
  async findRevisions(
    user: User,
    id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Structure>> {
    return await this.structuresRepository.findRevisions(
      user,
      id,
      pageOptionsDto,
    );
  }

  /**
   * Retrieves a specific revision of a structure based on the given ID and revision number.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the structure.
   * @param {number} revision - The revision number of the structure.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields DTO.
   * @return {Promise<Structure>} A promise that resolves to the retrieved structure.
   * @throws {DetailedNotFoundException} - If the structure is not found.
   */
  async getRevision(
    user: User,
    id: number,
    revision: number,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Partial<Structure>> {
    const data = await this.structuresRepository.getRevision(
      user,
      id,
      revision,
      commonQueryDto,
    );

    return extractFieldsFromData(
      data,
      commonQueryDto.extractFields,
    ) as Partial<Structure>;
  }

  /**
   * Updates a structure.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the structure.
   * @param {UpdateStructureDto} updateManifestDto - The DTO containing the updated structure data.
   * @return {Promise<Structure>} The updated structure.
   * @throws {DetailedNotFoundException} - If the structure is not found.
   * @throws {DetailedBadRequestException} - If something went wrong.
   */
  async update(
    user: User,
    id: number,
    updateManifestDto: UpdateStructureDto,
  ): Promise<Structure> {
    const toUpdate = await this.structuresRepository.findOneOrThrow(user, {
      filter: {
        id,
      },
    });

    try {
      wrap(toUpdate).assign(updateManifestDto);
      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return toUpdate;
  }

  /**
   * Updates a revision of a structure.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the structure.
   * @param {UpdateStructureDto} updateStructureDto - The DTO containing the updated structure data.
   * @return {Promise<Structure>} The updated structure.
   * @throws {DetailedNotFoundException} - If the structure is not found.
   * @throws {DetailedBadRequestException} - If something went wrong.
   *
   * This method takes an ID and a DTO as input and returns a Promise of a Structure. It updates a revision of a structure by fetching the existing structure, loading its services and settings, finding the last structure revision, creating a new revision, updating the structure with the new revision and other data from the DTO, and then persisting and returning the updated structure.
   */
  async updateRevision(
    user: User,
    id: number,
    updateStructureDto: UpdateStructureDto,
  ): Promise<Structure> {
    const existingStructure = await this.structuresRepository.findOneOrThrow(
      user,
      {
        filter: {
          id,
        },
        populateOptions: ['services', 'settings', 'idx'],
      },
    );
    const revisionIdx = existingStructure.idx;
    const services = await existingStructure.services.loadItems({
      filters: { [WITH_USER_FILTER_NAME]: { user } },
    });
    const settings = await existingStructure.settings.loadItems();
    const lastStructureRevision = await this.structuresRepository.findOne(
      { idx: revisionIdx },
      { orderBy: { revision: QueryOrder.DESC } },
    );
    if (!lastStructureRevision) {
      throw new DetailedNotFoundException([
        {
          details: `No Structure found for filter: {idx: ${revisionIdx}}`,
          resourceId: `${revisionIdx}`,
          resourceName: 'Structure',
        },
      ]);
    }
    const newRevision = lastStructureRevision.revision + 1;
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      ...partialToUpdate
    } = existingStructure;
    const newStructure = new Structure();
    try {
      wrap(newStructure).assign(
        {
          ...partialToUpdate,
          services,
          settings,
          ...updateStructureDto,
          revision: newRevision,
          deletedAt: null,
          isDeleted: false,
          isActive: false,
          user,
        },
        { em: this.em },
      );
      this.em.persist(newStructure);

      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }

    return newStructure;
  }

  /**
   * A description of the entire function.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - description of parameter
   * @return {Promise<Structure>} description of return value
   * @throws {DetailedNotFoundException} description of exceptions
   * @throws {DetailedBadRequestException} description of exceptions
   */
  async remove(user: User, id: number): Promise<Structure> {
    return this.structuresRepository.findAndDelete(user, { id });
  }

  /**
   * Soft deletes a structure by its ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the structure to be soft deleted.
   * @return {Promise<Structure>} A promise that resolves to the soft deleted structure.
   * @throws {DetailedNotFoundException} If the structure is not found.
   * @throws {DetailedBadRequestException} If something went wrong.
   */
  softRemove(user: User, id: number): Promise<Structure> {
    return this.structuresRepository.findAndSoftDelete(user, { id });
  }

  /**
   * Restores a structure by its ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the structure to restore.
   * @return {Promise<Structure>} A promise that resolves to the restored structure.
   * @throws {DetailedNotFoundException} If the structure is not found.
   * @throws {DetailedBadRequestException} If something went wrong.
   */
  restore(user: User, id: number): Promise<Structure> {
    return this.structuresRepository.findAndRestore(user, { id });
  }

  async getEntitiesDiff(
    user: User,
    fromID: number,
    toID: number,
    entityDiffFieldsDto: EntityDiffFieldsDto,
    commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.structuresRepository.getEntitiesDiff(
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
    return this.structuresRepository.getEntityRevisionsDiff(
      user,
      id,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }

  /**
   * Sets the active structure ID for a given user.
   *
   * @param {User} user - The user performing the operation.
   * @param {number} structureID - The ID of the structure to set as active.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   */
  async setActiveStructureID(user: User, structureID: number): Promise<void> {
    const activeStructure = await this.structuresRepository.findOneOrThrow(
      user,
      {
        filter: { id: structureID },
      },
    );
    activeStructure.isActive = true;
    await this.em.persist(activeStructure);

    const activeStructures = await this.structuresRepository.find({
      $and: [{ id: { $ne: structureID } }, { isActive: true }],
    });

    for (const structure of activeStructures) {
      structure.isActive = false;
      this.em.persist(structure);
    }

    await this.em.flush();
  }
}
