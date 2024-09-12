import { ApiProperty } from '@nestjs/swagger';
import { ProcessFileDto } from './process-file.dto';

export class UploadFileDto extends ProcessFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'File to upload',
  })
  file: any;
}
