import * as migration_20260528_203617 from './20260528_203617';
import * as migration_20260601_145350 from './20260601_145350';
import * as migration_20260714_083444_hero_dynamic_fields from './20260714_083444_hero_dynamic_fields';

export const migrations = [
  {
    up: migration_20260528_203617.up,
    down: migration_20260528_203617.down,
    name: '20260528_203617',
  },
  {
    up: migration_20260601_145350.up,
    down: migration_20260601_145350.down,
    name: '20260601_145350',
  },
  {
    up: migration_20260714_083444_hero_dynamic_fields.up,
    down: migration_20260714_083444_hero_dynamic_fields.down,
    name: '20260714_083444_hero_dynamic_fields'
  },
];
