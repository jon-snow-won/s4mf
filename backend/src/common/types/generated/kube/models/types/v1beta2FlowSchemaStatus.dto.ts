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
import { V1beta2FlowSchemaCondition } from './v1beta2FlowSchemaCondition.dto';
/**
 * FlowSchemaStatus represents the current state of a FlowSchema.
 */
export class V1beta2FlowSchemaStatus {
  /**
   * `conditions` is a list of the current states of FlowSchema.
   */
  'conditions'?: Array<V1beta2FlowSchemaCondition>;
}
