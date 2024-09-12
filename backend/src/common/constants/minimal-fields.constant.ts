export const MINIMAL_SETTING_FIELDS: string[] = [
  'id',
  'type.id',
  'extends',
  'properties',
  'user.id',
  'user.email',
] as const;

export const MINIMAL_SETTING_TYPE_FIELDS: string[] = [
  'id',
  'name',
  'pattern',
] as const;

export const MINIMAL_SERVICE_FIELDS: string[] = [
  'id',
  'name',
  'user.id',
  'user.email',
  'type.id',
  'roles.id',
  'settings.id',
  'settings.type.id',
  'settings.properties',
  'descendants.id',
  'descendants.name',
  'descendants.type.id',
  'descendants.roles.id',
  'descendants.settings.id',
  'descendants.settings.type.id',
  'descendants.settings.properties',
] as const;

export const MINIMAL_STRUCTURE_FIELDS: string[] = [
  'id',
  'name',
  'user.id',
  'user.email',
  'settings.id',
  'settings.type.id',
  'settings.properties',
  'services.id',
  'services.name',
  'services.type.id',
  'services.roles.id',
  'services.descendants.id',
  'services.descendants.roles.id',
  'services.descendants.settings.id',
  'services.descendants.settings.type.id',
  'services.descendants.settings.properties',
  'services.settings.id',
  'services.settings.type.id',
  'services.settings.properties',
] as const;

export const MINIMAL_COMPONENT_FIELDS: string[] = [
  'id',
  'name',
  'files.id',
  'files.name',
] as const;

export const MINIMAL_FILE_FIELDS: string[] = ['id', 'name'] as const;
