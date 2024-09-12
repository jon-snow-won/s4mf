import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EntityManager, PopulateHint } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from './entities/user.entity';
import { BaseRepository } from '../common/repositories/base.repository';
import { DetailedBadRequestException } from '../common/exceptions/detailed-bad-request.exception';
import { Buffer } from 'node:buffer';
import { UpdateUserDto } from './dto/update-user.dto';
import { DetailedNotFoundException } from '../common/exceptions/detailed-not-found.exception';
import { SetKubeConfigDto } from '../kube/dto/set-kube-config.dto';
import { HelperService } from '../common/helpers/helpers.utils';
import { addComputeFieldsToUser } from '../common/helpers/add-compute-fields-to-user.utils';
import { ConfigService } from '@nestjs/config';
import { SystemService } from '../system/system.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
    @InjectRepository(User)
    private readonly usersRepository: BaseRepository<User>,
    private readonly systemService: SystemService,
  ) {}

  private readonly logger: Logger = new Logger(UsersService.name);

  /**
   * Creates a new user.
   *
   * @param {CreateUserDto} user - The user data to create.
   * @return {User} The newly created user.
   * @throws {DetailedBadRequestException} If the creation operation fails.
   */
  async create(user: CreateUserDto) {
    this.logger.debug(
      `UsersService.create: ${HelperService.objectToString(user)}`,
    );
    const newUser = new User(user);
    try {
      await this.em.persistAndFlush(newUser);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return newUser;
  }

  /**
   * Updates an existing user.
   *
   * @param {User} user - The user to update.
   * @param {UpdateUserDto} updateUserDto - The updated user data.
   * @return {User} The updated user.
   * @throws {DetailedBadRequestException} If the update operation fails.
   */
  async update(user: User, updateUserDto: UpdateUserDto) {
    this.logger.debug(
      `UsersService.update: ${HelperService.objectToString({ user, updateUserDto })}`,
    );
    try {
      this.em.assign(user, updateUserDto);
      await this.em.persistAndFlush(user);
    } catch (e) {
      throw new DetailedBadRequestException([
        { reason: e.message, details: e.detail },
      ]);
    }
    return user;
  }

  async getByEmail(email: string) {
    return await this.usersRepository.findOne({ email });
  }

  /**
   * Retrieves a user by their email address.
   *
   * @param {string} email - The email address of the user to retrieve.
   * @param {boolean} [withKubeConfig] - Optional flag to include the user's Kubernetes configuration in the result.
   * @return {User} The user with the specified email address.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async getByEmailOrThrow(email: string, withKubeConfig?: boolean) {
    this.logger.debug(`getByEmail('${email}')`);
    const user = await this.usersRepository.findOne(
      { email },
      withKubeConfig
        ? { populate: ['kubeConfig'], populateWhere: PopulateHint.INFER }
        : undefined,
    );

    if (!user) {
      throw new DetailedNotFoundException([
        {
          details: 'User not found',
          resourceId: email,
          resourceName: 'User',
        },
      ]);
    }

    return user;
  }

  /**
   * Retrieves the Kubernetes configuration for a given user.
   *
   * @param {User} user - The user for whom to retrieve the Kubernetes configuration.
   * @return {string} The Kubernetes configuration as a string.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async getKubeConfig(user: User) {
    const userFromDB = await this.getByEmailOrThrow(user.email, true);
    return Buffer.from(userFromDB?.kubeConfig || '', 'base64').toString();
  }

  /**
   * Sets the Kubernetes configuration for a given user.
   *
   * @param {User} user - The user for whom to set the Kubernetes configuration.
   * @param {SetKubeConfigDto} setKubeConfigDto - The Kubernetes configuration data.
   * @return {Promise<void>} A promise that resolves when the configuration is set.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async setKubeConfig(user: User, setKubeConfigDto: SetKubeConfigDto) {
    const { kubeConfigBase64 } = setKubeConfigDto;
    const userDb = await this.usersRepository.findOneOrThrow(user, {
      filter: {
        email: user.email,
      },
    });

    userDb.kubeConfig = kubeConfigBase64;
    await this.em.persistAndFlush(userDb);
  }

  /**
   * Deletes the Kubernetes configuration for a given user.
   *
   * @param {User} user - The user for whom to delete the Kubernetes configuration.
   * @return {Promise<void>} A promise that resolves when the deletion is complete.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async deleteKubeConfig(user: User) {
    const userDb = await this.usersRepository.findOneOrThrow(user, {
      filter: {
        email: user.email,
      },
    });

    userDb.kubeConfig = '';
    await this.em.persistAndFlush(userDb);
  }

  /**
   * Retrieves user data based on the provided email.
   *
   * @param {string} email - The email of the user to retrieve data for.
   * @return {Promise<User>} The user data with computed fields.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async getUserData(email: string) {
    const user = await this.getByEmailOrThrow(email);

    return await addComputeFieldsToUser(user, this.systemService);
  }

  /**
   * Updates a user's data.
   *
   * @param {string} email - The email of the user to update.
   * @param {UpdateUserDto} userData - The new data for the user.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async setUserData(email: string, userData: UpdateUserDto) {
    const userToUpdate = await this.getByEmailOrThrow(email);

    return await this.update(userToUpdate, userData);
  }

  /**
   * Sets the roles override for a user with the specified email.
   *
   * @param {string} email - The email of the user to update.
   * @param {string[]} roles - The new roles override for the user.
   * @return {Promise<void>} A promise that resolves when the update is complete.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async setRolesOverride(email: string, roles: string[]) {
    const userToUpdate = await this.getByEmailOrThrow(email);

    userToUpdate.rolesOverride = roles;
    await this.em.persistAndFlush(userToUpdate);
  }

  /**
   * Resets the roles override for a user with the given email.
   *
   * @param {string} email - The email of the user to reset roles override for.
   * @return {Promise<void>} A promise that resolves when the operation is complete.
   * @throws {DetailedNotFoundException} If the user is not found.
   */
  async resetRolesOverride(email: string) {
    const userToUpdate = await this.getByEmailOrThrow(email);

    userToUpdate.rolesOverride = [];
    await this.em.persistAndFlush(userToUpdate);
  }
}
