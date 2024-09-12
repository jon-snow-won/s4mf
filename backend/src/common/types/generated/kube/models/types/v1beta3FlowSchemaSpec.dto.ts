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
import { V1beta3FlowDistinguisherMethod } from './v1beta3FlowDistinguisherMethod.dto';
import { V1beta3PolicyRulesWithSubjects } from './v1beta3PolicyRulesWithSubjects.dto';
import { V1beta3PriorityLevelConfigurationReference } from './v1beta3PriorityLevelConfigurationReference.dto';
/**
 * FlowSchemaSpec describes how the FlowSchema\'s specification looks like.
 */
export class V1beta3FlowSchemaSpec {
  'distinguisherMethod'?: V1beta3FlowDistinguisherMethod;
  /**
   * `matchingPrecedence` is used to choose among the FlowSchemas that match a given request. The chosen FlowSchema is among those with the numerically lowest (which we take to be logically highest) MatchingPrecedence.  Each MatchingPrecedence value must be ranged in [1,10000]. Note that if the precedence is not specified, it will be set to 1000 as default.
   */
  'matchingPrecedence'?: number;
  'priorityLevelConfiguration': V1beta3PriorityLevelConfigurationReference;
  /**
   * `rules` describes which requests will match this flow schema. This FlowSchema matches a request if and only if at least one member of rules matches the request. if it is an empty slice, there will be no requests matching the FlowSchema.
   */
  'rules'?: Array<V1beta3PolicyRulesWithSubjects>;
}
