import { Seeder } from '@mikro-orm/seeder';
import { ServiceTypeEnum } from '../common/types/enums/service-type.enum';
import { ServiceType } from '../services/entities/service-type.entity';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { fixSequence } from './DatabaseSeeder';

export class ServiceTypeSeeder extends Seeder {
  async run(em: SqlEntityManager): Promise<void> {
    const date = new Date();

    for (const [entry, value] of Object.entries(ServiceTypeEnum).filter(
      ([entry]) => isNaN(parseInt(entry)),
    )) {
      const id = parseInt(`${value}`);
      const name = entry.toString();
      const existingServiceType = await em.findOne(ServiceType, { id });

      if (!existingServiceType) {
        await em.upsert(ServiceType, {
          id,
          name,
          createdAt: date,
          updatedAt: date,
        });
      } else {
        if (existingServiceType.name !== name) {
          existingServiceType.name = name;
          await em.persistAndFlush(existingServiceType);
        }
      }
    }

    await fixSequence(em, ServiceType);
  }
}
