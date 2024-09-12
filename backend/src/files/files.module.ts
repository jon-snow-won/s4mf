import { Module } from '@nestjs/common';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule } from '@nestjs/config';
import { File } from './entities/file.entity';
import { S3Module } from '../s3/s3.module';
import { Component } from '../components/entities/component.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    S3Module,
    MikroOrmModule.forFeature({ entities: [File, Component] }),
    ConfigModule,
  ],
  providers: [FilesService],
  controllers: [FilesController],
  exports: [FilesService],
})
export class FilesModule {}
