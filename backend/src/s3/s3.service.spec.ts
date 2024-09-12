import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';
import { MinioService } from 'nestjs-minio-client';
import {
  mockConfigService,
  mockFile,
  mockMinioClient,
  mockMinioService,
  mockMulter,
  mockS3File,
} from '@mocks';
import { ConfigService } from '@nestjs/config';

describe('S3Service', () => {
  let service: S3Service;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        S3Service,
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MinioService, useValue: mockMinioService },
      ],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('when checking object existence', () => {
    it('should return false if there is no object', async () => {
      mockMinioClient.statObject.mockRejectedValue(null);
      expect(await service.isObjectExists(mockFile.name, 'test')).toEqual(
        false,
      );
    });

    it('should return true if there is object', async () => {
      mockMinioClient.statObject.mockResolvedValue(mockS3File);
      expect(await service.isObjectExists(mockFile.name, 'test')).toEqual(true);
    });
  });

  describe('when putting object', () => {
    it('should call putObject method', async () => {
      await service.putObject(
        mockMulter.originalname,
        mockMulter.buffer,
        {},
        'test',
      );
      expect(mockMinioClient.putObject).toHaveBeenCalled();
    });
  });

  describe('when removing object', () => {
    it('should should call removeObject method', async () => {
      await service.removeObject(mockFile.name, 'test');
      expect(mockMinioClient.removeObject).toHaveBeenCalled();
    });
  });
});
