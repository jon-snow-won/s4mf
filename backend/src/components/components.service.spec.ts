import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsService } from './components.service';
import {
  mockComponent,
  mockComponentsRepository,
  mockConfigService,
  mockFile,
  mockFilesService,
  mockMulter,
  mockPageMetaDto,
  mockPageOptions,
  mockUpdateComponentDto,
  mockUser,
} from '@mocks';
import { ConfigService } from '@nestjs/config';
import { FilesService } from '../files/files.service';
import { ComponentsRepository } from './components.repository';
import { NotFoundException } from '@nestjs/common';

describe('ComponentsService', () => {
  let service: ComponentsService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ComponentsService,
        {
          provide: ComponentsRepository,
          useValue: mockComponentsRepository,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: FilesService,
          useValue: mockFilesService,
        },
      ],
    }).compile();

    service = module.get<ComponentsService>(ComponentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when creating component', () => {
    it('should throw if component exists', async () => {
      mockComponentsRepository.getOne.mockResolvedValue(mockComponent);

      await expect(
        service.createComponent(mockComponent, mockUser),
      ).rejects.toThrow();
    });

    it('should not throw if component not exists', async () => {
      mockComponentsRepository.getOne.mockResolvedValue(null);

      await expect(
        service.createComponent(mockComponent, mockUser),
      ).resolves.not.toThrow();
    });

    it('should return new component and empty files array if no file input', () => {
      mockComponentsRepository.getOne.mockResolvedValue(null);
      mockComponentsRepository.save.mockResolvedValue(mockComponent);

      expect(service.createComponent(mockComponent, mockUser)).resolves.toEqual(
        {
          savedComponent: mockComponent,
          uploadedFiles: [],
        },
      );
    });
    it('should return new component and uploaded files array if file provided', () => {
      mockComponentsRepository.getOne.mockResolvedValue(null);
      mockComponentsRepository.createComponent.mockResolvedValue(mockComponent);

      expect(
        service.createComponent(mockComponent, mockUser, mockMulter),
      ).resolves.toEqual({
        savedComponent: mockComponent,
        uploadedFiles: [mockFile],
      });
    });
  });

  describe('when getting all components', () => {
    it('should return components', async () => {
      mockComponentsRepository.getPaginatedList.mockResolvedValue({
        data: [mockComponent],
        meta: mockPageMetaDto,
      });
      const componentsList = await service.findAll({}, mockPageOptions);

      expect(componentsList).toEqual({
        data: [mockComponent],
        meta: mockPageMetaDto,
      });
    });
  });

  describe('when getting one component', () => {
    it('should throw if id is incorrect', async () => {
      mockComponentsRepository.findOneOrFail.mockRejectedValue(
        new NotFoundException(''),
      );
      await expect(service.findOneById(mockComponent.id)).rejects.toThrow();
    });

    it('should not throw if id is correct', async () => {
      mockComponentsRepository.findOneOrFail.mockResolvedValue(mockComponent);
      await expect(
        service.findOneById(mockComponent.id),
      ).resolves.not.toThrow();
    });

    it('should return component if id is correct', async () => {
      mockComponentsRepository.findOneOrFail.mockResolvedValue(mockComponent);
      await expect(service.findOneById(mockComponent.id)).resolves.toEqual(
        mockComponent,
      );
    });
  });

  describe('when deleting component', () => {
    it('should throw if id is incorrect', () => {
      mockComponentsRepository.findOneOrFail.mockImplementationOnce(() => {
        throw new NotFoundException('');
      });

      expect(service.removeComponent(mockComponent.id)).rejects.toThrow();
    });

    it('should not throw if id correct', () => {
      mockComponentsRepository.getOne.mockResolvedValue(mockComponent);

      expect(service.removeComponent(mockComponent.id)).resolves.not.toThrow();
    });

    it('should call processing methods', async () => {
      mockComponentsRepository.getOne.mockResolvedValue(mockComponent);
      await service.removeComponent(mockComponent.id);
      expect(mockFilesService.removeFilesByComponent).toHaveBeenCalled();
      expect(mockComponentsRepository.removeComponent).toHaveBeenCalled();
    });
  });

  describe('when updating component', () => {
    it('should throw if id is incorrect', async () => {
      mockComponentsRepository.updateComponent.mockRejectedValue(
        new NotFoundException(''),
      );

      await expect(
        service.updateComponent(mockComponent.id, mockUpdateComponentDto),
      ).rejects.toThrow();
    });

    it('should return updated component', async () => {
      const updatedComponent = Object.assign(
        {},
        mockComponent,
        mockUpdateComponentDto,
      );
      mockComponentsRepository.updateComponent.mockResolvedValue(
        updatedComponent,
      );

      await expect(
        service.updateComponent(mockComponent.id, mockUpdateComponentDto),
      ).resolves.toEqual(updatedComponent);
    });
  });
});
