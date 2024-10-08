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
import { V1ScopedResourceSelectorRequirement } from './v1ScopedResourceSelectorRequirement.dto';
/**
 * A scope selector represents the AND of the selectors represented by the scoped-resource selector requirements.
 */
export class V1ScopeSelector {
  /**
   * A list of scope selector requirements by scope of the resources.
   */
  'matchExpressions'?: Array<V1ScopedResourceSelectorRequirement>;
}
