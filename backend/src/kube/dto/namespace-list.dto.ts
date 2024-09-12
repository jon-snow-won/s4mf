import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class NamespaceListDto {
  @ApiProperty({
    type: String,
    description: 'Comma separated list of namespaces. Example: testing,develop',
    required: false,
  })
  @IsOptional()
  namespaceList: string;
}
