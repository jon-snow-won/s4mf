import { Module } from '@nestjs/common';
import { ComponentsService } from './components.service';
import { ComponentsController } from './components.controller';
import { Component } from './entities/component.entity';
import { File } from '../files/entities/file.entity';
import { FilesModule } from '../files/files.module';
import { S3Module } from '../s3/s3.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';

@Module({
  imports: [
    FilesModule,
    S3Module,
    MikroOrmModule.forFeature([Component, File]),
  ],
  providers: [ComponentsService],
  controllers: [ComponentsController],
  exports: [ComponentsService],
})
export class ComponentsModule {}
