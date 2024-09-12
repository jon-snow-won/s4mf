import { JsonType } from '@mikro-orm/core';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsObject } from 'class-validator';

export class CreateSettingTypeDto {
  @IsNotEmpty()
  @ApiProperty({ type: String })
  name: string;

  @IsObject()
  @ApiProperty({ type: JsonType })
  pattern: JSON;
}
