import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { Logger as PinoLogger } from 'nestjs-pino';
import { MikroORM } from '@mikro-orm/core';
import { DatabaseSeeder } from './seeders/DatabaseSeeder';
import { json } from 'body-parser';

const logger = new Logger('Bootstrap');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  app.useLogger(app.get(PinoLogger));
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  const configService = app.get(ConfigService);
  const appVersion = process.env['npm_package_version'] ?? '0.0.1';

  const globalPrefix = '/api';
  app.setGlobalPrefix(globalPrefix, {
    exclude: [{ path: 'health', method: RequestMethod.GET }],
  });
  app.enableShutdownHooks();

  const swaggerConfig = new DocumentBuilder()
    .setTitle('El Aggregate BFF')
    .setDescription('Бэкенд для федеративного приложения')
    .setExternalDoc(
      'CMDB',
      'https://jira.element-lab.ru/secure/insight/assets/CMDB-12804',
    )
    .addBearerAuth({
      description: 'Token for auth',
      name: 'Authorization',
      bearerFormat: 'Bearer',
      scheme: 'Bearer',
      type: 'http',
      in: 'Header',
    })
    .setVersion(appVersion)
    .addServer(`${configService.get('APP_GLOBAL_PREFIX')}`, 'main')
    .addTag('auth', 'Api methods for auth')
    .addTag('system', 'Api methods for system')
    .addTag('structures', 'CRUD methods for structures')
    .addTag('services', 'CRUD methods for services')
    .addTag('settings', 'CRUD methods for settings')
    .addTag('setting-types', 'CRUD methods for setting-types')
    .addTag('roles', 'CRUD methods for roles')
    .addTag('types', 'Get methods for types')
    .addTag('kube', 'Api methods to get data from kubernetes')
    .addTag('components', 'CRUD methods for components')
    .addTag('files', 'CRUD methods for files')
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(globalPrefix, app, document);

  logger.log('Migrator: started');
  const orm = app.get(MikroORM);
  await orm.getMigrator().up();
  logger.log('Migrator: finished');
  logger.log('Seeder: started');
  const seeder = orm.getSeeder();
  await seeder.seed(DatabaseSeeder);
  logger.log('Seeder: finished');

  const port = configService.get('APP_PORT') ?? 3000;
  const env = configService.get('NODE_ENV');
  const logLevel = configService.get('APP_LOG_LEVEL');
  await app.listen(port);
  logger.log(
    `App version [${appVersion}] started on port [${port}] in [${env}] mode with log level [${logLevel}]`,
  );
}

bootstrap();
