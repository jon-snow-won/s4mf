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
 * SecretReference represents a Secret Reference. It has enough information to retrieve secret in any namespace
 */
export class V1SecretReference {
  /**
   * name is unique within a namespace to reference a secret resource.
   */
  'name'?: string;
  /**
   * namespace defines the space within which the secret name must be unique.
   */
  'namespace'?: string;
}
