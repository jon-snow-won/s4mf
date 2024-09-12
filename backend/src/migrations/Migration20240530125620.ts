import { Migration } from '@mikro-orm/migrations';

export class Migration20240530125620 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "role" add column "idx" varchar(255) not null default \'00000000-0000-0000-0000-000000000000\', add column "revision" int not null default 0, add column "is_active" boolean not null default true, add column "is_deleted" boolean not null default false, add column "deleted_at" timestamptz null;',
    );
    this.addSql('create index "role_idx_index" on "role" ("idx");');
    this.addSql(
      'create index "role_is_deleted_index" on "role" ("is_deleted");',
    );
    this.addSql(
      'create index "role_deleted_at_index" on "role" ("deleted_at");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "role_idx_index";');
    this.addSql('drop index "role_is_deleted_index";');
    this.addSql('drop index "role_deleted_at_index";');
    this.addSql('alter table "role" drop column "idx";');
    this.addSql('alter table "role" drop column "revision";');
    this.addSql('alter table "role" drop column "is_active";');
    this.addSql('alter table "role" drop column "is_deleted";');
    this.addSql('alter table "role" drop column "deleted_at";');
  }
}
