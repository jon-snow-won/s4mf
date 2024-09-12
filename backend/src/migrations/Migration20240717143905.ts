import { Migration } from '@mikro-orm/migrations';

export class Migration20240717143905 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create table "system" ("id" serial primary key, "scope" varchar(255) not null, "properties" jsonb not null);',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "system" cascade;');
  }
}
