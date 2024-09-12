import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { TokenHeaderGuard } from '../auth/guard/token-header.guard';
import { KubeService } from './kube.service';
import { CreateSimplePodDto } from './dto/create-pod.dto';
import {
  FilterOptionsDto,
  OrderOptionsDto,
  PaginateOptionsDto,
} from '../common/dtos/page-options.dto';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { ApiPaginatedResponse } from '../common/decorators/api-paginated-response.decorator';
import { Response } from 'express';
import { V1Pod } from '../common/types/generated/kube/models/types/v1Pod.dto';
import { V1ContainerPort } from '../common/types/generated/kube/models/types/v1ContainerPort.dto';
import { V1Namespace } from '../common/types/generated/kube/models/types/v1Namespace.dto';
import { V1Service } from '../common/types/generated/kube/models/types/v1Service.dto';
import { V1Container } from '../common/types/generated/kube/models/types/v1Container.dto';
import { V1Ingress } from '../common/types/generated/kube/models/types/v1Ingress.dto';
import { V1Secret } from '../common/types/generated/kube/models/types/v1Secret.dto';
import { V1ConfigMap } from '../common/types/generated/kube/models/types/v1ConfigMap.dto';
import { ImageDto, ImageListDto } from './dto/generic-kube-entity.dto';
import { RolesGuard } from 'common/guards/roles.guard';
import { Roles } from 'common/decorators/roles.decorator';
import { SERVICE_ROLES } from 'common/constants/roles.contrant';
import { DetailedForbiddenException } from '../common/exceptions/detailed-forbidden.exception';
import { NamespaceListDto } from './dto/namespace-list.dto';

@Controller('kube')
@ApiTags('kube')
@ApiBearerAuth()
@UseGuards(TokenHeaderGuard, RolesGuard)
@ApiExtraModels(
  V1Namespace,
  V1Service,
  V1Container,
  V1Ingress,
  V1Secret,
  V1ConfigMap,
  ImageListDto,
)
@ApiForbiddenResponse({ type: DetailedForbiddenException })
export class KubeController {
  constructor(private readonly kubeService: KubeService) {}

