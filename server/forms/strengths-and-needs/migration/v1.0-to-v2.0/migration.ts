import { SanMigration } from '../sanMigration'
import { Section, SectionComplete } from '../../versions/v1.0/constants/section'

/**
 * PoC migration: keeps the practitioner's note as an answer that v2.0 adds, and
 * reopens accommodation as if v2.0 had added a question to that section.
 */
export const v1ToV2Migration: SanMigration = {
  from: 'v1.0',
  to: 'v2.0',
  migrate: ({ answers, properties }, inputs) => ({
    answers: { ...answers, poc_migration_note: inputs.poc_migration_note },
    properties: { ...properties, [Section.accommodation.statusKey]: SectionComplete.no },
  }),
}
