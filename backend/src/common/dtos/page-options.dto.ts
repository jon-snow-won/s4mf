import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Enum } from '@mikro-orm/core';
import { PopulateType } from '../types/enums/populate-type.enum';

export class PaginateOptionsDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    default: 10,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  readonly take: number = 10;

  get skip(): number {
    return (this.page - 1) * this.take;
  }
}
export class PopulateOptionsDto {
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
      "Comma separated list without spaces of relations to populate. Ignored if [populateAll] field is true. Example: 'services,settings,descendants'. Default: null",
  })
  @IsOptional()
  @IsString()
  readonly populateItems: string | null = null;

  @ApiPropertyOptional({
    default: false,
    description: 'Return deleted items. Default: false',
  })
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  @IsOptional()
  readonly withDeleted: boolean = false;
}

export class FilterOptionsDto {
  @ApiPropertyOptional({
    type: String,
    description: `Comma delimited string in the format of "field=value". 
    Field is case sensitive. 
    Value is not. 
    Dot-notation is supported.

    Examples:
    - "field1=value1,field2=value2": filter by field1=value1 OR field2=value2
    - "field1=value1&field2=value2": filter by field1=value1 AND field2=value2
    - "field1=value1&field2=value2,field3=value3": filter by (field1=value1 AND field2=value2) OR field3=value3`,
  })
  @IsString()
  @IsOptional()
  filterBy?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  extractFields?: string | null = null;
}

export class OrderOptionsDto {
  @ApiPropertyOptional({
    description:
      'Comma delimited string in the format of "field:order". Field is case sensitive. Order can be asc or desc.',
  })
  @IsString()
  @IsOptional()
  readonly orderBy?: string;
}

export class PageOptionsDto {
  paginateOptions: PaginateOptionsDto;
  populateOptions?: PopulateOptionsDto;
  filterOptions?: FilterOptionsDto;
  orderOptions?: OrderOptionsDto;
}
