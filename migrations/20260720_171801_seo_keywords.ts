import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`CREATE TABLE \`posts_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`posts_seo_keywords_order_idx\` ON \`posts_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`posts_seo_keywords_parent_id_idx\` ON \`posts_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`_posts_v_version_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`keyword\` text,
  	\`_uuid\` text,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`_posts_v\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`_posts_v_version_seo_keywords_order_idx\` ON \`_posts_v_version_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_seo_keywords_parent_id_idx\` ON \`_posts_v_version_seo_keywords\` (\`_parent_id\`);`)
  await db.run(sql`CREATE TABLE \`site_settings_seo_keywords\` (
  	\`_order\` integer NOT NULL,
  	\`_parent_id\` integer NOT NULL,
  	\`id\` text PRIMARY KEY NOT NULL,
  	\`keyword\` text NOT NULL,
  	FOREIGN KEY (\`_parent_id\`) REFERENCES \`site_settings\`(\`id\`) ON UPDATE no action ON DELETE cascade
  );
  `)
  await db.run(sql`CREATE INDEX \`site_settings_seo_keywords_order_idx\` ON \`site_settings_seo_keywords\` (\`_order\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_keywords_parent_id_idx\` ON \`site_settings_seo_keywords\` (\`_parent_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`DROP TABLE \`posts_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`_posts_v_version_seo_keywords\`;`)
  await db.run(sql`DROP TABLE \`site_settings_seo_keywords\`;`)
}
