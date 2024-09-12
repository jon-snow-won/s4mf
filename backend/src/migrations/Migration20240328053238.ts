import { Migration } from '@mikro-orm/migrations';

export class Migration20240328053238 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "structure" drop constraint "structure_name_unique";',
    );

    this.addSql(
      'alter table "structure" add constraint "structure_name_revision_unique" unique ("name", "revision");',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "structure" drop constraint "structure_name_revision_unique";',
    );

    this.addSql(
      'alter table "structure" add constraint "structure_name_unique" unique ("name");',
    );
  }
}
