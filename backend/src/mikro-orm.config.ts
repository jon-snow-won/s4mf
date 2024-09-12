import { ConfigService, registerAs } from '@nestjs/config';
import { config } from 'dotenv';
import { defineConfig } from '@mikro-orm/postgresql';
import { Service } from './services/entities/service.entity';
import { Setting } from './settings/entities/settings.entity';
import { Role } from './roles/entities/role.entity';
import { User } from './users/entities/user.entity';
import { SettingType } from './setting-types/entities/setting-type.entity';
import { Structure } from './structures/entities/structures.entity';
import { Component } from './components/entities/component.entity';
import { File } from './files/entities/file.entity';
import { BaseRepository } from './common/repositories/base.repository';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { System } from 'system/entities/system.entity';

config();

const configService = new ConfigService();
const ormConfig = {
  host: configService.get('DB_HOST'),
  port: configService.get('DB_PORT'),
  user: configService.get('DB_USER'),
  password: configService.get('DB_PASS'),
  dbName: `${configService.get('DB_NAME')}`,
  debug: configService.get('NODE_ENV') !== 'production',
  entities: [
    Service,
    Setting,
    Role,
    User,
    SettingType,
    Structure,
    Component,
    File,
    System,
  ],
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: 'dist/migrations',
    pathTs: 'src/migrations',
    glob: '!(*.d).{ts,js}',
    transactional: true,
    allOrNothing: true,
  },
  seeder: {
    path: 'dist/seeders',
    pathTs: 'src/seeders',
    glob: '!(*.d).{ts,js}',
    defaultSeeder: 'DatabaseSeeder',
    fileName: (className: string) => className,
  },
  autoLoadEntities: true,
  synchronize: true,
  entityRepository: BaseRepository,
  extensions: [Migrator, SeedManager],
};

export const mikroOrmConfig = defineConfig(ormConfig);

export default registerAs('mikroorm', () => mikroOrmConfig);
