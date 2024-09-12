import {
  Controller,
  Get,
  ParseFilePipe,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { UtilsService } from './utils.service';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

class FileUploadDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: any;
}

@Controller('utils')
@ApiTags('utils')
export class UtilsController {
  constructor(private readonly utilsService: UtilsService) {}

  @Get('openapi-client')
  @ApiOperation({ summary: 'Get openapi client' })
  @ApiExcludeEndpoint()
  async generateOpenapiClient(@Res() response: Response) {
    const client = await this.utilsService.getClient();
    client.stream.pipe(response);
  }

  @Post('upload-client')
  @ApiOperation({ summary: 'Upload openapi client' })
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: FileUploadDto,
  })
  @ApiExcludeEndpoint()
  async uploadClient(
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    return this.utilsService.uploadClient(file);
  }
}
