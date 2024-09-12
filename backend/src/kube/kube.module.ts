import { Module } from '@nestjs/common';
import { KubeController } from './kube.controller';
import { KubeService } from './kube.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [KubeController],
  providers: [KubeService],
})
export class KubeModule {}
