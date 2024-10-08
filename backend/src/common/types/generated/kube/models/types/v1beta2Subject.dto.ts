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
import { V1beta2GroupSubject } from './v1beta2GroupSubject.dto';
import { V1beta2ServiceAccountSubject } from './v1beta2ServiceAccountSubject.dto';
import { V1beta2UserSubject } from './v1beta2UserSubject.dto';
/**
 * Subject matches the originator of a request, as identified by the request authentication system. There are three ways of matching an originator; by user, group, or service account.
 */
export class V1beta2Subject {
  'group'?: V1beta2GroupSubject;
  /**
   * `kind` indicates which one of the other fields is non-empty. Required
   */
  'kind': string;
  'serviceAccount'?: V1beta2ServiceAccountSubject;
  'user'?: V1beta2UserSubject;
}
