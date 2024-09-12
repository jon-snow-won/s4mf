import { Controller, Get } from '@nestjs/common';
import {
  HealthCheck,
  HealthCheckService,
  HttpHealthIndicator,
  MikroOrmHealthIndicator,
} from '@nestjs/terminus';
import { ConfigService } from '@nestjs/config';
import { ApiExcludeController, ApiTags } from '@nestjs/swagger';
import * as path from 'path';

@Controller('health')
@ApiTags('health')
@ApiExcludeController()
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private configService: ConfigService,
    private dataBaseHealth: MikroOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  check() {
    const s3Host = this.configService.get('S3_HOST');
    const s3Port = this.configService.get('S3_PORT');
    const s3HealthPath = this.configService.get('S3_HEALTH_PATH');
    const s3Url = `http://${path.posix.join(
      `${s3Host}:${s3Port}${s3HealthPath}`,
    )}`;

    const appPort = this.configService.get('APP_PORT');
    const selfUrl = `http://${path.posix.join(
      `localhost:${appPort}/api-json/`,
    )}`;

    return this.health.check([
      () => this.http.pingCheck('swagger', selfUrl),
      () => this.http.pingCheck('s3', s3Url),
      () => this.dataBaseHealth.pingCheck('database'),
    ]);
  }
}