  @Get('pods')
  @ApiOperation({ summary: 'List pods in multiple namespaces' })
  @ApiPaginatedResponse(V1Pod)
  @ApiExtraModels(V1Pod, V1ContainerPort)
  async listPods(
    @CurrentUser() user: User,
    @Query() namespaces: NamespaceListDto,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listAllPods(user, namespaces.namespaceList, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('services')
  @ApiOperation({ summary: 'List services in multiple namespaces' })
  @ApiPaginatedResponse(V1Service)
  async listServices(
    @CurrentUser() user: User,
    @Query() namespaces: NamespaceListDto,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listAllServices(user, namespaces.namespaceList, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('ingresses')
  @ApiOperation({ summary: 'List ingresses in multiple namespaces' })
  @ApiPaginatedResponse(V1Ingress)
  async listIngresses(
    @CurrentUser() user: User,
    @Query() namespaces: NamespaceListDto,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ): Promise<any> {
    return this.kubeService.listAllIngresses(user, namespaces.namespaceList, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('configmaps')
  @ApiOperation({ summary: 'List configmaps in multiple namespaces' })
  @ApiPaginatedResponse(V1ConfigMap)
  async listConfigMaps(
    @CurrentUser() user: User,
    @Query() namespaces: NamespaceListDto,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listAllConfigMaps(user, namespaces.namespaceList, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('secrets')
  @ApiOperation({ summary: 'List secrets in multiple namespaces' })
  @ApiPaginatedResponse(V1Secret)
  async listSecrets(
    @CurrentUser() user: User,
    @Query() namespaces: NamespaceListDto,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ): Promise<any> {
    return this.kubeService.listAllSecrets(user, namespaces.namespaceList, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces')
  @ApiOperation({ summary: 'List namespaces' })
  @ApiPaginatedResponse(V1Namespace)
  async listNamespaces(
    @CurrentUser() user: User,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) /*: Promise<PageDto<V1Namespace> | any[]>*/ {
    return this.kubeService.listNamespaces(user, {
      paginateOptions,
      orderOptions,
      filterOptions,
    });
  }

  @Get('namespaces/:namespace/pods')
  @ApiOperation({ summary: 'List pods in a namespace' })
  @ApiPaginatedResponse(V1Pod)
  @ApiExtraModels(V1Pod, V1ContainerPort)
  async listNamespacedPods(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listNamespacedPod(user, namespace, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces/:namespace/images')
  @ApiOperation({ summary: 'List images used in all pods in a namespace' })
  @ApiPaginatedResponse(ImageListDto)
  async listNamespacedImages(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ): Promise<any> {
    return this.kubeService.listNamespacedImages(user, namespace, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces/:namespace/pods/:podName')
  @ApiOperation({ summary: 'Get pod details' })
  @ApiOkResponse({ type: V1Pod })
  async getNamespacedPod(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Param('podName') podName: string,
  ) {
    return this.kubeService.getNamespacedPod(user, namespace, podName);
  }

  @Get('namespaces/:namespace/pods/:podName/containers')
  @ApiOperation({ summary: 'List containers in a pod' })
  @ApiPaginatedResponse(V1Container)
  async listNamespacedPodsContainers(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Param('podName') podName: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ): Promise<any> {
    return this.kubeService.listNamespacedPodsContainers(
      user,
      namespace,
      podName,
      { filterOptions, orderOptions, paginateOptions },
    );
  }

  @Get('namespaces/:namespace/pods/:podName/images')
  @ApiOperation({ summary: 'List images used in a pod' })
  @ApiPaginatedResponse(ImageDto)
  async listNamespacedPodsImages(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Param('podName') podName: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listPodImages(user, namespace, podName, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces/:namespace/pods/:podName/containers/:containerName/logs')
  @ApiOperation({ summary: 'Get logs from a container in a pod' })
  @ApiQuery({
    name: 'tailLines',
    type: String,
    description: 'Lines from the end. Optional',
    required: false,
  })
  async listPodLog(
    @CurrentUser() user: User,
    @Res() response: Response,
    @Param('namespace') namespace: string,
    @Param('podName') podName: string,
    @Param('containerName') containerName: string,
    @Query('tailLines') tailLines?: string,
  ) {
    const logsStream = await this.kubeService.readNamespacedPodLog(
      user,
      namespace,
      podName,
      containerName,
      tailLines,
    );

    response.contentType('text/plain');
    response.attachment(
      `${namespace}_${podName}_${containerName}_tailLines_${tailLines || 'full'}.log`,
    );
    response.send(logsStream);
  }

  @Get('namespaces/:namespace/services')
  @ApiOperation({ summary: 'List services in a namespace' })
  @ApiPaginatedResponse(V1Service)
  async listNamespacedServices(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listNamespacedService(user, namespace, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces/:namespace/ingresses')
  @ApiOperation({ summary: 'List ingresses in a namespace' })
  @ApiPaginatedResponse(V1Ingress)
  async listNamespacedIngresses(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ): Promise<any> {
    return this.kubeService.listNamespacedIngress(user, namespace, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces/:namespace/secrets')
  @ApiOperation({ summary: 'List secrets in a namespace' })
  @ApiPaginatedResponse(V1Secret)
  async listNamespacedSecrets(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ): Promise<any> {
    return this.kubeService.listNamespacedSecret(user, namespace, {
      filterOptions,
      orderOptions,
      paginateOptions,
    });
  }

  @Get('namespaces/:namespace/configmaps')
  @ApiOperation({ summary: 'List configmaps in a namespace' })
  @ApiPaginatedResponse(V1ConfigMap)
  async listNamespacedConfigMaps(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Query() filterOptions: FilterOptionsDto,
    @Query() orderOptions: OrderOptionsDto,
    @Query() paginateOptions: PaginateOptionsDto,
  ) {
    return this.kubeService.listNamespacedConfigMap(user, namespace, {
      filterOptions,
      paginateOptions,
    });
  }

  @Post('namespaces/:namespace/pods')
  @ApiOperation({ summary: 'Create a pod in a namespace' })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  async createNamespacedPod(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Body() createSimplePodDto: CreateSimplePodDto,
  ) {
    const { name, image } = createSimplePodDto;
    return this.kubeService.createNamespacedPod(user, namespace, name, image);
  }

  @Delete('namespaces/:namespace/pods/:podName')
  @ApiOperation({ summary: 'Delete a pod in a namespace' })
  @Roles([SERVICE_ROLES.SUPERUSER, SERVICE_ROLES.ADMIN])
  async deleteNamespacedPod(
    @CurrentUser() user: User,
    @Param('namespace') namespace: string,
    @Param('podName') podName: string,
  ) {
    return this.kubeService.deleteNamespacedPod(user, namespace, podName);
  }
}
