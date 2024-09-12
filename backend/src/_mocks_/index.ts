import { createMock } from '@golevelup/ts-jest';
import { AuthService } from '../auth/auth.service';
import { ComponentsService } from '../components/components.service';
import { FilesService } from '../files/files.service';
import { User } from '../users/entities/user.entity';
import { File } from '../files/entities/file.entity';
import { Component } from '../components/entities/component.entity';
import { S3Service } from '../s3/s3.service';
import { ConfigService } from '@nestjs/config';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageMetaDto } from '../common/dtos/page-meta.dto';
import * as AdmZip from 'adm-zip';
import { MinioClient, MinioService } from 'nestjs-minio-client';
import { BucketItemStat } from 'minio';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { UsersService } from '../users/users.service';
import { CreateComponentResponseDto } from '../components/dto/create-component-response.dto';
import { Response } from 'express';
import { Collection, EntityManager } from '@mikro-orm/postgresql';
import { BaseRepository } from '../common/repositories/base.repository';
import { UtilsService } from '../utils/utils.service';
import { Setting } from '../settings/entities/settings.entity';
import { Service } from '../services/entities/service.entity';
import { SettingType } from '../setting-types/entities/setting-type.entity';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { PageDto } from '../common/dtos/page.dto';
import { randomUUID } from 'node:crypto';
import { Role } from '../roles/entities/role.entity';
import { MainBaseEntity } from '../common/entities/main-base.entity';
import { BaseEntity } from '../common/entities/base.entity';
import { PopulateType } from '../common/types/enums/populate-type.enum';

export const mockResponse = createMock<Response>();
export const mockPageOptions: PageOptionsDto = {
  paginateOptions: { page: 1, take: 10, skip: 0 },
  orderOptions: {
    orderBy: 'id:desc',
  },
  populateOptions: {
    populateType: PopulateType.NONE,
    withDeleted: false,
    populateItems: '',
  },
};

export const mockUser: User = {
  id: 0,
  idx: randomUUID(),
  name: 'mockUser',
  email: 'mockUser@email.com',
  roles: ['mockUserRole'],
  rolesOverride: [],
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
  deletedAt: null,
  isAdmin: false,
  isSuperuser: false,
  hasRolesOverride: false,
  hasKubeConfig: false,
  // components: new Collection<Component>([]),
  // files: new Collection<File>([]),
  // settings: new Collection<Setting>([]),
  // structures: new Collection<Structure>([]),
  // services: new Collection<Service>([]),
  revision: 0,
  kubeConfig: '',
};

const mockBaseEntity: BaseEntity = {
  id: 0,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockMainBaseEntity: MainBaseEntity<any> = {
  ...mockBaseEntity,
  idx: randomUUID(),
  revision: 0,
  isDeleted: false,
  deletedAt: null,
};

export const mockRequestWithUser = createMock<RequestWithUser>({
  user: mockUser,
});

export const mockCommonQueryFieldsDto: CommonQueryFieldsDto =
  new CommonQueryFieldsDto();

export const mockCreateUserDto: CreateUserDto = {
  email: mockUser.email,
  name: mockUser.name,
  roles: mockUser.roles,
  rolesOverride: mockUser.rolesOverride,
};

export const mockComponent: Component = {
  ...mockMainBaseEntity,
  idx: randomUUID(),
  name: 'mockComponent',
  description: 'mockComponentDescription',
  user: mockUser,
  files: new Collection<File>([]),
};
export const mockFile: File = {
  ...mockMainBaseEntity,
  idx: randomUUID(),
  name: 'mockFile.js',
  user: mockUser,
};

export const mockS3File: BucketItemStat = {
  size: 1024,
  etag: 'etag',
  lastModified: new Date(),
  metaData: {},
};

export const mockMulter: Express.Multer.File = createMock<Express.Multer.File>({
  filename: 'singleFile.js',
  originalname: 'singleFile.js',
  buffer: Buffer.from('singleFile'),
  size: 1024,
});

export const mockZip = new AdmZip();
mockZip.addFile(mockMulter.filename, mockMulter.buffer);
export const mockZipMulter: Express.Multer.File =
  createMock<Express.Multer.File>({
    filename: 'zipFile.zip',
    originalname: 'zipFile.zip',
    buffer: mockZip.toBuffer(),
    size: 1024,
  });

export const mockSettingType: SettingType = {
  ...mockBaseEntity,
  name: 'mockSettingType',
  pattern: JSON.parse('{"key": "value"}'),
  idx: randomUUID(),
  revision: 0,
  user: mockUser,
};
export const mockSettingRev0: Setting = {
  ...mockMainBaseEntity,
  idx: randomUUID(),
  revision: 0,
  type: mockSettingType,
  extends: [],
  properties: JSON.parse('{"key": "value"}'),
  user: mockUser,
};

export const mockSettingRev1: Setting = {
  ...mockSettingRev0,
  id: 1,
  revision: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
  properties: JSON.parse('{"key2": "value2"}'),
};

export const mockRole: Role = {
  ...mockMainBaseEntity,
  name: 'mockRole',
  description: 'mockRoleDescription',
};

export const mockServiceDescendantRev0: Service = {
  ...mockMainBaseEntity,
  id: 3,
  idx: randomUUID(),
  name: 'mockServiceDescendant',
  description: 'mockServiceDescendantDescription',
  user: mockUser,
  roles: new Collection<Role>([mockRole]),
  type: mockSettingType,
  settings: new Collection<Setting>([mockSettingRev0]),
  descendants: new Collection<Service>([]),
};

export const mockServiceRev0: Service = {
  ...mockMainBaseEntity,
  idx: randomUUID(),
  name: 'mockService',
  description: 'mockServiceDescription',
  user: mockUser,
  roles: new Collection<Role>([mockRole]),
  type: mockSettingType,
  settings: new Collection<Setting>([mockSettingRev0]),
  descendants: new Collection<Service>([mockServiceDescendantRev0]),
};

export const mockConfigService = createMock<ConfigService>();
export const mockAuthService = createMock<AuthService>();
export const mockUsersService = createMock<UsersService>();
export const mockUsersRepository = createMock<BaseRepository<User>>();
export const mockComponentsService = createMock<ComponentsService>();
export const mockComponentsRepository = createMock<BaseRepository<Component>>();
export const mockFilesService = createMock<FilesService>();
export const mockFilesRepository = createMock<BaseRepository<File>>();
export const mockS3Service = createMock<S3Service>();
export const mockMinioClient = createMock<MinioClient>();
export const mockUtilsService = createMock<UtilsService>();
export const mockEntityManager = createMock<EntityManager>();
export const mockSettingsRepository = createMock<BaseRepository<Setting>>();
export const mockServicesRepository = createMock<BaseRepository<Service>>();

export const mockMinioService = createMock<MinioService>({
  get client(): MinioClient {
    return mockMinioClient;
  },
});
export const mockUserRepo = createMock<BaseRepository<User>>();
export const mockFileRepo = createMock<BaseRepository<File>>();
export const mockComponentRepo = createMock<BaseRepository<Component>>();

export const mockPageMetaDto = new PageMetaDto({
  itemCount: 1,
  paginateOptions: mockPageOptions.paginateOptions,
});

export const mockUpdateComponentDto = {
  description: 'newDescription',
};

export const mockCreateComponentRo: CreateComponentResponseDto = {
  component: mockComponent,
  uploadedFilesCount: 0,
};

export const mockSettingPageDto = new PageDto(
  [mockSettingRev0],
  mockPageMetaDto,
);
