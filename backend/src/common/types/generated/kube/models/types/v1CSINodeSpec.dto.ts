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
import { V1CSINodeDriver } from './v1CSINodeDriver.dto';
/**
 * CSINodeSpec holds information about the specification of all CSI drivers installed on a node
 */
export class V1CSINodeSpec {
  /**
   * drivers is a list of information of all CSI Drivers existing on a node. If all drivers in the list are uninstalled, this can become empty.
   */
  'drivers': Array<V1CSINodeDriver>;
}
