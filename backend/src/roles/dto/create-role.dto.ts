import { IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateRoleDto {
  @IsString()
  @ApiProperty({ required: true })
  name: string;

  @IsString()
  @IsOptional()
  @ApiProperty({ required: false })
  description: string;
}
