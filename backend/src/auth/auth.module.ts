import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { UsersService } from '../users/users.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { SystemModule } from '../system/system.module';

@Module({
  imports: [
    UsersModule,
    ConfigModule,
    SystemModule,
    MikroOrmModule.forFeature([User]),
  ],
  providers: [AuthService, UsersService],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
