import { Test, TestingModule } from '@nestjs/testing';
import { KubeController } from './kube.controller';

describe('KubeController', () => {
  let controller: KubeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [KubeController],
    }).compile();

    controller = module.get<KubeController>(KubeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
