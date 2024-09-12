/**
 * Kubernetes
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: release-1.28
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */
/**
 * ContainerStateWaiting is a waiting state of a container.
 */
export class V1ContainerStateWaiting {
  /**
   * Message regarding why the container is not yet running.
   */
  'message'?: string;
  /**
   * (brief) reason the container is not yet running.
   */
  'reason'?: string;
}
