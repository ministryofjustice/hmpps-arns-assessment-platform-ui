import { SanMigration } from './sanMigration'
import { v1ToV2Migration } from './v1.0-to-v2.0/migration'

/**
 * Every SAN migration, one per hop between consecutive form versions.
 *
 * Like formConfigRegistry, this stays clear of the journey and effects module
 * graph so effects can read it without a circular import.
 */
export const sanMigrations: SanMigration[] = [v1ToV2Migration]
