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
 * UncountedTerminatedPods holds UIDs of Pods that have terminated but haven\'t been accounted in Job status counters.
 */
export class V1UncountedTerminatedPods {
  /**
   * failed holds UIDs of failed Pods.
   */
  'failed'?: Array<string>;
  /**
   * succeeded holds UIDs of succeeded Pods.
   */
  'succeeded'?: Array<string>;
}
