import { Injectable } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Role } from './entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { BaseRepository } from '../common/repositories/base.repository';
import { User } from '../users/entities/user.entity';
import { UpdateRoleDto } from './dto/udpate-role.dto';

@Injectable()
export class RolesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(Role)
    private readonly roleRepository: BaseRepository<Role>,
  ) {}

  /**
   * Retrieve all roles from the database.
   *
   * @returns {Promise<Role[]>} A promise that resolves to an array of Role entities.
   */
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.findAll();
  }

  /**
   * Create a new role based on the provided role data.
   *
   * @param {CreateRoleDto} createRoleDto - Data for creating the new role
   * @returns {Promise<Role>} The newly created role
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    const newRole = new Role(createRoleDto);
    try {
      await this.em.persistAndFlush(newRole);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return newRole;
  }

  /**
   * Updates a role in the database.
   *
   * @param {User} user - The user performing the operation.
   * @param {number} roleId - The ID of the role to update.
   * @param {UpdateRoleDto} updateRoleDto - The data to update the role with.
   * @returns {Promise<Role>} The updated role entity.
   * @throws {DetailedBadRequestException} If an error occurs during the update process.
   */
  async updateRole(
    user: User,
    roleId: number,
    updateRoleDto: UpdateRoleDto,
  ): Promise<Role> {
    const toUpdate = await this.roleRepository.findOneOrThrow(user, {
      filter: { id: roleId },
    });
    try {
      this.em.assign(toUpdate, updateRoleDto);
      await this.em.flush();
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return toUpdate;
  }

  /**
   * Deletes a role from the database.
   *
   * @param {User} user - The user performing the operation.
   * @param {number} roleId - The ID of the role to delete.
   * @returns {Promise<Role>} A promise that resolves after deleting the role.
   * @throws {DetailedBadRequestException} If an error occurs during the delete process.
   */
  async deleteRole(user: User, roleId: number): Promise<Role> {
    return this.roleRepository.findAndDelete(user, { id: roleId });
  }
}
