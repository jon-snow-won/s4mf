import { Entity, Property } from '@mikro-orm/postgresql';
import { MainBaseEntity } from '../../common/entities/main-base.entity';

@Entity()
export class Role extends MainBaseEntity<Role> {
  @Property({ unique: true, index: true })
  name: string;

  @Property()
  description: string;
}
