import { Controller } from '@nestjs/common';
import { ApiExtraModels } from '@nestjs/swagger';
import { BaseEntity } from './common/entities/base.entity';

@Controller()
@ApiExtraModels(BaseEntity)
export class AppController {}
