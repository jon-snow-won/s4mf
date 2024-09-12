import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { APP_FILTER } from '@nestjs/core';
import { LoggerModule } from 'nestjs-pino';
import { S3Module } from './s3/s3.module';
import { ComponentsModule } from './components/components.module';
import { ExceptionsLoggerFilter } from './common/exceptionsLogger.filter';
import { HealthController } from './health/health.controller';
import { HealthModule } from './health/health.module';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { StructuresModule } from './structures/structures.module';
import { ServicesModule } from './services/services.module';
import { SettingsModule } from './settings/settings.module';
import { RolesModule } from './roles/roles.module';
import { TypesModule } from './types/types.module';
import { UtilsModule } from './utils/utils.module';
import { KubeModule } from './kube/kube.module';
import { SettingTypesModule } from './setting-types/setting-types.module';
import { SystemModule } from './system/system.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        pinoHttp: {
          level: config.get('APP_LOG_LEVEL') || 'debug',
          formatters: {
            level: (label) => {
              return {
                level: label,
              };
            },
          },
          timestamp: () => `,"time":"${new Date(Date.now()).toISOString()}"`,
          transport:
            config.get('NODE_ENV') === 'production'
              ? undefined
              : {
                  target: 'pino-pretty',
                  options: {
                    singleLine: true,
                  },
                },
        },
      }),
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    DatabaseModule,
    S3Module,
    ComponentsModule,
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        S3_HOST: Joi.string().required(),
        S3_PORT: Joi.number().required(),
        S3_HEALTH_PATH: Joi.string().required(),
        S3_ACCESS_KEY_ID: Joi.string().required(),
        S3_SECRET_ACCESS_KEY: Joi.string().required(),
        S3_BUCKET_NAME: Joi.string().required(),
        S3_BUCKET_NAME_CLIENT: Joi.string().required(),
        KUBE_CONFIG_BASE64: Joi.string().required(),
        USER_DATA_LIFESPAN_IN_SECONDS: Joi.number().required(),
        SUPERUSER_LIST: Joi.string()
          .email({
            multiple: true,
          })
          .required(),
      }),
    }),
    HealthModule,
    TerminusModule,
    HttpModule,
    StructuresModule,
    ServicesModule,
    SettingsModule,
    SettingTypesModule,
    RolesModule,
    TypesModule,
    UtilsModule,
    KubeModule,
    SystemModule,
  ],
  controllers: [AppController, HealthController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: ExceptionsLoggerFilter,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'health', method: RequestMethod.GET })
      .forRoutes('*');
  }
}
