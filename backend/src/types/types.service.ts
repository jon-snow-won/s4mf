import { Injectable } from '@nestjs/common';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ServiceType } from '../services/entities/service-type.entity';

@Injectable()
export class TypesService {
  constructor(
    private readonly em: EntityManager,
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: EntityRepository<ServiceType>,
  ) {}

  getServiceTypes(): Promise<ServiceType[]> {
    return this.serviceTypeRepository.findAll({ orderBy: { id: 'ASC' } });
  }
}
