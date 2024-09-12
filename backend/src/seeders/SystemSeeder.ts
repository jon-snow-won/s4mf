import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ConfigService } from '@nestjs/config';
import { SYSTEM_SETTINGS_ID } from 'common/constants/system.contrants';
import { System } from 'system/entities/system.entity';
import { HelperService } from '../common/helpers/helpers.utils';

export class SystemSeeder extends Seeder {
  private readonly configService: ConfigService = new ConfigService();

  async run(em: EntityManager): Promise<void> {
    const existingSystem = await em.findOne(System, { id: SYSTEM_SETTINGS_ID });

    const initialAdminUserList =
      this.configService.get<string>('ADMINUSER_LIST')?.split(',') || [];
    const initialSuperUserList =
      this.configService.get<string>('SUPERUSER_LIST')?.split(',') || [];

    if (!existingSystem) {
      const system = new System({
        id: SYSTEM_SETTINGS_ID,
        scope: 'bff',
        properties: {
          activeStructureID: 1,
          superUserList: initialAdminUserList,
          adminUserList: initialSuperUserList,
        },
      });

      await em.upsert(System, system, {
        onConflictAction: 'merge',
      });
    } else {
      const existingAdminUserList =
        existingSystem?.properties?.adminUserList || [];
      const existingSuperUserList =
        existingSystem?.properties?.superUserList || [];

      const mergedAdminUserList = [
        ...new Set([...initialAdminUserList, ...existingAdminUserList]),
      ];
      const mergedSuperUserList = [
        ...new Set([...initialSuperUserList, ...existingSuperUserList]),
      ];

      if (
        !HelperService.areArraysEquivalent(
          mergedAdminUserList,
          existingAdminUserList,
        )
      ) {
        existingSystem.properties.adminUserList = mergedAdminUserList;
      }

      if (
        !HelperService.areArraysEquivalent(
          mergedSuperUserList,
          existingSuperUserList,
        )
      ) {
        existingSystem.properties.superUserList = mergedSuperUserList;
      }

      await em.flush();
    }
  }
}
