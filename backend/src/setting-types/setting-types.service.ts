import { Injectable } from '@nestjs/common';
import { CreateSettingTypeDto } from './dto/create-setting-type.dto';
import { UpdateSettingTypeDto } from './dto/update-setting-type.dto';
import { EntityManager, FilterQuery } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { BaseRepository } from 'common/repositories/base.repository';
import { SettingType } from './entities/setting-type.entity';
import { HelperService } from 'common/helpers/helpers.utils';
import { DetailedBadRequestException } from 'common/exceptions/detailed-bad-request.exception';
import { PageOptionsDto } from 'common/dtos/page-options.dto';
import { CommonQueryFieldsDto } from 'common/dtos/common-query-fields.dto';
import { User } from './../users/entities/user.entity';

@Injectable()
export class SettingTypesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(SettingType)
    private readonly settingTypeRepository: BaseRepository<SettingType>,
  ) {}
  async create(user: User, createSettingTypeDto: CreateSettingTypeDto) {
    const newSettingType = this.settingTypeRepository.create({
      ...createSettingTypeDto,
      user,
      ...HelperService.getInitialEntityFields(),
    });

    try {
      await this.em.persistAndFlush(newSettingType);
    } catch (error) {
      throw new DetailedBadRequestException([
        { reason: error.message, details: error.detail },
      ]);
    }

    return newSettingType;
  }

  async findAll(user: User, pageOptionsDto: PageOptionsDto) {
    try {
      return await this.settingTypeRepository.findAndPaginate(user, {
        pageOptionsDto,
      });
    } catch (error) {
      throw new DetailedBadRequestException([
        { reason: error.message, details: error.detail },
      ]);
    }
  }

  async findOne(
    user: User,
    filter: FilterQuery<SettingType>,
    commonQueryDto: CommonQueryFieldsDto,
  ) {
    return await this.settingTypeRepository.findOneByFilter(
      user,
      filter,
      commonQueryDto,
    );
  }

  async update(
    user: User,
    id: number,
    updateSettingTypeDto: UpdateSettingTypeDto,
  ) {
    const toUpdate = await this.settingTypeRepository.findOneOrThrow(user, {
      filter: { id },

      populateOptions: ['*'],
    });

    try {
      this.em.assign(toUpdate, updateSettingTypeDto, {
        mergeObjectProperties: false,
      });
      await this.em.flush();
    } catch (error) {
      throw new DetailedBadRequestException([
        { reason: error.message, details: error.detail },
      ]);
    }
  }

  async remove(user: User, id: number) {
    return this.settingTypeRepository.findAndDelete(user, { id });
  }

  async softRemove(user: User, id: number) {
    return this.settingTypeRepository.findAndSoftDelete(user, { id });
  }

  async restore(user: User, id: number) {
    return this.settingTypeRepository.findAndRestore(user, { id });
  }
}
