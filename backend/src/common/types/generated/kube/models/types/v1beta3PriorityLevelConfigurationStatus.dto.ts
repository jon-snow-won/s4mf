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
import { V1beta3PriorityLevelConfigurationCondition } from './v1beta3PriorityLevelConfigurationCondition.dto';
/**
 * PriorityLevelConfigurationStatus represents the current state of a \"request-priority\".
 */
export class V1beta3PriorityLevelConfigurationStatus {
  /**
   * `conditions` is the current state of \"request-priority\".
   */
  'conditions'?: Array<V1beta3PriorityLevelConfigurationCondition>;
}
