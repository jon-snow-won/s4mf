import { CommonSearchFieldDto } from '../../common/dtos/common-search-field.dto';
import { PartialType } from '@nestjs/swagger';

export class ServiceFilterDto extends PartialType(CommonSearchFieldDto) {}
