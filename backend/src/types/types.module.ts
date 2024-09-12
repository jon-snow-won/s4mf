import { Module } from '@nestjs/common';
import { TypesController } from './types.controller';
import { TypesService } from './types.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ServiceType } from '../services/entities/service-type.entity';

@Module({
  imports: [MikroOrmModule.forFeature([ServiceType])],
  controllers: [TypesController],
  providers: [TypesService],
})
export class TypesModule {}
