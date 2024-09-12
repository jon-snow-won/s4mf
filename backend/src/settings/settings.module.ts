import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { Setting } from './entities/settings.entity';
import { Service } from '../services/entities/service.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule, MikroOrmModule.forFeature([Setting, Service])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
