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
import { V1LabelSelector } from './v1LabelSelector.dto';
import { V1ResourceRequirements } from './v1ResourceRequirements.dto';
import { V1TypedLocalObjectReference } from './v1TypedLocalObjectReference.dto';
import { V1TypedObjectReference } from './v1TypedObjectReference.dto';
/**
 * PersistentVolumeClaimSpec describes the common attributes of storage devices and allows a Source for provider-specific attributes
 */
export class V1PersistentVolumeClaimSpec {
  /**
   * accessModes contains the desired access modes the volume should have. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#access-modes-1
   */
  'accessModes'?: Array<string>;
  'dataSource'?: V1TypedLocalObjectReference;
  'dataSourceRef'?: V1TypedObjectReference;
  'resources'?: V1ResourceRequirements;
  'selector'?: V1LabelSelector;
  /**
   * storageClassName is the name of the StorageClass required by the claim. More info: https://kubernetes.io/docs/concepts/storage/persistent-volumes#class-1
   */
  'storageClassName'?: string;
  /**
   * volumeMode defines what type of volume is required by the claim. Value of Filesystem is implied when not included in claim spec.
   */
  'volumeMode'?: string;
  /**
   * volumeName is the binding reference to the PersistentVolume backing this claim.
   */
  'volumeName'?: string;
}
