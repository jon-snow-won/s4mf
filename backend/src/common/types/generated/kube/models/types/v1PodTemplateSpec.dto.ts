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
import { V1ObjectMeta } from './v1ObjectMeta.dto';
import { V1PodSpec } from './v1PodSpec.dto';
/**
 * PodTemplateSpec describes the data a pod should have when created from a template
 */
export class V1PodTemplateSpec {
  'metadata'?: V1ObjectMeta;
  'spec'?: V1PodSpec;
}
