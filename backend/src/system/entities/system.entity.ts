import { Entity, JsonType, PrimaryKey, Property } from '@mikro-orm/postgresql';

class SystemMeta {
  activeStructureID: number;
  superUserList: string[];
  adminUserList: string[];
}

@Entity()
export class System {
  @PrimaryKey()
  id: number;

  @Property()
  scope: string;

  @Property({ type: JsonType, nullable: false })
  properties: SystemMeta;

  constructor(partial?: Partial<System>) {
    Object.assign(this, partial);
  }
}
