import { Migration } from '@mikro-orm/migrations';

export class Migration20240723130417 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "role" drop column "is_active";');

    this.addSql('alter table "user" drop column "is_active";');

    this.addSql('alter table "structure" drop column "is_active";');

    this.addSql('alter table "setting_type" drop column "is_active";');

    this.addSql('alter table "setting" drop column "is_active";');

    this.addSql('alter table "service" drop column "is_active";');

    this.addSql('alter table "file" drop column "is_active";');

    this.addSql('alter table "component" drop column "is_active";');
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "role" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "user" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "structure" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "setting_type" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "setting" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "service" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "file" add column "is_active" boolean not null default true;',
    );

    this.addSql(
      'alter table "component" add column "is_active" boolean not null default true;',
    );
  }
}
