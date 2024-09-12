import { Entity, Property } from '@mikro-orm/postgresql';
import { MainBaseEntity } from '../../common/entities/main-base.entity';

@Entity()
export class User extends MainBaseEntity<User> {
  @Property({ unique: true, index: true })
  public email: string;

  @Property({ type: 'text' })
  public name: string;

  @Property({ type: Array<string>, nullable: true })
  public roles: string[];

  @Property({ type: Array<string>, nullable: true })
  public rolesOverride: string[];

  @Property({ type: 'text', nullable: true, lazy: true })
  public kubeConfig: string;

  @Property({ persist: false })
  isSuperuser: boolean = false;
  @Property({ persist: false })
  isAdmin: boolean = false;
  @Property({ persist: false })
  hasRolesOverride: boolean = false;
  @Property({ persist: false })
  hasKubeConfig: boolean = false;
}
