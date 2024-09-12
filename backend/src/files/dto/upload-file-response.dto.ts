import { ApiProperty } from '@nestjs/swagger';

export class UploadFileResponseDto {
  @ApiProperty()
  uploadedFilesCount: number;

  constructor(partial?: Partial<UploadFileResponseDto>) {
    Object.assign(this, partial);
  }
}
