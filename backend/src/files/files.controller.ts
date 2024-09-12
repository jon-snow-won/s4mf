import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseFilePipe,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesService } from './files.service';
import { Express, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UploadFileDto } from './dto/upload-file.dto';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import { PartialFile } from './entities/file.entity';
import {
  OrderOptionsDto,
  PaginateOptionsDto,
  PopulateOptionsDto,
} from '../common/dtos/page-options.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { UploadFileResponseDto } from './dto/upload-file-response.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('files')
@ApiTags('files')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiExtraModels(PartialFile)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':fileName(*)')
  @ApiOperation({ summary: 'Get single file from S3' })
  @ApiParam({
    name: 'fileName',
    required: true,
    description: 'Имя файла',
    type: String,
  })
  @ApiResponse({
    schema: {
      type: 'string',
      format: 'binary',
    },
    status: HttpStatus.OK,
  })
  @ApiNotFoundResponse({
    description: 'File not found',
    type: DetailedNotFoundException,
  })
  async getFile(
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const file = await this.filesService.getFile(fileName);
    file.stream.pipe(response);
  }

  @Get()
  @ApiOperation({ summary: 'Get all files from DB' })
  @ApiPaginatedResponse(PartialFile)
  async getFilesList(
    @CurrentUser() user: User,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
  ) {
    return this.filesService.findAllFromDB(user, {
      orderOptions,
      paginateOptions,
      populateOptions,
    });
  }

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: UploadFileDto,
  })
  @ApiOperation({ summary: 'Upload single file' })
  @ApiNotFoundResponse({
    description: 'Component not found',
    type: DetailedNotFoundException,
  })
  async uploadFile(
    @Req() request: RequestWithUser,
    @Body() uploadFileDto: UploadFileDto,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ): Promise<UploadFileResponseDto> {
    file.originalname = Buffer.from(file.originalname, 'latin1').toString(
      'utf-8',
    );
    return this.filesService.uploadFile(file, uploadFileDto, request.user);
  }

  @Delete(':fileName')
  @ApiOperation({ summary: 'Delete single file' })
  @ApiNotFoundResponse({
    description: 'File not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialFile,
  })
  async deleteFile(
    @CurrentUser() user: User,
    @Param('fileName') fileName: string,
  ) {
    return this.filesService.removeFileByName(user, fileName);
  }
}
