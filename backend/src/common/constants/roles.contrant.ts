import { Role } from '../../roles/entities/role.entity';

export enum SERVICE_ROLES {
  SUPERUSER = 'superuser',
  ADMIN = 'admin',
  PUBLIC = 'public',
}

export enum APP_ROLES {
  GATEWAY_ADMIN = 'GATEWAY_ADMIN',
  CMP_ADMIN_FFOMS = 'cmp:admin_ffoms',
  CMP_ADMIN_SMO = 'cmp:admin_smo',
  CMP_ADMIN_TFOMS = 'cmp:admin_tfoms',
  CMP_SUPERVISOR_CMO = 'cmp:supervisor_cmo',
  CMP_SUPERVISOR_FFOMS = 'cmp:supervisor_ffoms',
  CMP_SUPERVISOR_TFOMS = 'cmp:supervisor_tfoms',
}

export const SUPERUSER_ROLE_ID = 0;
export const ADMIN_ROLE_ID = 1;
export const PUBLIC_ROLE_ID = 2;

export const SUPERUSER_ROLE = {
  id: SUPERUSER_ROLE_ID,
  name: SERVICE_ROLES.SUPERUSER,
  description: 'Superuser',
};

export const ADMIN_ROLE = {
  id: ADMIN_ROLE_ID,
  name: SERVICE_ROLES.ADMIN,
  description: 'Administrator',
};

export const PUBLIC_ROLE = {
  id: PUBLIC_ROLE_ID,
  name: SERVICE_ROLES.PUBLIC,
  description: 'Public user',
};

export const ROLES_ARRAY: Partial<Role>[] = [
  {
    ...ADMIN_ROLE,
  },
  { ...PUBLIC_ROLE },
  {
    id: 3,
    name: APP_ROLES.GATEWAY_ADMIN,
    description: 'GATEWAY_ADMIN role',
  },
  {
    id: 4,
    name: APP_ROLES.CMP_ADMIN_FFOMS,
    description: 'Администратор ФОМС',
  },
  {
    id: 5,
    name: APP_ROLES.CMP_ADMIN_SMO,
    description: 'Администратор СМО',
  },
  {
    id: 6,
    name: APP_ROLES.CMP_ADMIN_TFOMS,
    description: 'Администратор ТФОМС',
  },
  {
    id: 7,
    name: APP_ROLES.CMP_SUPERVISOR_CMO,
    description: 'Супервизор СМО',
  },
  {
    id: 8,
    name: APP_ROLES.CMP_SUPERVISOR_FFOMS,
    description: 'Супервизор ФОМС',
  },
  {
    id: 9,
    name: APP_ROLES.CMP_SUPERVISOR_TFOMS,
    description: 'Супервизор ТФОМС',
  },
];
