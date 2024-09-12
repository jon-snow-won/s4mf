import { Test, TestingModule } from '@nestjs/testing';
import { FilesController } from './files.controller';
import {
  mockComponent,
  mockFile,
  mockFilesService,
  mockMulter,
  mockPageMetaDto,
  mockPageOptions,
  mockRequestWithUser,
} from '@mocks';
import { FilesService } from './files.service';

describe('FilesController', () => {
  let controller: FilesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilesController],
      providers: [{ provide: FilesService, useValue: mockFilesService }],
    }).compile();

    controller = module.get<FilesController>(FilesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getFilesList', () => {
    it('should return file list', async () => {
      const func = mockFilesService.getListFromDB;
      func.mockResolvedValue({
        data: [mockFile],
        meta: mockPageMetaDto,
      });
      const result = await controller.getFilesList(mockPageOptions);
      expect(func).toHaveBeenCalled();
      expect(result).toEqual({
        data: [mockFile],
        meta: mockPageMetaDto,
      });
    });
  });

  describe('uploadFile', () => {
    it('should return file', async () => {
      const func = mockFilesService.uploadFile;
      func.mockResolvedValue([mockFile]);
      const result = await controller.uploadFile(
        mockRequestWithUser,
        { file: mockMulter, componentId: mockComponent.id },
        mockMulter,
      );
      expect(func).toHaveBeenCalled();
      expect(result).toEqual([mockFile]);
    });
  });

  describe('deleteFile', () => {
    it('should delete file', async () => {
      const func = mockFilesService.removeFileByName;
      await controller.deleteFile('test');
      expect(func).toHaveBeenCalled();
    });
  });
});
