import { Seeder } from '@mikro-orm/seeder';
import { Role } from '../roles/entities/role.entity';
import { ROLES_ARRAY } from '../common/constants/roles.contrant';
import { fixSequence } from './DatabaseSeeder';
import { SqlEntityManager } from '@mikro-orm/postgresql';

export class RoleSeeder extends Seeder {
  async run(em: SqlEntityManager): Promise<void> {
    const date = new Date();
    for (const { id, name, description } of ROLES_ARRAY) {
      const existingRole = await em.findOne(Role, { id });
      if (!existingRole) {
        await em.upsert(Role, {
          id,
          name,
          description,
          createdAt: date,
          updatedAt: date,
        });
      }
    }

    await fixSequence(em, Role);
  }
}
