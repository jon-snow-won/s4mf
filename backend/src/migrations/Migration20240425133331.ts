import { Migration } from '@mikro-orm/migrations';

export class Migration20240425133331 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "kube_config" text null;');
    this.addSql(
      'alter table "user" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );

    this.addSql(
      'alter table "structure" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );

    this.addSql(
      'alter table "setting" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );

    this.addSql(
      'alter table "service" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );

    this.addSql(
      'alter table "file" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );

    this.addSql(
      'alter table "component" alter column "deleted_at" type timestamptz using ("deleted_at"::timestamptz);',
    );
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "kube_config";');

    this.addSql(
      'alter table "user" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));',
    );

    this.addSql(
      'alter table "structure" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));',
    );

    this.addSql(
      'alter table "setting" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));',
    );

    this.addSql(
      'alter table "service" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));',
    );

    this.addSql(
      'alter table "file" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));',
    );

    this.addSql(
      'alter table "component" alter column "deleted_at" type varchar(255) using ("deleted_at"::varchar(255));',
    );
  }
}
