import { Seeder } from '@mikro-orm/seeder';
import { SettingTypeEnum } from '../common/types/enums/setting-type.enum';
import { SettingType } from '../setting-types/entities/setting-type.entity';
import { fixSequence } from './DatabaseSeeder';
import { SqlEntityManager } from '@mikro-orm/postgresql';

export class SettingTypeSeeder extends Seeder {
  async run(em: SqlEntityManager): Promise<void> {
    const date = new Date();
    for (const [entry, value] of Object.entries(SettingTypeEnum).filter(
      ([entry]) => isNaN(parseInt(entry)),
    )) {
      const id = parseInt(`${value}`);
      const existingSettingType = await em.findOne(SettingType, { id });
      if (!existingSettingType) {
        await em.upsert(SettingType, {
          id,
          name: entry.toString(),
          createdAt: date,
          updatedAt: date,
          pattern: {},
        });
      }
    }

    await fixSequence(em, SettingType);
  }
}
