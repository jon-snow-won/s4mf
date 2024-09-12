import { CreateComponentDto } from './create-component.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateComponentWithFilesDto extends CreateComponentDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file?: any;
}
