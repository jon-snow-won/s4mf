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
 * ResourceQuotaStatus defines the enforced hard limits and observed use.
 */
export class V1ResourceQuotaStatus {
  /**
   * Hard is the set of enforced hard limits for each named resource. More info: https://kubernetes.io/docs/concepts/policy/resource-quotas/
   */
  'hard'?: object;
  /**
   * Used is the current observed total usage of the resource in the namespace.
   */
  'used'?: object;
}
