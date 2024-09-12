import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ConfigModule } from '@nestjs/config';
import { SystemModule } from '../system/system.module';
import { System } from '../system/entities/system.entity';

@Module({
  imports: [
    ConfigModule,
    SystemModule,
    MikroOrmModule.forFeature([User, System]),
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
