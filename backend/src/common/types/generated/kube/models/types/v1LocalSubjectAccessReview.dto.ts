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
import { V1SubjectAccessReviewSpec } from './v1SubjectAccessReviewSpec.dto';
import { V1SubjectAccessReviewStatus } from './v1SubjectAccessReviewStatus.dto';
/**
 * LocalSubjectAccessReview checks whether or not a user or group can perform an action in a given namespace. Having a namespace scoped resource makes it much easier to grant namespace scoped policy that includes permissions checking.
 */
export class V1LocalSubjectAccessReview {
  /**
   * APIVersion defines the versioned schema of this representation of an object. Servers should convert recognized schemas to the latest internal value, and may reject unrecognized values. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#resources
   */
  'apiVersion'?: string;
  /**
   * Kind is a string value representing the REST resource this object represents. Servers may infer this from the endpoint the client submits requests to. Cannot be updated. In CamelCase. More info: https://git.k8s.io/community/contributors/devel/sig-architecture/api-conventions.md#types-kinds
   */
  'kind'?: string;
  'metadata'?: V1ObjectMeta;
  'spec': V1SubjectAccessReviewSpec;
  'status'?: V1SubjectAccessReviewStatus;
}
