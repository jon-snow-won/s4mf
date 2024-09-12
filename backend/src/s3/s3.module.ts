import { Module } from '@nestjs/common';
import { S3Service } from './s3.service';
import { MinioModule } from 'nestjs-minio-client';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    MinioModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return {
          endPoint: config.get('S3_HOST', 'localhost'),
          port: Number(config.get('S3_PORT', '9000')),
          useSSL: false,
          region: 'ru',
          accessKey: config.get('S3_ACCESS_KEY_ID', 's3-key-id'),
          secretKey: config.get('S3_SECRET_ACCESS_KEY', 's3-access-key'),
        };
      },
    }),
  ],
  providers: [S3Service],
  exports: [S3Service],
})
export class S3Module {}
