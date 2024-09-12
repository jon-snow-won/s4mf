import { File, PartialFile } from '../../files/entities/file.entity';
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
import { ApiProperty } from '@nestjs/swagger';

export interface IComponent extends IMainBaseEntity {
  name: string;
  description: string;
  files: Collection<File> | PartialFile[];
  user: User;
}

@Entity()
export class Component extends MainBaseEntity<Component> implements IComponent {
  @Property({ unique: true })
  public name: string;

  @Property()
  public description: string;

  @ManyToMany(() => File)
  @ApiProperty({ type: [File], default: [] })
  public files = new Collection<File>(this);

  @ManyToOne(() => User)
  public user: User;
}

export class PartialComponent
  extends PartialMainBaseEntity<PartialComponent>
  implements Partial<IComponent>
{
  name: string;
  description?: string;
  files?: PartialFile[];
  user?: User;
}
