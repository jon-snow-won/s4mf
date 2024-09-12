import {
  PartialService,
  Service,
} from '../../services/entities/service.entity';
import { User } from '../../users/entities/user.entity';
import {
  Collection,
  Entity,
  ManyToMany,
  ManyToOne,
  Property,
  Unique,
} from '@mikro-orm/postgresql';
import {
  IMainBaseEntity,
  MainBaseEntity,
  PartialMainBaseEntity,
} from '../../common/entities/main-base.entity';
import {
  PartialSetting,
  Setting,
} from '../../settings/entities/settings.entity';
import { WithSoftDelete } from '../../common/filters/with-soft-delete.filter';
import { ApiProperty } from '@nestjs/swagger';

export interface IStructure extends IMainBaseEntity {
  name: string;
  description: string;
  services: Collection<Service> | PartialService[];
  settings: Collection<Setting> | PartialSetting[];
  user: User;
  isActive: boolean;
}

@Entity()
@WithSoftDelete()
@Unique({ properties: ['name', 'revision'] })
export class Structure extends MainBaseEntity<Structure> implements IStructure {
  @Property()
  name: string;

  @Property()
  description: string;

  @ManyToMany({ entity: () => Service, fixedOrder: true })
  @ApiProperty({ type: [Service], default: [] })
  services = new Collection<Service>(this);

  @ManyToMany({ entity: () => Setting })
  @ApiProperty({ type: [Setting], default: [] })
  settings = new Collection<Setting>(this);

  @ManyToOne(() => User)
  user: User;

  @Property({ default: false, type: Boolean, index: true })
  isActive: boolean = false;
}

export class PartialStructure
  extends PartialMainBaseEntity<PartialStructure>
  implements Partial<IStructure>
{
  name: string;
  description?: string;
  services?: PartialService[];
  settings?: PartialSetting[];
  user?: User;
  isActive: boolean;
}
