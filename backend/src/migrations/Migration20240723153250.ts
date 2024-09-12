import { Migration } from '@mikro-orm/migrations';

export class Migration20240723153250 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "structure" add column "is_active" boolean not null default false;',
    );
    this.addSql(
      'create index "structure_is_active_index" on "structure" ("is_active");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "structure_is_active_index";');
    this.addSql('alter table "structure" drop column "is_active";');
  }
}
