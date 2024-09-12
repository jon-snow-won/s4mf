import { Injectable, Logger } from '@nestjs/common';
import { File } from './entities/file.entity';
import { User } from '../users/entities/user.entity';
import { S3Service } from '../s3/s3.service';
import * as yauzl from 'yauzl-promise';
import { lookup } from 'mime-types';
import { buffer } from 'node:stream/consumers';
import { NewFileDto } from './dto/new-file.dto';
import { ProcessFileDto } from './dto/process-file.dto';
import { EntityManager, wrap } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from '../common/repositories/base.repository';
import { Component } from '../components/entities/component.entity';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { PageDto } from '../common/dtos/page.dto';
import { Readable } from 'stream';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { ConflictResourceException } from '../common/exceptions/conflict-resource.exception';
import { HelperService } from '../common/helpers/helpers.utils';

@Injectable()
export class FilesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(File)
    private readonly filesRepository: BaseRepository<File>,
    @InjectRepository(Component)
    private readonly componentsRepository: BaseRepository<Component>,
    private readonly s3Service: S3Service,
  ) {}

  private readonly logger: Logger = new Logger(FilesService.name);

  private async getFileFromDB(name: string, componentId: number) {
    this.logger.debug(`getFileFromDB('${name}', ${componentId})`);
    const component = await this.componentsRepository.findOne(
      {
        id: componentId,
        files: { name },
      },
      { populate: ['$infer'] },
    );

    if (!component) {
      return null;
    }

    if (component.files.getItems().length > 1) {
      throw new ConflictResourceException([
        {
          description: `There are multiple files with name '${name}' in component '${component.name}'. Data was edited without bff logic. Can't process further.`,
          conflictResourceId: name,
          conflictResourceName: 'File',
        },
      ]);
    }

    return component.files.getItems()[0];
  }

  /**
   * Process the file, upload it to S3, and update/create the file in the database.
   *
   * @param {NewFileDto} file - The file to be processed
   * @param {ProcessFileDto} uploadFileDto - DTO containing information about the file to be processed
   * @param {User} user - The user performing the file processing
   * @return {Promise<File>} The processed file
   * @throws {DetailedNotFoundException} If the component is not found
   * @throws {DetailedBadRequestException} If the file cannot be processed
   */
  private async processFile(
    file: NewFileDto,
    uploadFileDto: ProcessFileDto,
    user: User,
  ): Promise<File> {
    this.logger.debug(
      `processFile('${file.name}', ${HelperService.objectToString(uploadFileDto)}, '${
        user.email
      }'`,
    );
    const component = await this.componentsRepository.findOne({
      id: uploadFileDto.componentId,
    });

    if (!component) {
      throw new DetailedNotFoundException([
        {
          details: `No component with this componentId: ${uploadFileDto.componentId}`,
          resourceId: uploadFileDto.componentId.toString(),
          resourceName: 'Component',
        },
      ]);
    }

    const metaData = {
      'Content-Type': file.mimeType,
    };
    const fileNameWithComponent = `${component.name}/${file.name}`;

    await this.s3Service.putObject(
      fileNameWithComponent,
      file.buffer,
      metaData,
    );

    const fileFromDB = await this.getFileFromDB(
      fileNameWithComponent,
      uploadFileDto.componentId,
    );
    if (!fileFromDB) {
      return await this.createFile(fileNameWithComponent, uploadFileDto, user);
    } else {
      return await this.updateFile(fileFromDB, fileNameWithComponent);
    }
  }

  /**
   * Find all files from the database based on the given page options.
   *
   * @param {User} user The user performing the operation.
   * @param {PageOptionsDto} pageOptionsDto - the options for pagination and filtering
   * @return {Promise<PageDto<File>>} a promise that resolves to a paginated list of files
   * @throws {DetailedBadRequestException} if there is an error finding the files
   */
  async findAllFromDB(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<File>> {
    try {
      return await this.filesRepository.findAndPaginate(user, {
        pageOptionsDto,
      });
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  /**
   * Retrieves a file with the given fileName from the S3 service and returns a readable stream.
   *
   * @param {string} fileName - The name of the file to retrieve.
   * @return {Promise<{ stream: Readable }>} A promise that resolves to an object containing a readable stream.
   * @throws {DetailedNotFoundException} - If the file is not found.
   */
  async getFile(fileName: string): Promise<{ stream: Readable }> {
    this.logger.log(`getFile('${fileName}')`);
    const stream = await this.s3Service.getObject(fileName);
    return { stream };
  }

  /**
   * Uploads a file and processes it based on the provided data.
   *
   * @param {Express.Multer.File} file - the file to upload
   * @param {ProcessFileDto} processFileDto - data for processing the file
   * @param {User} user - the user uploading the file
   * @return {Promise<UploadFileResponseDto>} the result of the upload operation
   * @throws {DetailedBadRequestException} if the file cannot be processed
   */
  async uploadFile(
    file: Express.Multer.File,
    processFileDto: ProcessFileDto,
    user: User,
  ): Promise<UploadFileResponseDto> {
    this.logger.debug(
      `uploadFile('${file.originalname}', '${HelperService.objectToString(
        processFileDto,
      )}', '${user.email}')`,
    );

    const [, extension] = file.originalname.split('.');

    if (extension === 'zip') {
      return this.uploadZip(file, processFileDto, user);
    }

    const newFile: NewFileDto = {
      name: file.originalname,
      mimeType: file.mimetype,
      buffer: file.buffer,
    };

    await this.processFile(newFile, processFileDto, user);

    return new UploadFileResponseDto({ uploadedFilesCount: 1 });
  }

  /**
   * Uploads a zip file and processes each file inside it.
   *
   * @param {Express.Multer.File} file - The zip file to upload.
   * @param {ProcessFileDto} processFileDto - The DTO containing information about how to process the files.
   * @param {User} user - The user uploading the file.
   * @return {Promise<{ uploaded: number }>} - A promise that resolves to an object with the number of files uploaded.
   */
  private async uploadZip(
    file: Express.Multer.File,
    processFileDto: ProcessFileDto,
    user: User,
  ): Promise<UploadFileResponseDto> {
    this.logger.debug(
      `uploadZip('${file.originalname}', '${HelperService.objectToString(
        processFileDto,
      )}', '${user.email}')`,
    );

    const zip = await yauzl.fromBuffer(file.buffer);
    const processedFileList: File[] = [];

    const processEntry = async (entry: yauzl.Entry) => {
      const fileName = entry.filename;
      if (!fileName.endsWith('/')) {
        this.logger.debug(`Processing file inside zip: '${fileName}'`);

        const readStream = await entry.openReadStream();
        const fileBuffer = await buffer(readStream);
        const mimeType = lookup(fileName).toString();

        const newFile: NewFileDto = {
          name: fileName,
          mimeType,
          buffer: fileBuffer,
        };

        const processedFile = await this.processFile(
          newFile,
          processFileDto,
          user,
        );

        processedFileList.push(processedFile);
      }
    };

    const processEntries = async () => {
      for (const entry of await zip.readEntries()) {
        await processEntry(entry);
      }
    };

    await processEntries();

    return new UploadFileResponseDto({
      uploadedFilesCount: processedFileList.length,
    });
  }

  /**
   * Removes a file with the given name from the system.
   *
   * @param {User} user The user performing the operation.
   * @param {string} fileName - The name of the file to be removed.
   * @return {Promise<File>} A promise that resolves to the removed file.
   * @throws {DetailedNotFoundException} If the file is not found.
   * @throws {DetailedBadRequestException} If the file cannot be removed.
   */
  async removeFileByName(user: User, fileName: string): Promise<File> {
    this.logger.debug(`removeFileByName('${fileName}')`);

    await this.s3Service.removeObject(fileName);
    return this.filesRepository.findAndDelete(user, { name: fileName });
  }

  /**
   * Removes files associated with a given component.
   *
   * @param {User} user The user performing the operation.
   * @param {number} componentId - The ID of the component.
   * @return {Promise<void>} A promise that resolves when the files are removed.
   * @throws {DetailedNotFoundException} If the component is not found.
   */
  async removeFilesByComponent(user: User, componentId: number): Promise<void> {
    this.logger.debug(`removeFilesByComponent(${componentId})`);

    const component = await this.componentsRepository.findOneOrThrow(user, {
      filter: {
        id: componentId,
      },
      populateOptions: ['files'],
    });
    const files = await component.files.loadItems();
    for (const file of files) {
      await this.s3Service.removeObject(file.name);
      await this.em.remove(file).flush();
    }
  }

  /**
   * Create a new file with the given name and information, associate it with the specified component, and return the newly created file.
   *
   * @param {string} name - The name of the file to be created.
   * @param {ProcessFileDto} uploadFileDto - The data transfer object containing information about the file to be uploaded.
   * @param {User} user - The user object associated with the creation of the file.
   * @return {Promise<File>} The newly created file object.
   * @throws {DetailedNotFoundException} If the component is not found.
   * @throws {DetailedBadRequestException} If the file cannot be created.
   */
  async createFile(
    name: string,
    uploadFileDto: ProcessFileDto,
    user: User,
  ): Promise<File> {
    const component = await this.componentsRepository.findOneOrThrow(user, {
      filter: {
        id: uploadFileDto.componentId,
      },
    });

    const newFile = this.filesRepository.create({
      name,
      user,
      ...HelperService.getInitialEntityFields(),
    });
    component.files.add(newFile);
    try {
      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }

    return newFile;
  }

  /**
   * Updates a file with a new name.
   *
   * @param {File} file - The file to be updated.
   * @param {string} name - The new name for the file.
   * @return {Promise<File>} The updated file.
   * @throws {DetailedBadRequestException} If the file cannot be updated.
   */
  async updateFile(file: File, name: string): Promise<File> {
    try {
      wrap(file).assign({ name });
      await this.em.persistAndFlush(file);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return file;
  }

  async removeByName(user: User, name: string) {
    return this.filesRepository.findAndDelete(user, { name });
  }
}
