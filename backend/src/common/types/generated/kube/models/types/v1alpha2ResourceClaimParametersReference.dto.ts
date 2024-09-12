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
 * ResourceClaimParametersReference contains enough information to let you locate the parameters for a ResourceClaim. The object must be in the same namespace as the ResourceClaim.
 */
export class V1alpha2ResourceClaimParametersReference {
  /**
   * APIGroup is the group for the resource being referenced. It is empty for the core API. This matches the group in the APIVersion that is used when creating the resources.
   */
  'apiGroup'?: string;
  /**
   * Kind is the type of resource being referenced. This is the same value as in the parameter object\'s metadata, for example \"ConfigMap\".
   */
  'kind': string;
  /**
   * Name is the name of resource being referenced.
   */
  'name': string;
}
