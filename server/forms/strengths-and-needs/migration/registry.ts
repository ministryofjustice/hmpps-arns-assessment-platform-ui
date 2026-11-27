import { SanMigration } from './sanMigration'
import { Section, SectionComplete } from '../versions/v2.0/constants/section'
import { previousToNextVersionTransform } from './mappings'

/**
 * Every SAN migration, one per hop between consecutive form versions.
 *
 * Like formConfigRegistry, this stays clear of the journey and effects module
 * graph so effects can read it without a circular import.
 */
export const v1ToV2Migration: SanMigration = {
  from: 'v1.0',
  to: 'v2.0',
  migrate: ({ answers, properties }) => ({
    answers: { ...previousToNextVersionTransform(answers) },
    properties: { ...properties, [Section.accommodation.statusKey]: SectionComplete.no },
  }),
}

export const sanMigrations: SanMigration[] = [v1ToV2Migration]
