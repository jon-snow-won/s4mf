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
import { V1MicroTime } from '../../types.dto';
/**
 * EventSeries contain information on series of events, i.e. thing that was/is happening continuously for some time.
 */
export class CoreV1EventSeries {
  /**
   * Number of occurrences in this series up to the last heartbeat time
   */
  'count'?: number;
  /**
   * MicroTime is version of Time with microsecond level precision.
   */
  'lastObservedTime'?: V1MicroTime;
}
