import { User } from '../../users/entities/user.entity';
import { Entity, ManyToOne, Property, Unique } from '@mikro-orm/postgresql';
import {
  IMainBaseEntity,
  MainBaseEntity,
  PartialMainBaseEntity,
} from '../../common/entities/main-base.entity';

export interface IFile extends IMainBaseEntity {
  name: string;
  user: User;
}

@Entity()
@Unique({ properties: ['name'] })
export class File extends MainBaseEntity<File> implements IFile {
  @Property({ index: true })
  public name: string;

  @ManyToOne(() => User)
  user: User;
}

export class PartialFile
  extends PartialMainBaseEntity<PartialFile>
  implements Partial<IFile>
{
  name: string;
  user?: User;
}
