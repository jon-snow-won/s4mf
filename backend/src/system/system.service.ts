import { InjectRepository } from '@mikro-orm/nestjs';
import { System } from './entities/system.entity';
import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { DetailedNotFoundException } from 'common/exceptions/detailed-not-found.exception';
import { SYSTEM_SETTINGS_ID } from 'common/constants/system.contrants';
import { User } from 'users/entities/user.entity';
import { StructuresService } from '../structures/structures.service';
import { ConfigService } from '@nestjs/config';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';

@Injectable()
export class SystemService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(System)
    private readonly systemRepository: EntityRepository<System>,
    private readonly structuresService: StructuresService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Retrieves the system settings from the system repository.
   *
   * @return {Promise<System>} The system settings.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   */
  async getSystem(): Promise<System> {
    const system = await this.systemRepository.findOne({
      id: SYSTEM_SETTINGS_ID,
    });

    if (!system) {
      throw new DetailedNotFoundException([
        {
          details: 'System not found',
          resourceId: `${SYSTEM_SETTINGS_ID}`,
          resourceName: 'System',
        },
      ]);
    }

    return system;
  }

  /**
   * Retrieves the active structure ID from the system properties.
   *
   * @return {Promise<number>} The active structure ID.
   * @throws {DetailedNotFoundException} If the active structure ID is not found.
   */
  async getActiveStructureID() {
    const system = await this.getSystem();

    const activeStructureID = system.properties.activeStructureID;
    if (activeStructureID == null) {
      throw new DetailedNotFoundException([
        {
          details: `No active Structure found in system settings`,
          resourceId: `${activeStructureID}`,
          resourceName: 'System.ActiveStructure',
        },
      ]);
    }

    return activeStructureID;
  }

  /**
   * Sets the active structure ID for a user.
   *
   * @param {User} user - The user performing the operation.
   * @param {number} structureID - The ID of the structure to be set as active.
   * @return {Promise<void>} - A promise that resolves when the active structure ID is successfully set.
   * @throws {DetailedNotFoundException} If the structure is not found.
   */
  async setActiveStructureID(user: User, structureID: number) {
    await this.structuresService.setActiveStructureID(user, structureID);

    const system = await this.getSystem();
    system.properties.activeStructureID = structureID;
    await this.em.persist(system);
    await this.em.flush();
  }

  /**
   * Retrieves the list of super users.
   *
   * @return {Promise<string[]>} The list of super users.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   */
  async getSuperUserList() {
    const system = await this.getSystem();

    return system.properties.superUserList;
  }

  /**
   * Adds a super user to the system.
   *
   * @param {string} email - The email of the super user.
   * @return {Promise<void>} A Promise that resolves when the super user is added.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   */
  async addSuperUser(email: string) {
    const system = await this.getSystem();
    system.properties.superUserList = [
      ...new Set([...system.properties.superUserList, email]),
    ];
    await this.em.persistAndFlush(system);
  }

  /**
   * Deletes a super user from the system.
   *
   * @param {string} email - The email of the super user to be deleted.
   * @throws {DetailedBadRequestException} If the super user is in the initial ENV SUPERUSER_LIST configuration.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   * @return {Promise<void>} A Promise that resolves when the super user is successfully deleted.
   */
  async deleteSuperUser(email: string) {
    const initialSuperUserList =
      this.configService.get<string>('SUPERUSER_LIST');
    if (initialSuperUserList?.includes(email)) {
      throw new DetailedBadRequestException([
        {
          reason: `Super user ${email} cannot be deleted`,
          details: `This email is in the initial ENV SUPERUSER_LIST configuration. You must remove it from there if you want to delete it.`,
        },
      ]);
    }

    const system = await this.getSystem();

    system.properties.superUserList = system.properties.superUserList.filter(
      (user) => user !== email,
    );
    await this.em.persistAndFlush(system);
  }

  /**
   * Retrieves the list of admin users.
   *
   * @return {string[]} The list of admin users.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   */
  async getAdminUserList() {
    const system = await this.getSystem();
    return system.properties.adminUserList;
  }

  /**
   * Adds an admin user to the system.
   *
   * @param {string} email - The email of the admin user to be added.
   * @return {Promise<void>} A Promise that resolves when the admin user is successfully added.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   */
  async addAdminUser(email: string) {
    const system = await this.getSystem();
    system.properties.adminUserList = [
      ...new Set([...system.properties.adminUserList, email]),
    ];
    await this.em.persistAndFlush(system);
  }

  /**
   * Deletes an admin user from the system.
   *
   * @param {string} email - The email of the admin user to be deleted.
   * @throws {DetailedBadRequestException} If the admin user is in the initial ENV ADMINUSER_LIST configuration.
   * @throws {DetailedNotFoundException} If the system settings are not found.
   * @return {Promise<void>} A Promise that resolves when the admin user is successfully deleted.
   */
  async deleteAdminUser(email: string) {
    const initialAdminUserList =
      this.configService.get<string>('ADMINUSER_LIST');
    if (initialAdminUserList?.includes(email)) {
      throw new DetailedBadRequestException([
        {
          reason: `Admin user ${email} cannot be deleted`,
          details: `This email is in the initial ENV ADMINUSER_LIST configuration. You must remove it from there if you want to delete it.`,
        },
      ]);
    }

    const system = await this.getSystem();
    system.properties.adminUserList = system.properties.adminUserList.filter(
      (user) => user !== email,
    );
    await this.em.persistAndFlush(system);
  }
}
