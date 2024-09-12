import { Entity, Property } from '@mikro-orm/postgresql';
import { BaseEntity, IBaseEntity, PartialBaseEntity } from './base.entity';
import { randomUUID } from 'node:crypto';

export interface IMainBaseEntity extends IBaseEntity {
  idx?: string;
  revision: number;
  isDeleted?: boolean;
  deletedAt?: Date | null;
}

@Entity({ abstract: true })
export abstract class MainBaseEntity<T>
  extends BaseEntity
  implements IMainBaseEntity
{
  @Property({
    index: true,
    lazy: true,
  })
  idx: string = randomUUID();

  @Property({ default: 0 })
  revision: number = 0;

  @Property({
    index: true,
    type: Boolean,
    default: false,
    lazy: true,
  })
  isDeleted?: boolean = false;

  @Property({
    index: true,
    nullable: true,
    default: null,
    type: Date,
    lazy: true,
  })
  deletedAt?: Date | null = null;

  constructor(partial?: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}

export abstract class PartialMainBaseEntity<T>
  extends PartialBaseEntity
  implements Partial<IMainBaseEntity>
{
  idx?: string;
  revision?: number;
  isDeleted?: boolean;
  deletedAt?: Date | null;

  constructor(partial?: Partial<T>) {
    super();
    Object.assign(this, partial);
  }
}
