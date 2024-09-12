import { Migration } from '@mikro-orm/migrations';

export class Migration20240325043001 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "role" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "description" varchar(255) not null);',
    );
    this.addSql('create index "role_id_index" on "role" ("id");');
    this.addSql('create index "role_name_index" on "role" ("name");');
    this.addSql(
      'alter table "role" add constraint "role_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "service_type" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null);',
    );
    this.addSql(
      'create index "service_type_id_index" on "service_type" ("id");',
    );
    this.addSql(
      'create index "service_type_name_index" on "service_type" ("name");',
    );
    this.addSql(
      'alter table "service_type" add constraint "service_type_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "setting_type" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "name" varchar(255) not null, "pattern" jsonb not null);',
    );
    this.addSql(
      'create index "setting_type_id_index" on "setting_type" ("id");',
    );
    this.addSql(
      'create index "setting_type_name_index" on "setting_type" ("name");',
    );
    this.addSql(
      'alter table "setting_type" add constraint "setting_type_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "user" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idx" varchar(255) not null, "revision" int not null default 0, "is_active" boolean not null default true, "is_deleted" boolean not null default false, "deleted_at" varchar(255) null, "email" varchar(255) not null, "name" text not null, "role" text not null);',
    );
    this.addSql('create index "user_id_index" on "user" ("id");');
    this.addSql('create index "user_idx_index" on "user" ("idx");');
    this.addSql('create index "user_email_index" on "user" ("email");');
    this.addSql(
      'alter table "user" add constraint "user_email_unique" unique ("email");',
    );

    this.addSql(
      'create table "structure" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idx" varchar(255) not null, "revision" int not null default 0, "is_active" boolean not null default true, "is_deleted" boolean not null default false, "deleted_at" varchar(255) null, "name" varchar(255) not null, "description" varchar(255) not null, "user_id" int not null);',
    );
    this.addSql('create index "structure_id_index" on "structure" ("id");');
    this.addSql('create index "structure_idx_index" on "structure" ("idx");');
    this.addSql(
      'alter table "structure" add constraint "structure_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "setting" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idx" varchar(255) not null, "revision" int not null default 0, "is_active" boolean not null default true, "is_deleted" boolean not null default false, "deleted_at" varchar(255) null, "type_id" int not null, "extends" text[] not null, "properties" jsonb not null, "user_id" int not null);',
    );
    this.addSql('create index "setting_id_index" on "setting" ("id");');
    this.addSql('create index "setting_idx_index" on "setting" ("idx");');

    this.addSql(
      'create table "structure_settings" ("structure_id" int not null, "setting_id" int not null, constraint "structure_settings_pkey" primary key ("structure_id", "setting_id"));',
    );

    this.addSql(
      'create table "service" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idx" varchar(255) not null, "revision" int not null default 0, "is_active" boolean not null default true, "is_deleted" boolean not null default false, "deleted_at" varchar(255) null, "name" varchar(255) not null, "description" varchar(255) not null, "type_id" int not null, "user_id" int not null);',
    );
    this.addSql('create index "service_id_index" on "service" ("id");');
    this.addSql('create index "service_idx_index" on "service" ("idx");');
    this.addSql('create index "service_name_index" on "service" ("name");');
    this.addSql(
      'create index "service_description_index" on "service" ("description");',
    );

    this.addSql(
      'create table "structure_services" ("id" serial primary key, "structure_id" int not null, "service_id" int not null);',
    );

    this.addSql(
      'create table "service_settings" ("service_id" int not null, "setting_id" int not null, constraint "service_settings_pkey" primary key ("service_id", "setting_id"));',
    );

    this.addSql(
      'create table "service_roles" ("service_id" int not null, "role_id" int not null, constraint "service_roles_pkey" primary key ("service_id", "role_id"));',
    );

    this.addSql(
      'create table "service_descendants" ("id" serial primary key, "service_1_id" int not null, "service_2_id" int not null);',
    );

    this.addSql(
      'create table "component" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idx" varchar(255) not null, "revision" int not null default 0, "is_active" boolean not null default true, "is_deleted" boolean not null default false, "deleted_at" varchar(255) null, "name" varchar(255) not null, "description" varchar(255) not null, "user_id" int not null);',
    );
    this.addSql('create index "component_id_index" on "component" ("id");');
    this.addSql('create index "component_idx_index" on "component" ("idx");');
    this.addSql(
      'alter table "component" add constraint "component_name_unique" unique ("name");',
    );

    this.addSql(
      'create table "file" ("id" serial primary key, "created_at" timestamptz not null, "updated_at" timestamptz not null, "idx" varchar(255) not null, "revision" int not null default 0, "is_active" boolean not null default true, "is_deleted" boolean not null default false, "deleted_at" varchar(255) null, "name" varchar(255) not null, "component_id" int not null, "user_id" int not null);',
    );
    this.addSql('create index "file_id_index" on "file" ("id");');
    this.addSql('create index "file_idx_index" on "file" ("idx");');
    this.addSql('create index "file_name_index" on "file" ("name");');
    this.addSql(
      'alter table "file" add constraint "file_name_component_id_unique" unique ("name", "component_id");',
    );

    this.addSql(
      'alter table "structure" add constraint "structure_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "setting" add constraint "setting_type_id_foreign" foreign key ("type_id") references "setting_type" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "setting" add constraint "setting_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "structure_settings" add constraint "structure_settings_structure_id_foreign" foreign key ("structure_id") references "structure" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "structure_settings" add constraint "structure_settings_setting_id_foreign" foreign key ("setting_id") references "setting" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "service" add constraint "service_type_id_foreign" foreign key ("type_id") references "service_type" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "service" add constraint "service_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "structure_services" add constraint "structure_services_structure_id_foreign" foreign key ("structure_id") references "structure" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "structure_services" add constraint "structure_services_service_id_foreign" foreign key ("service_id") references "service" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "service_settings" add constraint "service_settings_service_id_foreign" foreign key ("service_id") references "service" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "service_settings" add constraint "service_settings_setting_id_foreign" foreign key ("setting_id") references "setting" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "service_roles" add constraint "service_roles_service_id_foreign" foreign key ("service_id") references "service" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "service_roles" add constraint "service_roles_role_id_foreign" foreign key ("role_id") references "role" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "service_descendants" add constraint "service_descendants_service_1_id_foreign" foreign key ("service_1_id") references "service" ("id") on update cascade on delete cascade;',
    );
    this.addSql(
      'alter table "service_descendants" add constraint "service_descendants_service_2_id_foreign" foreign key ("service_2_id") references "service" ("id") on update cascade on delete cascade;',
    );

    this.addSql(
      'alter table "component" add constraint "component_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );

    this.addSql(
      'alter table "file" add constraint "file_component_id_foreign" foreign key ("component_id") references "component" ("id") on update cascade;',
    );
    this.addSql(
      'alter table "file" add constraint "file_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
  }
}
