import {
  access,
  and,
  Condition,
  Data,
  journey,
  not,
  redirect,
  Session,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../effects'
import { commonContentFor } from '../versions/v1.0/locales'
import { formRootPath } from '../versions/v1.0/constants/formVersion'
import { v1ToV2MigrationStep } from './v1.0-to-v2.0/step'

// Migrating writes to the assessment, so only a practitioner editing its current
// version (not a historic one) who has been through the privacy screen may trigger it.
const canMigrate = and(
  Session('mode').match(Condition.Equals('edit')),
  Data('sessionDetails.accessMode').match(Condition.Equals('READ_WRITE')),
  Data('privacyAccepted').match(Condition.Equals(true)),
)

/**
 * Sends the practitioner to the page of the next migration due, or back into
 * the form once the assessment is on the latest version.
 */
const migrationIndexStep = step({
  path: '/',
  title: commonContentFor('strengths_and_needs'),
  reachability: { entryWhen: true },
  onAccess: [
    access({
      when: Data('nextMigrationPath').match(Condition.IsRequired()),
      next: [redirect({ goto: Data('nextMigrationPath') })],
    }),
    access({
      effects: [StrengthsAndNeedsEffects.generateInitialFormUrl()],
      next: [redirect({ goto: Data('initialFormUrl') })],
    }),
  ],
})

/**
 * Strengths and Needs migration journey
 *
 * Upgrades an assessment saved in an older form version to the latest one, one
 * version at a time. Each version's journey sends edit-mode access here when a
 * migration is due. Each migration's page runs and saves that migration, then
 * comes back to the index for the next.
 *
 * Structure:
 * /strengths-and-needs/migration/
 * ├── /                - Redirects to the next migration due, or back into the form
 * └── /v1.0-to-v2.0    - PoC migration asking the practitioner what has changed
 */
export const migrationJourney = journey({
  code: 'strengths-and-needs-migration',
  title: commonContentFor('strengths_and_needs'),
  path: '/migration',
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.initializeSessionFromAccess(), StrengthsAndNeedsEffects.loadSessionData()],
    }),
    access({
      when: not(canMigrate),
      next: [redirect({ goto: formRootPath })],
    }),
    access({
      effects: [StrengthsAndNeedsEffects.loadAssessment(), StrengthsAndNeedsEffects.findNextMigration()],
    }),
  ],
  steps: [migrationIndexStep, v1ToV2MigrationStep],
})
