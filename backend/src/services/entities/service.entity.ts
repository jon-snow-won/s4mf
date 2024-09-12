import {
  PartialSetting,
  Setting,
} from '../../settings/entities/settings.entity';
import { ServiceType } from './service-type.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
} from '@mikro-orm/postgresql';
import {
  IMainBaseEntity,
  MainBaseEntity,
  PartialMainBaseEntity,
} from '../../common/entities/main-base.entity';
import { WithSoftDelete } from '../../common/filters/with-soft-delete.filter';
import { ApiProperty } from '@nestjs/swagger';
import { WithUser } from '../../common/filters/with-user.filter';

export interface IService extends IMainBaseEntity {
  name: string;
  description: string;
  type: ServiceType;
  roles: Collection<Role> | Role[];
  settings: Collection<Setting> | PartialSetting[];
  descendants: Collection<Service> | PartialService[];
  user: User;
}

@Entity()
@WithSoftDelete()
@WithUser()
export class Service extends MainBaseEntity<Service> implements IService {
  @Property({ index: true })
  name: string;

  @Property({ index: true })
  description: string;

  @ManyToOne(() => ServiceType)
  type: ServiceType;

  @ManyToMany(() => Role)
  @ApiProperty({ type: [Role], default: [] })
  roles = new Collection<Role>(this);

  @ManyToMany({ entity: () => Setting, owner: true })
  @ApiProperty({ type: [Setting], default: [] })
  settings = new Collection<Setting>(this);

  @ManyToMany({ entity: () => Service, fixedOrder: true })
  @ApiProperty({ type: [Service], default: [] })
  descendants = new Collection<Service>(this);

  @ManyToOne(() => User)
  user: User;
}

export class PartialService
  extends PartialMainBaseEntity<PartialService>
  implements Partial<IService>
{
  name: string;
  description?: string;
  type?: ServiceType;
  roles?: Role[];
  settings?: PartialSetting[];
  descendants?: PartialService[];
  user?: User;
}
