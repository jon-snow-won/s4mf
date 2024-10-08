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
import { V1ConfigMapKeySelector } from './v1ConfigMapKeySelector.dto';
import { V1ObjectFieldSelector } from './v1ObjectFieldSelector.dto';
import { V1ResourceFieldSelector } from './v1ResourceFieldSelector.dto';
import { V1SecretKeySelector } from './v1SecretKeySelector.dto';
/**
 * EnvVarSource represents a source for the value of an EnvVar.
 */
export class V1EnvVarSource {
  'configMapKeyRef'?: V1ConfigMapKeySelector;
  'fieldRef'?: V1ObjectFieldSelector;
  'resourceFieldRef'?: V1ResourceFieldSelector;
  'secretKeyRef'?: V1SecretKeySelector;
}
