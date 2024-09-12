import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Seeder } from '@mikro-orm/seeder';
import { ADMIN_ROLE, ADMIN_ROLE_ID } from 'common/constants/roles.contrant';
import { User } from 'users/entities/user.entity';
import { fixSequence } from './DatabaseSeeder';

export class UserSeeder extends Seeder {
  /**
   * Seeder for the initial user for other seeders to use
   */
  async run(em: SqlEntityManager): Promise<void> {
    await em.upsert(User, {
      id: ADMIN_ROLE_ID,
      idx: '00000000-0000-0000-0000-000000000000',
      email: `${ADMIN_ROLE.name}@bff.owner`,
      name: ADMIN_ROLE.name,
      roles: [ADMIN_ROLE.name],
      rolesOverride: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await fixSequence(em, User);
  }
}
