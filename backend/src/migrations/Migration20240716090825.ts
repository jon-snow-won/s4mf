import { Migration } from '@mikro-orm/migrations';

export class Migration20240716090825 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "setting_type" add column "idx" varchar(255) not null default \'00000000-0000-0000-0000-000000000000\', add column "revision" int not null default 0, add column "is_active" boolean not null default true, add column "is_deleted" boolean not null default false, add column "deleted_at" timestamptz null;',
    );
    this.addSql(
      'create index "setting_type_idx_index" on "setting_type" ("idx");',
    );
    this.addSql(
      'create index "setting_type_is_deleted_index" on "setting_type" ("is_deleted");',
    );
    this.addSql(
      'create index "setting_type_deleted_at_index" on "setting_type" ("deleted_at");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "setting_type_idx_index";');
    this.addSql('drop index "setting_type_is_deleted_index";');
    this.addSql('drop index "setting_type_deleted_at_index";');
    this.addSql('alter table "setting_type" drop column "idx";');
    this.addSql('alter table "setting_type" drop column "revision";');
    this.addSql('alter table "setting_type" drop column "is_active";');
    this.addSql('alter table "setting_type" drop column "is_deleted";');
    this.addSql('alter table "setting_type" drop column "deleted_at";');
  }
}
