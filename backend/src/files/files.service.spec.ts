import { Test, TestingModule } from '@nestjs/testing';
import { FilesService } from './files.service';
import { ConfigService } from '@nestjs/config';
import { S3Service } from '../s3/s3.service';
import { Readable } from 'stream';
import {
  mockMulter,
  mockComponentRepo,
  mockConfigService,
  mockFile,
  mockFileRepo,
  mockPageMetaDto,
  mockPageOptions,
  mockS3Service,
  mockUser,
  mockComponent,
  mockZipMulter,
  mockFilesRepository,
  mockComponentsRepository,
} from '@mocks';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { FilesRepository } from './files.repository';
import { ComponentsRepository } from '../components/components.repository';

describe('FilesService', () => {
  let filesService: FilesService;
  let fileContents: string;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        { provide: FilesRepository, useValue: mockFilesRepository },
        { provide: ComponentsRepository, useValue: mockComponentsRepository },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: S3Service, useValue: mockS3Service },
        { provide: PageMetaDto, useValue: mockPageMetaDto },
      ],
    }).compile();

    filesService = module.get<FilesService>(FilesService);

    fileContents = 'Test File';
  });

  it('should be defined', () => {
    expect(filesService).toBeDefined();
  });

  describe('when getting file list', () => {
    it('should return array with files', async () => {
      mockFilesRepository.getPaginatedList.mockResolvedValue({
        data: [mockFile],
        meta: mockPageMetaDto,
      });
      const filesList = await filesService.getListFromDB(mockPageOptions);
      expect(filesList).toEqual({
        data: [mockFile],
        meta: mockPageMetaDto,
      });
    });
  });

  describe('when getting file', () => {
    it('should throw exception if file not exists', async () => {
      mockS3Service.getObject.mockRejectedValue(new Error('File not found'));

      await expect(filesService.getFile(mockFile.name)).rejects.toThrow();
    });

    it('should return the file stream, if file exists', async () => {
      mockS3Service.isObjectExists.mockResolvedValue(true);
      const body = Buffer.from(fileContents);
      const mockReadableStream = Readable.from(body);
      mockS3Service.getObject.mockResolvedValue(mockReadableStream);

      await expect(filesService.getFile(mockFile.name)).resolves.toEqual({
        stream: mockReadableStream,
      });
    });
  });

  describe('when deleting file', () => {
    it('should throw if file not exists', async () => {
      mockS3Service.removeObject.mockImplementationOnce(() => {
        throw new Error('File not found');
      });

      await expect(
        filesService.removeFileByName(mockFile.name),
      ).rejects.toThrow();
    });

    it('should call s3 service method to remove object', async () => {
      await filesService.removeFileByName(mockFile.name);
      expect(mockS3Service.removeObject).toHaveBeenCalled();
    });

    it('should call repository method to delete', async () => {
      await filesService.removeFileByName(mockFile.name);

      expect(mockFilesRepository.removeByCondition).toHaveBeenCalled();
    });
  });

  describe('when deleting files by component', () => {
    it('should not call s3 remove method to if there is no files', async () => {
      mockFileRepo.findBy.mockResolvedValue([]);
      const s3RemoveObject = mockS3Service.removeObject;
      await filesService.removeFilesByComponent(mockComponent.id);
      expect(s3RemoveObject).not.toHaveBeenCalled();
    });
    it('should call s3 remove method for each file', async () => {
      mockFilesRepository.findAll.mockResolvedValue([mockFile, mockFile]);
      const s3RemoveObject = mockS3Service.removeObject;
      await filesService.removeFilesByComponent(mockComponent.id);
      expect(s3RemoveObject).toHaveBeenCalledTimes(2);
    });
    it('should call repo delete method', async () => {
      await filesService.removeFilesByComponent(mockComponent.id);

      expect(mockFilesRepository.removeByCondition).toHaveBeenCalled();
    });
  });

  describe('when uploading non-archive file', () => {
    it('should throw if incorrect component id', async () => {
      mockComponentsRepository.findOneOrFail.mockImplementationOnce(() => {
        throw new NotFoundException('Component not found');
      });

      await expect(
        filesService.uploadFile(mockMulter, { componentId: 0 }, mockUser),
      ).rejects.toThrow(NotFoundException);
    });

    it('should process new single file', async () => {
      mockComponentRepo.findOneBy.mockResolvedValueOnce(mockComponent);
      mockFilesRepository.findOneByNameAndComponent.mockResolvedValue(null);
      mockFilesRepository.createFile.mockResolvedValueOnce(mockFile);

      await expect(
        filesService.uploadFile(
          mockMulter,
          { componentId: mockComponent.id },
          mockUser,
        ),
      ).resolves.toEqual([mockFile]);
    });

    it('should process old single file', async () => {
      mockComponentRepo.findOneBy.mockResolvedValueOnce(mockComponent);
      mockFilesRepository.findOneByNameAndComponent.mockResolvedValue(mockFile);
      mockFilesRepository.updateFile.mockResolvedValueOnce(mockFile);

      await expect(
        filesService.uploadFile(
          mockMulter,
          { componentId: mockComponent.id },
          mockUser,
        ),
      ).resolves.toEqual([mockFile]);
    });
  });

  describe('when uploading archive file', () => {
    it('should throw if zip file is corrupted', async () => {
      mockComponentRepo.findOneBy.mockResolvedValueOnce(mockComponent);
      mockFilesRepository.findOneByNameAndComponent.mockResolvedValueOnce(null);
      const corruptedMockZipMulter = Object.assign({}, mockZipMulter, {
        buffer: Buffer.from('not a zip'),
      });

      await expect(
        filesService.uploadFile(
          corruptedMockZipMulter,
          { componentId: mockComponent.id },
          mockUser,
        ),
      ).rejects.toThrow(BadRequestException);
    });

    it('should process zip file if it is new', async () => {
      mockComponentRepo.findOneBy.mockResolvedValueOnce(mockComponent);
      mockFilesRepository.findOneByNameAndComponent.mockResolvedValueOnce(null);
      mockFilesRepository.createFile.mockResolvedValueOnce(mockFile);

      await expect(
        filesService.uploadFile(
          mockZipMulter,
          { componentId: mockComponent.id },
          mockUser,
        ),
      ).resolves.toEqual([mockFile]);
    });
  });
});
