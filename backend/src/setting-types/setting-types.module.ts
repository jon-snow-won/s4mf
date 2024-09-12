import { Module } from '@nestjs/common';
import { SettingTypesService } from './setting-types.service';
import { SettingTypesController } from './setting-types.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { SettingType } from './entities/setting-type.entity';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, MikroOrmModule.forFeature([SettingType])],
  controllers: [SettingTypesController],
  providers: [SettingTypesService],
})
export class SettingTypesModule {}
