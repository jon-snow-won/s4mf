import { UserSeeder } from './UserSeeder';
import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ServiceTypeSeeder } from './ServiceTypeSeeder';
import { SettingTypeSeeder } from './SettingTypeSeeder';
import { RoleSeeder } from './RoleSeeder';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { SystemSeeder } from './SystemSeeder';

export async function fixSequence(
  em: SqlEntityManager,
  entity: any,
): Promise<void> {
  const { tableName } = em.getMetadata(entity);
  const schema = 'public';
  const fullTableName = schema ? `${schema}.${tableName}` : tableName;

  await em.transactional(async () => {
    await em.execute(
      `SELECT setval(pg_get_serial_sequence('${fullTableName}', 'id'), (SELECT MAX(id) FROM ${fullTableName}))`,
    );
  });
}

export class DatabaseSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    return this.call(em, [
      SystemSeeder,
      UserSeeder,
      ServiceTypeSeeder,
      SettingTypeSeeder,
      RoleSeeder,
    ]);
  }
}
