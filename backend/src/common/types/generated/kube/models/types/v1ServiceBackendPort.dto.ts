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
 * ServiceBackendPort is the service port being referenced.
 */
export class V1ServiceBackendPort {
  /**
   * name is the name of the port on the Service. This is a mutually exclusive setting with \"Number\".
   */
  'name'?: string;
  /**
   * number is the numerical port number (e.g. 80) on the Service. This is a mutually exclusive setting with \"Name\".
   */
  'number'?: number;
}
