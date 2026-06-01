import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-sqlite'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`posts\` ADD \`seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`posts_seo_seo_image_idx\` ON \`posts\` (\`seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`_posts_v\` ADD \`version_seo_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_seo_version_seo_image_idx\` ON \`_posts_v\` (\`version_seo_image_id\`);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`resume_id\` integer REFERENCES media(id);`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_title\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_description\` text;`)
  await db.run(sql`ALTER TABLE \`site_settings\` ADD \`seo_og_image_id\` integer REFERENCES media(id);`)
  await db.run(sql`CREATE INDEX \`site_settings_resume_idx\` ON \`site_settings\` (\`resume_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_seo_seo_og_image_idx\` ON \`site_settings\` (\`seo_og_image_id\`);`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.run(sql`PRAGMA foreign_keys=OFF;`)
  await db.run(sql`CREATE TABLE \`__new_posts\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`title\` text,
  	\`slug\` text,
  	\`featured\` integer DEFAULT true,
  	\`sort_order\` numeric DEFAULT 100,
  	\`published_at\` text,
  	\`read_time\` text DEFAULT '3 min read',
  	\`excerpt\` text,
  	\`body\` text,
  	\`cover_image_id\` integer,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`_status\` text DEFAULT 'draft',
  	FOREIGN KEY (\`cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_posts\`("id", "title", "slug", "featured", "sort_order", "published_at", "read_time", "excerpt", "body", "cover_image_id", "updated_at", "created_at", "_status") SELECT "id", "title", "slug", "featured", "sort_order", "published_at", "read_time", "excerpt", "body", "cover_image_id", "updated_at", "created_at", "_status" FROM \`posts\`;`)
  await db.run(sql`DROP TABLE \`posts\`;`)
  await db.run(sql`ALTER TABLE \`__new_posts\` RENAME TO \`posts\`;`)
  await db.run(sql`PRAGMA foreign_keys=ON;`)
  await db.run(sql`CREATE UNIQUE INDEX \`posts_slug_idx\` ON \`posts\` (\`slug\`);`)
  await db.run(sql`CREATE INDEX \`posts_cover_image_idx\` ON \`posts\` (\`cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`posts_updated_at_idx\` ON \`posts\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`posts_created_at_idx\` ON \`posts\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`posts__status_idx\` ON \`posts\` (\`_status\`);`)
  await db.run(sql`CREATE TABLE \`__new__posts_v\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`parent_id\` integer,
  	\`version_title\` text,
  	\`version_slug\` text,
  	\`version_featured\` integer DEFAULT true,
  	\`version_sort_order\` numeric DEFAULT 100,
  	\`version_published_at\` text,
  	\`version_read_time\` text DEFAULT '3 min read',
  	\`version_excerpt\` text,
  	\`version_body\` text,
  	\`version_cover_image_id\` integer,
  	\`version_updated_at\` text,
  	\`version_created_at\` text,
  	\`version__status\` text DEFAULT 'draft',
  	\`created_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`updated_at\` text DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')) NOT NULL,
  	\`latest\` integer,
  	FOREIGN KEY (\`parent_id\`) REFERENCES \`posts\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`version_cover_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new__posts_v\`("id", "parent_id", "version_title", "version_slug", "version_featured", "version_sort_order", "version_published_at", "version_read_time", "version_excerpt", "version_body", "version_cover_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest") SELECT "id", "parent_id", "version_title", "version_slug", "version_featured", "version_sort_order", "version_published_at", "version_read_time", "version_excerpt", "version_body", "version_cover_image_id", "version_updated_at", "version_created_at", "version__status", "created_at", "updated_at", "latest" FROM \`_posts_v\`;`)
  await db.run(sql`DROP TABLE \`_posts_v\`;`)
  await db.run(sql`ALTER TABLE \`__new__posts_v\` RENAME TO \`_posts_v\`;`)
  await db.run(sql`CREATE INDEX \`_posts_v_parent_idx\` ON \`_posts_v\` (\`parent_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_slug_idx\` ON \`_posts_v\` (\`version_slug\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_cover_image_idx\` ON \`_posts_v\` (\`version_cover_image_id\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_updated_at_idx\` ON \`_posts_v\` (\`version_updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version_created_at_idx\` ON \`_posts_v\` (\`version_created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_version_version__status_idx\` ON \`_posts_v\` (\`version__status\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_created_at_idx\` ON \`_posts_v\` (\`created_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_updated_at_idx\` ON \`_posts_v\` (\`updated_at\`);`)
  await db.run(sql`CREATE INDEX \`_posts_v_latest_idx\` ON \`_posts_v\` (\`latest\`);`)
  await db.run(sql`CREATE TABLE \`__new_site_settings\` (
  	\`id\` integer PRIMARY KEY NOT NULL,
  	\`site_name\` text DEFAULT 'Developer Portfolio' NOT NULL,
  	\`name\` text DEFAULT 'Your Name' NOT NULL,
  	\`title\` text DEFAULT 'Full-stack developer' NOT NULL,
  	\`headline\` text DEFAULT 'I build fast, useful products with clean interfaces and reliable systems.' NOT NULL,
  	\`intro\` text DEFAULT 'A portfolio starter wired to Payload CMS for projects, skills, experience, media, and site copy.' NOT NULL,
  	\`availability\` text DEFAULT 'Available for selected projects',
  	\`location\` text DEFAULT 'Remote',
  	\`email\` text,
  	\`resume_url\` text,
  	\`logo_id\` integer,
  	\`hero_image_id\` integer,
  	\`updated_at\` text,
  	\`created_at\` text,
  	FOREIGN KEY (\`logo_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null,
  	FOREIGN KEY (\`hero_image_id\`) REFERENCES \`media\`(\`id\`) ON UPDATE no action ON DELETE set null
  );
  `)
  await db.run(sql`INSERT INTO \`__new_site_settings\`("id", "site_name", "name", "title", "headline", "intro", "availability", "location", "email", "resume_url", "logo_id", "hero_image_id", "updated_at", "created_at") SELECT "id", "site_name", "name", "title", "headline", "intro", "availability", "location", "email", "resume_url", "logo_id", "hero_image_id", "updated_at", "created_at" FROM \`site_settings\`;`)
  await db.run(sql`DROP TABLE \`site_settings\`;`)
  await db.run(sql`ALTER TABLE \`__new_site_settings\` RENAME TO \`site_settings\`;`)
  await db.run(sql`CREATE INDEX \`site_settings_logo_idx\` ON \`site_settings\` (\`logo_id\`);`)
  await db.run(sql`CREATE INDEX \`site_settings_hero_image_idx\` ON \`site_settings\` (\`hero_image_id\`);`)
}
