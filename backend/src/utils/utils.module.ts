import { Module } from '@nestjs/common';
import { UtilsController } from './utils.controller';
import { UtilsService } from './utils.service';
import { S3Module } from '../s3/s3.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [S3Module, ConfigModule],
  controllers: [UtilsController],
  providers: [UtilsService],
})
export class UtilsModule {}
