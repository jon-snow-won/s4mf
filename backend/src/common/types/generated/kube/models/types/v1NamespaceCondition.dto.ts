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
 * NamespaceCondition contains details about state of namespace.
 */
export class V1NamespaceCondition {
  /**
   * Time is a wrapper around time.Time which supports correct marshaling to YAML and JSON.  Wrappers are provided for many of the factory methods that the time package offers.
   */
  'lastTransitionTime'?: Date;
  'message'?: string;
  'reason'?: string;
  /**
   * Status of the condition, one of True, False, Unknown.
   */
  'status': string;
  /**
   * Type of namespace controller condition.
   */
  'type': string;
}
