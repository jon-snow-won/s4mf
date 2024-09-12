import {
  IMainBaseEntity,
  MainBaseEntity,
  PartialMainBaseEntity,
} from 'common/entities/main-base.entity';
import { Entity, JsonType, ManyToOne, Property } from '@mikro-orm/postgresql';
import { User } from 'users/entities/user.entity';
import { WithSoftDelete } from 'common/filters/with-soft-delete.filter';

interface ISettingType extends IMainBaseEntity {
  name: string;
  pattern: JSON;
}

@Entity()
@WithSoftDelete()
export class SettingType
  extends MainBaseEntity<SettingType>
  implements ISettingType
{
  @Property({ index: true, unique: true })
  name: string;

  @Property({ type: JsonType })
  pattern: JSON;

  @ManyToOne(() => User)
  user: User;
}

export class PartialSettingType
  extends PartialMainBaseEntity<SettingType>
  implements Partial<ISettingType>
{
  name: string;
  pattern?: JSON;
  user?: User;
}
