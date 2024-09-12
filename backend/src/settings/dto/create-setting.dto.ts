import { SettingType } from '../../setting-types/entities/setting-type.entity';
import { IsArray, IsNotEmpty, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateSettingDto {
  @IsNotEmpty()
  @ApiProperty({ type: Number })
  type: SettingType;

  @IsArray()
  extends: number[];

  @IsObject()
  @ApiProperty({ type: JSON })
  // properties: Array<{ id: string }>;
  properties: JSON;
}
