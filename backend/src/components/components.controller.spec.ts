import { Test, TestingModule } from '@nestjs/testing';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';
import {
  mockComponent,
  mockComponentsService,
  mockCreateComponentRo,
  mockMulter,
  mockRequestWithUser,
  mockUpdateComponentDto,
} from '@mocks';
import { CreateComponentWithFilesDto } from './dto/create-component-with-files.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { DeleteResult } from 'typeorm';

describe('ComponentsController', () => {
  let controller: ComponentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ComponentsController],
      providers: [
        { provide: ComponentsService, useValue: mockComponentsService },
      ],
    }).compile();

    controller = module.get<ComponentsController>(ComponentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should return created component', async () => {
      const func = mockComponentsService.createComponent;
      func.mockResolvedValue(mockCreateComponentRo);

      const result = await controller.create(
        {} as CreateComponentWithFilesDto,
        mockRequestWithUser as RequestWithUser,
        mockMulter,
      );

      expect(func).toHaveBeenCalled();
      expect(result).toEqual(mockCreateComponentRo);
    });
  });

  describe('findOne', () => {
    it('should return component', async () => {
      const func = mockComponentsService.findOneById;
      func.mockResolvedValue(mockComponent);

      const result = await controller.findOne('1');

      expect(func).toHaveBeenCalled();
      expect(result).toEqual(mockComponent);
    });
  });

  describe('update', () => {
    it('should return updated component', async () => {
      const func = mockComponentsService.updateComponent;
      const updatedComponent = Object.assign(
        {},
        mockComponent,
        mockUpdateComponentDto,
      );
      func.mockResolvedValue(updatedComponent);

      const result = await controller.update(mockUpdateComponentDto, '1');

      expect(func).toHaveBeenCalled();
      expect(result).toEqual(updatedComponent);
    });
  });

  describe('remove', () => {
    it('should return deleted result', async () => {
      const func = mockComponentsService.removeComponent;
      const deleteResult: DeleteResult = { raw: null, affected: 1 };
      func.mockResolvedValue(deleteResult);

      const result = await controller.remove('1');

      expect(func).toHaveBeenCalled();
      expect(result).toEqual(deleteResult);
    });
  });
});
