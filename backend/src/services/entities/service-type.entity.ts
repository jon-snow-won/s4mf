import { Entity, Property } from '@mikro-orm/postgresql';
import { BaseEntity } from '../../common/entities/base.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class ServiceType extends BaseEntity {
  @ApiProperty()
  @Property({ unique: true, index: true })
  name: string;
}
