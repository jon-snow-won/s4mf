import { Entity, PrimaryKey, Property } from '@mikro-orm/postgresql';
import { HelperService } from '../helpers/helpers.utils';
import { ApiProperty } from '@nestjs/swagger';

export interface IBaseEntity {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}

@Entity({ abstract: true })
export abstract class BaseEntity implements IBaseEntity {
  @PrimaryKey({ index: true })
  id!: number;

  @Property({ type: Date, lazy: true })
  @ApiProperty({ type: Date })
  createdAt? = HelperService.getTimeInUtc(new Date());

  @Property({
    onUpdate: () => HelperService.getTimeInUtc(new Date()),
    type: Date,
    lazy: true,
  })
  @ApiProperty({ type: Date })
  updatedAt? = HelperService.getTimeInUtc(new Date());
}

export abstract class PartialBaseEntity implements Partial<IBaseEntity> {
  id: number;
  createdAt?: Date;
  updatedAt?: Date;
}
