import { Migration } from '@mikro-orm/migrations';

export class Migration20240527121853 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" drop column "role";');

    this.addSql('alter table "user" add column "roles" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "roles";');

    this.addSql('alter table "user" add column "role" text not null;');
  }
}
