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
import { V1alpha2ResourceClaimParametersReference } from './v1alpha2ResourceClaimParametersReference.dto';
/**
 * ResourceClaimSpec defines how a resource is to be allocated.
 */
export class V1alpha2ResourceClaimSpec {
  /**
   * Allocation can start immediately or when a Pod wants to use the resource. \"WaitForFirstConsumer\" is the default.
   */
  'allocationMode'?: string;
  'parametersRef'?: V1alpha2ResourceClaimParametersReference;
  /**
   * ResourceClassName references the driver and additional parameters via the name of a ResourceClass that was created as part of the driver deployment.
   */
  'resourceClassName': string;
}
