import { Enum } from '@mikro-orm/core';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PopulateType } from '../types/enums/populate-type.enum';

export class CommonQueryFieldsDto {
  @ApiPropertyOptional({
    description: `Populate method for the query. 
    
      - all: populate all relations (populateItems ignored)
      - minimal: only main fields
      - none: no relations populated. 
      
      Default: none`,
  })
  @Enum(() => PopulateType)
  @IsEnum(PopulateType)
  readonly populateType?: PopulateType = PopulateType.NONE;

  @ApiPropertyOptional({
    default: null,
    nullable: true,
    description:
      "Comma separated list without spaces of relations to populate. Example: 'services,settings,descendants'. Ignored if [populateAll] field is true. Default: empty",
  })
  @IsOptional()
  @IsString()
  readonly populateItems?: string | null = null;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  extractFields?: string | null = null;
}
