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
import { V1alpha1ExpressionWarning } from './v1alpha1ExpressionWarning.dto';
/**
 * TypeChecking contains results of type checking the expressions in the ValidatingAdmissionPolicy
 */
export class V1alpha1TypeChecking {
  /**
   * The type checking warnings for each expression.
   */
  'expressionWarnings'?: Array<V1alpha1ExpressionWarning>;
}
