import { redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../effects'
import { codeOf, migrationPath } from '../sanMigration'
import { v1ToV2Migration } from './migration'
import { continueButton, migrationNoteCode, migrationNoteField, updatedExplanation, updatedHeading } from './fields'
import { formRootPath } from '../../versions/v1.0/constants/formVersion'
import { latestVersion } from '../../constants/formVersion'
import { onlyWhenNextMigration } from '../guards'
import config from '../../../../config'

const migrationCode = codeOf(v1ToV2Migration)

/**
 * Asks the practitioner what has changed, then runs the v1.0-to-v2.0 migration
 * with their answer and goes back to the migration index for the next one.
 */
export const v1ToV2MigrationStep = step({
  path: `/${migrationCode}`,
  title: 'This assessment has been updated',
  reachability: { entryWhen: true },
  view: {
    template: 'strengths-and-needs/views/san-step',
    locals: {
      basePath: `${formRootPath}/${latestVersion}`,
      hideNavigation: true,
      hideNavigationLinks: true,
      hidePreviousVersions: true,
      hideBackToTop: true,
      hmppsHeaderServiceNameLink: formRootPath,
      feedbackUrl: config.privateBetaFeedbackUrl,
    },
  },
  blocks: [updatedHeading, updatedExplanation, migrationNoteField, continueButton],
  onAccess: [onlyWhenNextMigration(migrationCode)],
  onSubmission: [
    submit({
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.runMigration(migrationCode, [migrationNoteCode])],
        next: [redirect({ goto: migrationPath })],
      },
    }),
  ],
})
