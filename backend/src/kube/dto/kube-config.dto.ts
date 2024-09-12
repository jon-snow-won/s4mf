import {
  Cluster,
  Context,
  User,
} from '@kubernetes/client-node/dist/config_types';

export class KubeConfigDto {
  apiVersion: string;
  kind: string;
  preferences: object;
  /**
   * The list of all known clusters
   */
  clusters: Cluster[];
  /**
   * The list of all known users
   */
  users: User[];
  /**
   * The list of all known contexts
   */
  contexts: Context[];
  /**
   * The name of the current context
   */
  currentContext: string;
}
