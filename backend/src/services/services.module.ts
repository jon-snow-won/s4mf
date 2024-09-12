import { Module } from '@nestjs/common';
import { ServicesService } from './services.service';
import { ServicesController } from './services.controller';
import { Service } from './entities/service.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Structure } from '../structures/entities/structures.entity';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    MikroOrmModule.forFeature([Service, Structure]),
  ],
  controllers: [ServicesController],
  providers: [ServicesService],
})
export class ServicesModule {}
