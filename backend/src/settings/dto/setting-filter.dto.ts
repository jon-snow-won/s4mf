import { PartialType } from '@nestjs/swagger';
import { CommonSearchFieldDto } from '../../common/dtos/common-search-field.dto';

export class SettingFilterDto extends PartialType(CommonSearchFieldDto) {}
