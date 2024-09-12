import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as k8s from '@kubernetes/client-node';
import {
  AppsV1Api,
  AuthenticationV1Api,
  CoreV1Api,
  CustomObjectsApi,
  KubernetesObjectApi,
  NetworkingV1Api,
  StorageV1Api,
  V1Pod,
} from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';
import { Buffer } from 'node:buffer';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { HelperService } from '../common/helpers/helpers.utils';
import { PageOptionsDto } from '../common/dtos/page-options.dto';
import { PageDto } from '../common/dtos/page.dto';
import { User } from '../users/entities/user.entity';
import { GetLogsDto } from './dto/get-logs.dto';
import { V1Container } from '../common/types/generated/kube/models/types/v1Container.dto';
import { V1ConfigMap } from '../common/types/generated/kube/models/types/v1ConfigMap.dto';
import { V1Secret } from '../common/types/generated/kube/models/types/v1Secret.dto';
import { V1Ingress } from '../common/types/generated/kube/models/types/v1Ingress.dto';
import { V1Service } from '../common/types/generated/kube/models/types/v1Service.dto';
import { V1Namespace } from '../common/types/generated/kube/models/types/v1Namespace.dto';
import { ImageDto } from './dto/generic-kube-entity.dto';
import { filterKubeItems } from '../common/helpers/filter-kube-items.utils';
import { extractFieldsFromData } from '../common/helpers/extract-fields-from-data.utils';

// TODO: rework try/catch blocks
@Injectable()
export class KubeService {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Retrieves the Kubernetes configuration for a given user.
   *
   * @param {User} user - The user for whom to retrieve the configuration.
   * @return {string} The Kubernetes configuration for the user, either from their `kubeConfig` property or from the `KUBE_CONFIG_BASE64` environment variable if the user is an admin.
   * @throws {ForbiddenException} If the user does not have permission to access the resource.
   */
  private getKubeConfig(user: User): string {
    if (user.kubeConfig) {
      return user.kubeConfig;
    }

    return this.configService.get('KUBE_CONFIG_BASE64') || '';
  }

  /**
   * Retrieves the Kubernetes API clients for various components based on the user's permissions.
   *
   * @param {User} user - The user object containing information about permissions.
   * @returns {
   *     core: CoreV1Api;
   *     auth: AuthenticationV1Api;
   *     custom: CustomObjectsApi;
   *     client: KubernetesObjectApi;
   *     storage: StorageV1Api;
   *     apps: AppsV1Api;
   *     network: NetworkingV1Api;
   *   } An object containing various Kubernetes API clients for different components.
   */
  private getKubeApi(user: User): {
    core: CoreV1Api;
    auth: AuthenticationV1Api;
    custom: CustomObjectsApi;
    client: KubernetesObjectApi;
    storage: StorageV1Api;
    apps: AppsV1Api;
    network: NetworkingV1Api;
  } {
    const config = this.getKubeConfig(user);
    const kubeConfig = new k8s.KubeConfig();

    kubeConfig.loadFromString(Buffer.from(config, 'base64').toString());

    return {
      core: kubeConfig.makeApiClient(k8s.CoreV1Api),
      apps: kubeConfig.makeApiClient(k8s.AppsV1Api),
      custom: kubeConfig.makeApiClient(k8s.CustomObjectsApi),
      storage: kubeConfig.makeApiClient(k8s.StorageV1Api),
      auth: kubeConfig.makeApiClient(k8s.AuthenticationV1Api),
      network: kubeConfig.makeApiClient(k8s.NetworkingV1Api),
      client: k8s.KubernetesObjectApi.makeApiClient(kubeConfig),
    };
  }

  private stripManagedFields<T>(data: T[] | T) {
    const handeItem = (item: any) => {
      if (!item.metadata || !item.metadata.managedFields) {
        return item;
      }
      const {
        metadata: { managedFields: _, ...restMetadata },
        ...restItem
      } = item;
      return { metadata: { ...restMetadata }, ...restItem };
    };

    if (data instanceof Array) {
      return data.map((item: any) => {
        return handeItem(item);
      });
    }

    return handeItem(data);
  }

  private stripManagedFieldsAndPaginate<T>(
    items: T[],
    pageOptionsDto?: PageOptionsDto,
  ) {
    const result = this.stripManagedFields(items);

    return pageOptionsDto
      ? HelperService.paginateAndSortArray(result, pageOptionsDto)
      : result;
  }

