import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ComponentsService } from './components.service';
import { UpdateComponentDto } from './dto/update-component.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { RequestWithUser } from '../common/interfaces/request-with-user.interface';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { RequestHeadersWithTokenDto } from '../auth/dto/request-headers-with-token.dto';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { CreateComponentWithFilesDto } from './dto/create-component-with-files.dto';
import {
  OrderOptionsDto,
  PaginateOptionsDto,
  PopulateOptionsDto,
} from '../common/dtos/page-options.dto';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { PartialComponent } from './entities/component.entity';
import { CommonQueryFieldsDto } from '../common/dtos/common-query-fields.dto';
import { CreateComponentResponseDto } from './dto/create-component-response.dto';
import { ConflictResourceException } from '../common/exceptions/conflict-resource.exception';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';

@Controller('components')
@ApiTags('components')
@ApiExtraModels(RequestHeadersWithTokenDto)
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard)
@ApiBadRequestResponse({
  description: 'Bad Request',
  type: DetailedBadRequestException,
})
@ApiExtraModels(PartialComponent)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create new component' })
  @ApiBody({
    type: CreateComponentWithFilesDto,
  })
  @ApiConflictResponse({
    description: 'Component already exists',
    type: ConflictResourceException,
  })
  create(
    @Body() createComponentDto: CreateComponentWithFilesDto,
    @Req() request: RequestWithUser,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<CreateComponentResponseDto> {
    return this.componentsService.createComponent(
      createComponentDto,
      request.user,
      file,
    );
  }

  @Get()
  @ApiOperation({ summary: 'Get all components' })
  @ApiPaginatedResponse(PartialComponent)
  findAll(
    @CurrentUser() user: User,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
    @Query() populateOptions: PopulateOptionsDto,
  ) {
    return this.componentsService.findAll(user, {
      orderOptions,
      paginateOptions,
      populateOptions,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get single component' })
  @ApiNotFoundResponse({
    description: 'Component not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialComponent,
  })
  findOne(
    @CurrentUser() user: User,
    @Param('id') id: string,
    @Query() commonQueryDto: CommonQueryFieldsDto,
  ) {
    return this.componentsService.findOne(user, { id: +id }, commonQueryDto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update single component' })
  @ApiNotFoundResponse({
    description: 'Component not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialComponent,
  })
  update(
    @CurrentUser() user: User,
    @Body() updateComponentDto: UpdateComponentDto,
    @Param('id') id: string,
  ) {
    return this.componentsService.updateComponent(
      user,
      +id,
      updateComponentDto,
    );
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete single component' })
  @ApiNotFoundResponse({
    description: 'Component not found',
    type: DetailedNotFoundException,
  })
  @ApiOkResponse({
    type: PartialComponent,
  })
  remove(@CurrentUser() user: User, @Param('id') id: string) {
    return this.componentsService.removeComponent(user, +id);
  }
}
