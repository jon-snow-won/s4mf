import { OmitType } from '@nestjs/swagger';
import { CreateComponentDto } from './create-component.dto';

export class UpdateComponentDto extends OmitType(CreateComponentDto, [
  'name',
] as const) {}
