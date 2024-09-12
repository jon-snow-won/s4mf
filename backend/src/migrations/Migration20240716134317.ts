import { Migration } from '@mikro-orm/migrations';

export class Migration20240716134317 extends Migration {
  async up(): Promise<void> {
    this.addSql(
      'alter table "setting_type" add column "user_id" int not null default 1;',
    );
    this.addSql(
      'alter table "setting_type" add constraint "setting_type_user_id_foreign" foreign key ("user_id") references "user" ("id") on update cascade;',
    );
  }

  async down(): Promise<void> {
    this.addSql(
      'alter table "setting_type" drop constraint "setting_type_user_id_foreign";',
    );

    this.addSql('alter table "setting_type" drop column "user_id";');
  }
}
