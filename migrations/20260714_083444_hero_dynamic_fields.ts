import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`site_settings_hero_floating_images\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`image_id\` integer NOT NULL,
  	FOREIGN KEY (\`image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_hero_floating_images_order_idx\` ON \`site_settings_hero_floating_images\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_floating_images_parent_id_idx\` ON \`site_settings_hero_floating_images\` (\`_parent_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_floating_images_image_idx\` ON \`site_settings_hero_floating_images\` (\`image_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_hero_second_statement_categories\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`text\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_hero_second_statement_categories_order_idx\` ON \`site_settings_hero_second_statement_categories\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_second_statement_categories_parent_id_idx\` ON \`site_settings_hero_second_statement_categories\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_hero_stats\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`label\` text NOT NULL,
  	\`value\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_hero_stats_order_idx\` ON \`site_settings_hero_stats\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_stats_parent_id_idx\` ON \`site_settings_hero_stats\` (\`_parent_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_float_speed\` numeric DEFAULT 16;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`hero_second_statement_headline\` text DEFAULT 'I build web interfaces, CMS-driven sites and internal tools teams actually use.';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`site_settings_hero_floating_images\`;`)
  await db.run(sql`DROP TABLE \`site_settings_hero_second_statement_categories\`;`)
  await db.run(sql`DROP TABLE \`site_settings_hero_stats\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_float_speed\`;`)
  await db.run(sql`ALTER TABLE \`site_settings\` DROP COLUMN \`hero_second_statement_headline\`;`)
}