  private handleOutput<T>(items: Array<T>, pageOptionsDto?: PageOptionsDto) {
    if (!pageOptionsDto) {
      return this.stripManagedFieldsAndPaginate(items, pageOptionsDto);
    }
    const { filterBy, extractFields } = pageOptionsDto?.filterOptions ?? {};
    const filteredItems = filterKubeItems(items, filterBy);
    const extractedItems = extractFieldsFromData(
      filteredItems,
      extractFields,
    ) as T[];

    return this.stripManagedFieldsAndPaginate(extractedItems, pageOptionsDto);
  }

  /**
   * Retrieves a list of namespaces for a given user.
   *
   * @param {User} user - The user for whom to retrieve the namespaces.
   * @param {PageOptionsDto} [pageOptionsDto] - Page options.
   * @return {Promise<PageDto<V1Namespace> | V1Namespace[]>} A promise that resolves to a PageDto object containing the namespaces, or an array of namespaces if pagination options are not provided.
   * @throws {InternalServerErrorException} If an error occurs while retrieving the namespaces.
   */
  async listNamespaces(
    user: User,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<V1Namespace> | V1Namespace[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { items },
      } = await api.core.listNamespace();

      return this.handleOutput<V1Namespace>(items, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedPod(
    user: User,
    namespace: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<V1Pod> | V1Pod[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { items },
      } = await api.core.listNamespacedPod(namespace);

      return this.handleOutput<V1Pod>(items, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listAllPods(
    user: User,
    namespaceList?: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<V1Pod> | V1Pod[]> {
    try {
      const api = this.getKubeApi(user);
      const allPods: V1Pod[] = [];

      if (namespaceList) {
        await Promise.all(
          namespaceList.split(',').map(async (namespace) => {
            const {
              body: { items },
            } = await api.core.listNamespacedPod(namespace);
            allPods.push(...items);
          }),
        );
      } else {
        const {
          body: { items },
        } = await api.core.listPodForAllNamespaces();
        allPods.push(...items);
      }

      return this.handleOutput<V1Pod>(allPods, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedService(
    user: User,
    namespace: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<V1Service> | V1Service[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { items },
      } = await api.core.listNamespacedService(namespace);

      return this.handleOutput(items, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listAllServices(
    user: User,
    namespaceList?: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<V1Service> | V1Service[]> {
    try {
      const api = this.getKubeApi(user);
      const allServices: V1Service[] = [];

      if (namespaceList) {
        await Promise.all(
          namespaceList.split(',').map(async (namespace) => {
            const {
              body: { items },
            } = await api.core.listNamespacedService(namespace);
            allServices.push(...items);
          }),
        );
      } else {
        const {
          body: { items },
        } = await api.core.listServiceForAllNamespaces();
        allServices.push(...items);
      }

      return this.handleOutput<V1Service>(allServices, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedIngress(
    user: User,
    namespace: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<V1Ingress> | V1Ingress[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { items },
      } = await api.network.listNamespacedIngress(namespace);

      return this.handleOutput(items, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listAllIngresses(
    user: User,
    namespaceList?: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<V1Ingress> | V1Ingress[]> {
    try {
      const api = this.getKubeApi(user);
      const allIngresses: V1Ingress[] = [];

      if (namespaceList) {
        await Promise.all(
          namespaceList.split(',').map(async (namespace) => {
            const {
              body: { items },
            } = await api.network.listNamespacedIngress(namespace);
            allIngresses.push(...items);
          }),
        );
      } else {
        const {
          body: { items },
        } = await api.network.listIngressForAllNamespaces();
        allIngresses.push(...items);
      }

      return this.handleOutput(allIngresses, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedSecret(
    user: User,
    namespace: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<V1Secret> | V1Secret[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { items },
      } = await api.core.listNamespacedSecret(namespace);

      return this.handleOutput(items, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listAllSecrets(
    user: User,
    namespaceList?: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<V1Secret> | V1Secret[]> {
    try {
      const api = this.getKubeApi(user);
      const allSecrets: V1Secret[] = [];

      if (namespaceList) {
        await Promise.all(
          namespaceList.split(',').map(async (namespace) => {
            const {
              body: { items },
            } = await api.core.listNamespacedSecret(namespace);
            allSecrets.push(...items);
          }),
        );
      } else {
        const {
          body: { items },
        } = await api.core.listSecretForAllNamespaces();
        allSecrets.push(...items);
      }

      return this.handleOutput(allSecrets, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedConfigMap(
    user: User,
    namespace: string,
    pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<V1ConfigMap> | V1ConfigMap[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { items },
      } = await api.core.listNamespacedConfigMap(namespace);

      return this.handleOutput(items, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listAllConfigMaps(
    user: User,
    namespaceList?: string,
    pageOptionsDto?: PageOptionsDto,
  ) {
    try {
      const api = this.getKubeApi(user);
      const allConfigMaps: V1ConfigMap[] = [];

      if (namespaceList) {
        await Promise.all(
          namespaceList.split(',').map(async (namespace) => {
            const {
              body: { items },
            } = await api.core.listNamespacedConfigMap(namespace);
            allConfigMaps.push(...items);
          }),
        );
      } else {
        const {
          body: { items },
        } = await api.core.listConfigMapForAllNamespaces();
        allConfigMaps.push(...items);
      }

      return this.handleOutput(allConfigMaps, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedPodsContainers(
    user: User,
    namespace: string,
    podName: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<V1Container> | V1Container[]> {
    try {
      const api = this.getKubeApi(user);
      const {
        body: { spec },
      } = await api.core.readNamespacedPod(podName, namespace);

      return this.handleOutput(spec?.containers || [], pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async readNamespacedPodLog(
    user: User,
    namespace: string,
    podName: string,
    containerName: string,
    tailLines?: string,
  ): Promise<Buffer> {
    try {
      const api = this.getKubeApi(user);
      // const for readability
      const getLogsDto: GetLogsDto = {
        name: podName,
        namespace: namespace,
        container: containerName,
        follow: undefined,
        insecureSkipTLSVerifyBackend: undefined,
        limitBytes: undefined,
        pretty: undefined,
        previous: undefined,
        sinceSeconds: undefined,
        tailLines: tailLines ? Number.parseInt(tailLines) : undefined,
      };

      const { body } = await api.core.readNamespacedPodLog(
        getLogsDto.name,
        getLogsDto.namespace,
        getLogsDto.container,
        getLogsDto.follow,
        getLogsDto.insecureSkipTLSVerifyBackend,
        getLogsDto.limitBytes,
        getLogsDto.pretty,
        getLogsDto.previous,
        getLogsDto.sinceSeconds,
        getLogsDto.tailLines,
      );

      return Buffer.from(body);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async createNamespacedPod(
    user: User,
    namespace: string,
    podName: string,
    podImage: string,
  ) {
    const api = this.getKubeApi(user);
    try {
      const createdPod = await api.core.createNamespacedPod(namespace, {
        metadata: {
          name: podName,
        },
        spec: {
          containers: [
            {
              name: podName,
              image: podImage,
            },
          ],
        },
      });

      return createdPod.body;
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  async deleteNamespacedPod(user: User, namespace: string, podName: string) {
    try {
      const api = this.getKubeApi(user);
      return api.core.deleteNamespacedPod(podName, namespace);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
  }

  async listPodImages(
    user: User,
    namespace: string,
    podName: string,
    pageOptionsDto?: PageOptionsDto,
  ): Promise<PageDto<ImageDto> | PageDto<V1Container>> {
    try {
      const containers = await this.listNamespacedPodsContainers(
        user,
        namespace,
        podName,
      );
      if (containers instanceof PageDto) {
        return containers;
      }
      const containerList = containers.map((container) => ({
        name: container.name,
        image: container.image,
      }));

      return this.handleOutput(containerList, pageOptionsDto);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async listNamespacedImages(
    user: User,
    namespace: string,
    pageOptions: PageOptionsDto,
  ) {
    try {
      const pods = await this.listNamespacedPod(user, namespace);
      const items = pods instanceof PageDto ? pods.data : pods;
      const imagesList = await Promise.all(
        items?.map(async (item) => {
          const annotations = item.metadata?.annotations || {};
          const gitAnnotations = Object.keys(annotations)
            .filter((key) => key.startsWith('git.'))
            .reduce((obj: { [key: string]: any }, key) => {
              obj[key] = annotations[key];
              return obj;
            }, {});
          const images = await this.listPodImages(
            user,
            namespace,
            item.metadata?.name || '',
          );

          return {
            name: item.metadata?.name,
            gitAnnotations,
            imageList: images,
          };
        }),
      );

      return this.handleOutput(imagesList, pageOptions);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getNamespacedPod(user: User, namespace: string, podName: string) {
    const api = this.getKubeApi(user);
    const { body } = await api.core.readNamespacedPod(podName, namespace);

    return this.stripManagedFields(body);
  }
}
