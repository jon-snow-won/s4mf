import { PartialType } from '@nestjs/swagger';
import { CreateSettingTypeDto } from './create-setting-type.dto';

export class UpdateSettingTypeDto extends PartialType(CreateSettingTypeDto) {}
