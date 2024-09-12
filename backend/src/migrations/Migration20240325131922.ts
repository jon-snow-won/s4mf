import { Migration } from '@mikro-orm/migrations';

export class Migration20240325131922 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "component_files" ("component_id" int not null, "file_id" int not null, constraint "component_files_pkey" primary key ("component_id", "file_id"));',
    );

    this.addSql(
      'alter table "component_files" add constraint "component_files_component_id_foreign" foreign key ("component_id") references "component" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "component_files" add constraint "component_files_file_id_foreign" foreign key ("file_id") references "file" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "file" drop constraint "file_component_id_foreign";',
    );

    this.addSql(
      'alter table "file" drop constraint "file_name_component_id_unique";',
    );
    this.addSql('alter table "file" drop column "component_id";');

    this.addSql(
      'alter table "file" add constraint "file_name_unique" unique ("name");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "component_files" cascade;');

    this.addSql('alter table "file" drop constraint "file_name_unique";');

    this.addSql('alter table "file" add column "component_id" int not null;');
    this.addSql(
      'alter table "file" add constraint "file_component_id_foreign" foreign key ("component_id") references "component" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "file" add constraint "file_name_component_id_unique" unique ("name", "component_id");',
    );
  }
}
