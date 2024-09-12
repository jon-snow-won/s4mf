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
 * HorizontalPodAutoscalerCondition describes the state of a HorizontalPodAutoscaler at a certain point.
 */
export class V2HorizontalPodAutoscalerCondition {
  /**
   * lastTransitionTime is the last time the condition transitioned from one status to another
   */
  'lastTransitionTime'?: Date;
  /**
   * message is a human-readable explanation containing details about the transition
   */
  'message'?: string;
  /**
   * reason is the reason for the condition\'s last transition.
   */
  'reason'?: string;
  /**
   * status is the status of the condition (True, False, Unknown)
   */
  'status': string;
  /**
   * type describes the current condition
   */
  'type': string;
}
