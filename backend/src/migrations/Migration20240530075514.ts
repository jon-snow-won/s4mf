import { Migration } from '@mikro-orm/migrations';

export class Migration20240530075514 extends Migration {
  async up(): Promise<void> {
    this.addSql('alter table "user" add column "roles_override" text[] null;');
  }

  async down(): Promise<void> {
    this.addSql('alter table "user" drop column "roles_override";');
  }
}
