import { Injectable, Logger } from '@nestjs/common';
import { CreateComponentDto } from './dto/create-component.dto';
import { UpdateComponentDto } from './dto/update-component.dto';
import { Component } from './entities/component.entity';
import { FilesService } from '../files/files.service';
import { User } from '../users/entities/user.entity';
import { EntityManager, FilterQuery, wrap } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '../common/repositories/base.repository';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { PageDto } from '../common/dtos/page.dto';
import { ConflictResourceException } from '../common/exceptions/conflict-resource.exception';
import { CreateComponentResponseDto } from './dto/create-component-response.dto';
import { HelperService } from '../common/helpers/helpers.utils';

@Injectable()
export class ComponentsService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Component)
    private readonly componentsRepository: BaseRepository<Component>,
    private readonly filesService: FilesService,
  ) {}

  private readonly logger: Logger = new Logger(ComponentsService.name);

  /**
   * Create a new component.
   *
   * @param {CreateComponentDto} createComponentDto - the data to create the component
   * @param {User} user - the user creating the component
   * @return {Promise<Component>} the newly created component
   * @throws {DetailedBadRequestException} if the component could not be created
   */
  private async createAndSave(
    createComponentDto: CreateComponentDto,
    user: User,
  ): Promise<Component> {
    const component = new Component({
      ...createComponentDto,
      user,
    });
    try {
      await this.em.persistAndFlush(component);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return component;
  }

  /**
   * Finds and returns a single component based on the provided filter and common query fields.
   *
   * @param {User} user The user performing the operation.
   * @param {FilterQuery<Component>} filter - The filter to apply when searching for the component.
   * @param {CommonQueryFieldsDto} commonQueryDto - The common query fields to use when searching for the component.
   * @return {Promise<Component>} A promise that resolves to the found component.
   * @throws {DetailedNotFoundException} If the component is not found.
   */
  async findOne(
    user: User,
    filter: FilterQuery<Component>,
    commonQueryDto: CommonQueryFieldsDto,
  ): Promise<Component> {
    return await this.componentsRepository.findOneByFilter(
      user,
      filter,
      commonQueryDto,
    );
  }

  /**
   * Asynchronous method to create a component.
   *
   * @param {CreateComponentDto} createComponentDto - The data transfer object for creating the component.
   * @param {User} user The user performing the operation.
   * @param {Express.Multer.File} file - Optional file object from Express Multer.
   * @returns {Promise<{ uploadedFilesCount: number; id: number }>} An object containing the ID of the saved component and the number of uploaded files.
   * @throws {ConflictResourceException} If a component with the same name already exists.
   * @throws {DetailedBadRequestException} If the component could not be created.
   */
  async createComponent(
    createComponentDto: CreateComponentDto,
    user: User,
    file?: Express.Multer.File,
  ): Promise<CreateComponentResponseDto> {
    this.logger.log(
      `createComponent('${createComponentDto.name}', '${user.email}', '${file?.originalname}')`,
    );

    const existingComponent = await this.componentsRepository.findOne({
      name: createComponentDto.name,
    });

    if (existingComponent) {
      throw new ConflictResourceException([
        {
          description: `There is already component with this name. ID: ${existingComponent.id}`,
          conflictResourceId: existingComponent.id.toString(),
          conflictResourceName: 'Component',
        },
      ]);
    }

    const savedComponent = await this.createAndSave(createComponentDto, user);

    let uploadedFiles = { uploadedFilesCount: 0 };
    if (file) {
      uploadedFiles = await this.filesService.uploadFile(
        file,
        { componentId: savedComponent.id },
        user,
      );
    }

    return new CreateComponentResponseDto({
      component: savedComponent,
      uploadedFilesCount: uploadedFiles.uploadedFilesCount,
    });
  }

  /**
   * Retrieves all components based on the specified pagination options.
   *
   * @param {User} user The user performing the operation.
   * @param {PageOptionsDto} pageOptionsDto - The pagination options.
   * @returns {Promise<PageDto<Component>>} - A promise that resolves to the page of components.
   * @throws {DetailedBadRequestException} - If there is an error retrieving the components.
   */
  async findAll(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Component>> {
    try {
      return await this.componentsRepository.findAndPaginate(user, {
        pageOptionsDto,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Updates a component with the specified ID using the provided data.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the component to update.
   * @param {UpdateComponentDto} updateComponentDto - The data to update the component with.
   * @return {Promise<Component>} - A promise that resolves to the updated component.
   * @throws {DetailedBadRequestException} - If there is an error updating the component.
   * @throws {DetailedNotFoundException} - If the component is not found.
   */
  async updateComponent(
    user: User,
    id: number,
    updateComponentDto: UpdateComponentDto,
  ): Promise<Component> {
    this.logger.debug(
      `updateComponent(${id}, ${HelperService.objectToString(updateComponentDto)})`,
    );
    const toUpdate = await this.componentsRepository.findOneOrThrow(user, {
      filter: { id },
    });
    try {
      wrap(toUpdate).assign(updateComponentDto);
      await this.em.persistAndFlush(toUpdate);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return toUpdate;
  }

  /**
   * Removes a component from the repository with associated files.
   *
   * @param {User} user The user performing the operation.
   * @param {number} id - The ID of the component to remove.
   * @returns {Promise<Component>} - A promise that resolves to the removed component.
   *
   * This method removes a component from a repository. It logs debug and deletion actions, removes associated files, and then deletes the component from the repository.
   */
  async removeComponent(user: User, id: number): Promise<Component> {
    this.logger.debug(`removeComponent('${id}')`);
    const component = await this.componentsRepository.findOneOrThrow(user, {
      filter: {
        id,
      },
    });
    this.logger.log(
      `Deleting component '${component.name}' with id '${component.id}'`,
    );

    await this.filesService.removeFilesByComponent(user, id);
    return this.componentsRepository.findAndDelete(user, component);
  }
}
