import { SettingType } from '../../setting-types/entities/setting-type.entity';
import { User } from '../../users/entities/user.entity';
import {
  ArrayType,
  Entity,
  JsonType,
  ManyToOne,
  Property,
} from '@mikro-orm/postgresql';
import {
  IMainBaseEntity,
  MainBaseEntity,
  PartialMainBaseEntity,
} from '../../common/entities/main-base.entity';
import { WithSoftDelete } from '../../common/filters/with-soft-delete.filter';

interface ISetting extends IMainBaseEntity {
  type: SettingType;
  extends: number[];
  properties: JSON;
  user: User;
}

@Entity()
@WithSoftDelete()
export class Setting extends MainBaseEntity<Setting> implements ISetting {
  @ManyToOne(() => SettingType)
  type: SettingType;

  @Property({ type: new ArrayType((i) => +i) })
  extends: number[];

  @Property({ type: JsonType })
  properties: JSON;

  @ManyToOne(() => User)
  user: User;
}

export class PartialSetting
  extends PartialMainBaseEntity<PartialSetting>
  implements Partial<ISetting>
{
  type?: SettingType;
  extends: number[];
  properties: JSON;
  user?: User;
}
