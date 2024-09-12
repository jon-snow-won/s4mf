import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemController } from './system.controller';
import { System } from './entities/system.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { StructuresModule } from '../structures/structures.module';

@Module({
  imports: [StructuresModule, MikroOrmModule.forFeature([System])],
  controllers: [SystemController],
  providers: [SystemService],
  exports: [SystemService],
})
export class SystemModule {}
