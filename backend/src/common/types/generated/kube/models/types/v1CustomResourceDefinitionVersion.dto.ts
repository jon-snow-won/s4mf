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
import { V1CustomResourceColumnDefinition } from './v1CustomResourceColumnDefinition.dto';
import { V1CustomResourceSubresources } from './v1CustomResourceSubresources.dto';
import { V1CustomResourceValidation } from './v1CustomResourceValidation.dto';
/**
 * CustomResourceDefinitionVersion describes a version for CRD.
 */
export class V1CustomResourceDefinitionVersion {
  /**
   * additionalPrinterColumns specifies additional columns returned in Table output. See https://kubernetes.io/docs/reference/using-api/api-concepts/#receiving-resources-as-tables for details. If no columns are specified, a single column displaying the age of the custom resource is used.
   */
  'additionalPrinterColumns'?: Array<V1CustomResourceColumnDefinition>;
  /**
   * deprecated indicates this version of the custom resource API is deprecated. When set to true, API requests to this version receive a warning header in the server response. Defaults to false.
   */
  'deprecated'?: boolean;
  /**
   * deprecationWarning overrides the default warning returned to API clients. May only be set when `deprecated` is true. The default warning indicates this version is deprecated and recommends use of the newest served version of equal or greater stability, if one exists.
   */
  'deprecationWarning'?: string;
  /**
   * name is the version name, e.g. “v1”, “v2beta1”, etc. The custom resources are served under this version at `/apis/<group>/<version>/...` if `served` is true.
   */
  'name': string;
  'schema'?: V1CustomResourceValidation;
  /**
   * served is a flag enabling/disabling this version from being served via REST APIs
   */
  'served': boolean;
  /**
   * storage indicates this version should be used when persisting custom resources to storage. There must be exactly one version with storage=true.
   */
  'storage': boolean;
  'subresources'?: V1CustomResourceSubresources;
}
