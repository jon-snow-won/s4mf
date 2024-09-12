import { Injectable } from '@nestjs/common';
import { CreateSettingDto } from './dto/create-setting.dto';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Setting } from './entities/settings.entity';
import { BaseRepository } from '../common/repositories/base.repository';
import { Service } from '../services/entities/service.entity';
import { User } from '../users/entities/user.entity';
import { QueryOrder } from '../common/types/enums/misc.enum';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { PageDto } from '../common/dtos/page.dto';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { HelperService } from '../common/helpers/helpers.utils';
import { WITH_USER_FILTER_NAME } from '../common/filters/with-user.filter';
import { extractFieldsFromData } from '../common/helpers/extract-fields-from-data.utils';
import { EntityDiffFieldsDto } from '../common/dtos/entity-diff-fields.dto';

@Injectable()
export class SettingsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Setting)
    private readonly settingsRepository: BaseRepository<Setting>,
    @InjectRepository(Service)
    private readonly servicesRepository: BaseRepository<Service>,
  ) {}
  /**
   * Creates a new setting using the provided data and user information.
   *
   * @param {CreateSettingDto} createSettingDto - The data for creating the setting.
   * @param {User} user - The user information.
   * @return {Promise<Setting>} The newly created setting.
   * @throws {DetailedBadRequestException} If there is an error creating the setting
   */
  async create(
    user: User,
    createSettingDto: CreateSettingDto,
  ): Promise<Setting> {
    const newSetting = this.settingsRepository.create({
      ...createSettingDto,
      user,
      ...HelperService.getInitialEntityFields(),
    });

    try {
      await this.em.persistAndFlush(newSetting);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return newSetting;
  }

  /**
   * Find all settings with pagination and optional population of related fields.
   *
   * @param {User} user The user performing the operation.
   * @param {PageOptionsDto} pageOptionsDto - The options for pagination and population
   * @return {Promise<PageDto<Setting>>} A promise that resolves to a PageDto containing the settings
   * @throws {DetailedBadRequestException} If there is an error retrieving the settings.
   */
  async findAll(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Setting>> {
    try {
      return await this.settingsRepository.findAndPaginate(user, {
        pageOptionsDto,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Finds a single setting based on the provided filter and common query fields.
   *
   * @param {User} user The user performing the operation.
   * @param {FilterQuery<Setting>} filter - the filter to apply when searching for the setting
   * @param {CommonQueryFieldsDto} commonQueryDto - common query fields used for the search
   * @return {Promise<Setting>} the setting that was found
   * @throws {DetailedBadRequestException} If there is an error retrieving the setting.
   */
  async findOne(
    user: User,
    filter: FilterQuery<Setting>,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Partial<Setting>> {
    return await this.settingsRepository.findOneByFilter(
      user,
      filter,
      commonQueryDto,
    );
  }

  /**
   * Updates a setting with the given id.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The id of the setting to update.
   * @param {UpdateSettingDto} updateSettingDto - The data to update the setting with.
   * @return {Promise<Setting>} The updated setting.
   * @throws {DetailedBadRequestException} If there is an error updating the setting.
   * @throws {DetailedNotFoundException} If the setting is not found.
   */
  async update(
    user: User,
    id: number,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const toUpdate = await this.settingsRepository.findOneOrThrow(user, {
      filter: {
        id,
      },
      populateOptions: ['*'],
    });

    try {
      this.em.assign(toUpdate, updateSettingDto, {
        mergeObjectProperties: false,
      });
      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return toUpdate;
  }

  /**
   * Update a setting's revision in the database.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - the id of the setting
   * @param {UpdateSettingDto} updateSettingDto - the data to update the setting with
   * @return {Promise<Setting>} the updated setting
   * @throws {DetailedNotFoundException} if the setting is not found
   * @throws {DetailedBadRequestException} if there is an error updating the setting
   */
  async updateRevision(
    user: User,
    id: number,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const existingSetting = await this.findExistingSetting(user, id);

    const newSetting = await this.createSettingRevision(
      user,
      existingSetting,
      updateSettingDto,
    );

    await this.updateAssociatedServices(user, existingSetting, newSetting);

    try {
      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }

    return newSetting;
  }

  private async findExistingSetting(user: User, id: number): Promise<Setting> {
    const existingSetting = await this.settingsRepository.findOneOrThrow(user, {
      filter: {
        id,
      },
      populateOptions: ['type', 'idx'],
    });

    const revisionIdx = existingSetting.idx;
    const lastSettingRevision = await this.settingsRepository.findOne(
      { idx: revisionIdx },
      { orderBy: { revision: QueryOrder.DESC } },
    );

    if (!lastSettingRevision) {
      throw new DetailedNotFoundException([
        {
          details: `Setting not found for filter: {idx: ${revisionIdx}}`,
          resourceId: `${revisionIdx}`,
          resourceName: 'Setting',
        },
      ]);
    }

    return existingSetting;
  }

  private async createSettingRevision(
    user: User,
    existingSetting: Setting,
    updateSettingDto: UpdateSettingDto,
  ): Promise<Setting> {
    const newRevision = existingSetting.revision + 1;
    const {
      id: _id,
      createdAt: _createdAt,
      updatedAt: _updatedAt,
      user: _user,
      ...partialExistingSetting
    } = existingSetting;
    const newSetting = this.settingsRepository.create({
      ...partialExistingSetting,
      user,
      ...HelperService.getInitialEntityFields(),
    });
    try {
      this.em.assign(newSetting, {
        ...partialExistingSetting,
        ...updateSettingDto,
        revision: newRevision,
        isDeleted: false,
        deletedAt: null,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    this.em.persist(newSetting);

    return newSetting;
  }

  private async updateAssociatedServices(
    user: User,
    existingSetting: Setting,
    newSetting: Setting,
  ): Promise<void> {
    const revisionIdx = existingSetting.idx;
    const existingServices = await this.servicesRepository.find(
      {
        settings: { idx: revisionIdx },
      },
      {
        populate: ['settings'],
        filters: { [WITH_USER_FILTER_NAME]: { user } },
      },
    );

    for (const service of existingServices) {
      if (!service.settings.isInitialized()) {
        await service.settings.init();
      }
      await service.settings.loadItems();

      service.settings.remove((setting) => setting.idx === revisionIdx);
      service.settings.add(newSetting);
      this.em.persist(service);
    }

    this.em.persist(existingServices);
  }

  /**
   * Finds revisions based on the given ID and page options.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the setting to find revisions for.
   * @param {PageOptionsDto} pageOptionsDto - The page options for pagination and sorting.
   * @return {Promise<PageDto<Setting>>} - A promise that resolves to a PageDto containing the requested revisions.
   * @throws {DetailedNotFoundException} If the setting is not found.
   */
  async findRevisions(
    user: User,
    id: number,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Setting>> {
    return await this.settingsRepository.findRevisions(
      user,
      id,
      pageOptionsDto,
    );
  }

  /**
   * Retrieves a specific revision of a setting based on the given ID and revision number.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the setting.
   * @param {number} revision - The revision number of the setting.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields to filter the setting.
   * @return {Promise<Setting>} A promise that resolves to the retrieved setting.
   * @throws {DetailedNotFoundException} If the setting is not found.
   */
  async getRevision(
    user: User,
    id: number,
    revision: number,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Partial<Setting>> {
    const data = await this.settingsRepository.getRevision(
      user,
      id,
      revision,
      commonQueryDto,
    );

    return extractFieldsFromData(
      data,
      commonQueryDto.extractFields,
    ) as Partial<Setting>;
  }

  /**
   * Removes a Setting by its ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - the ID of the Setting to remove
   * @return {Promise<Setting>} the removed Setting
   * @throws {DetailedNotFoundException} if the Setting is not found
   * @throws {DetailedBadRequestException} if the Setting cannot be removed
   */
  remove(user: User, id: number): Promise<Setting> {
    return this.settingsRepository.findAndDelete(user, { id });
  }

  /**
   * Soft deletes a setting by its ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the setting to be soft deleted.
   * @return {Promise<Setting>} - A promise that resolves to the soft deleted setting.
   * @throws {DetailedNotFoundException} - If the setting is not found.
   * @throws {DetailedBadRequestException} - If the setting cannot be soft deleted.
   */
  softRemove(user: User, id: number): Promise<Setting> {
    return this.settingsRepository.findAndSoftDelete(user, { id });
  }

  /**
   * Restore a setting by its ID.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the setting to be restored
   * @return {Promise<Setting>} A Promise that resolves to the restored setting
   * @throws {DetailedNotFoundException} If the setting is not found
   * @throws {DetailedBadRequestException} If the setting cannot be restored
   */
  restore(user: User, id: number): Promise<Setting> {
    return this.settingsRepository.findAndRestore(user, { id });
  }

  async getEntitiesDiff(
    user: User,
    fromID: number,
    toID: number,
    entityDiffFieldsDto: EntityDiffFieldsDto,
    commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.settingsRepository.getEntitiesDiff(
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
    return this.settingsRepository.getEntityRevisionsDiff(
      user,
      id,
      entityDiffFieldsDto,
      commonQueryDto,
    );
  }
}
