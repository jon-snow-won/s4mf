import { Migration } from '@mikro-orm/migrations';

export class Migration20240329191428 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'create index "user_is_deleted_index" on "user" ("is_deleted");',
    );
    this.addSql(
      'create index "user_deleted_at_index" on "user" ("deleted_at");',
    );

    this.addSql(
      'create index "structure_is_deleted_index" on "structure" ("is_deleted");',
    );
    this.addSql(
      'create index "structure_deleted_at_index" on "structure" ("deleted_at");',
    );

    this.addSql(
      'create index "setting_is_deleted_index" on "setting" ("is_deleted");',
    );
    this.addSql(
      'create index "setting_deleted_at_index" on "setting" ("deleted_at");',
    );

    this.addSql(
      'create index "service_is_deleted_index" on "service" ("is_deleted");',
    );
    this.addSql(
      'create index "service_deleted_at_index" on "service" ("deleted_at");',
    );

    this.addSql(
      'create index "file_is_deleted_index" on "file" ("is_deleted");',
    );
    this.addSql(
      'create index "file_deleted_at_index" on "file" ("deleted_at");',
    );

    this.addSql(
      'create index "component_is_deleted_index" on "component" ("is_deleted");',
    );
    this.addSql(
      'create index "component_deleted_at_index" on "component" ("deleted_at");',
    );
  }

  async down(): Promise<void> {
    this.addSql('drop index "user_is_deleted_index";');
    this.addSql('drop index "user_deleted_at_index";');

    this.addSql('drop index "structure_is_deleted_index";');
    this.addSql('drop index "structure_deleted_at_index";');

    this.addSql('drop index "setting_is_deleted_index";');
    this.addSql('drop index "setting_deleted_at_index";');

    this.addSql('drop index "service_is_deleted_index";');
    this.addSql('drop index "service_deleted_at_index";');

    this.addSql('drop index "file_is_deleted_index";');
    this.addSql('drop index "file_deleted_at_index";');

    this.addSql('drop index "component_is_deleted_index";');
    this.addSql('drop index "component_deleted_at_index";');
  }
}
