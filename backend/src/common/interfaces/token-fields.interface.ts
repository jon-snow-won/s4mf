export interface TokenFields {
  email: string;
  name: string;
  login?: string;
  preferred_username?: string;
  roles?: string[];
}

// //
// Token Examples
// //

// core-authorization
// {
//   "gender": "",
//   "displayName": "",
//   "roles": [
//   "SCOPE_email",
//   "SCOPE_profile"
// ],
//   "organizationFomsCode": "",
//   "mpiOip": "",
//   "login": "pnsazonov",
//   "okato": "",
//   "tfoms_code": "",
//   "organizationCode": "",
//   "surname": "",
//   "permissions": [],
//   "name": "Павел Сазонов",
//   "position": "",
//   "exp": 1706167490,
//   "iat": 1706167190,
//   "email": "pnsazonov@rtk-element.ru",
//   "isTrusted": "",
//   "esiaId": ""
// }

// authorization
// {
//   "exp": 1705934595,
//   "iat": 1705934295,
//   "jti": "670a9be4-c6ba-4aef-8c4f-2f0588273c36",
//   "iss": "https://svp-keycloak.s4mf.com/realms/federal-app",
//   "aud": [
//   "account",
//   "dictionary-client-test"
// ],
//   "sub": "94fc8981-ee60-4c09-a931-deea849cbe34",
//   "typ": "Bearer",
//   "azp": "api-gateway",
//   "session_state": "d8216b63-410c-4dc9-9b21-fb700437097c",
//   "acr": "1",
//   "allowed-origins": [
//   "*"
// ],
//   "realm_access": {
//   "roles": [
//     "offline_access",
//     "default-roles-federal-app",
//     "uma_authorization"
//   ]
// },
//   "resource_access": {
//   "account": {
//     "roles": [
//       "manage-account",
//       "manage-account-links",
//       "view-profile"
//     ]
//   },
//   "dictionary-client-test": {
//     "roles": [
//       "map-admin"
//     ]
//   }
// },
//   "scope": "email profile",
//   "sid": "d8216b63-410c-4dc9-9b21-fb700437097c",
//   "email_verified": false,
//   "name": "Павел Сазонов",
//   "preferred_username": "pnsazonov",
//   "given_name": "Павел",
//   "family_name": "Сазонов",
//   "email": "pnsazonov@rtk-element.ru"
// }
