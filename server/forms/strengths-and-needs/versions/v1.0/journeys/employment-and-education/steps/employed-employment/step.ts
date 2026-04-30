import { step, submit, redirect, block, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  employmentSector,
  dayToDayCommitments,
  academicQualification,
  employmentHistory,
  professionalQualifications,
  jobSkills,
  difficultiesReadingWritingNumeracy,
  employmentExperience,
  educationExperience,
  employmentAndEducationChanges,
} from './fields'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const employedEmploymentStep = step({
  path: '/employed',
  title: 'Employed',
  blocks: [
    employmentSector,
    employmentHistory,
    dayToDayCommitments,
    academicQualification,
    professionalQualifications,
    jobSkills,
    difficultiesReadingWritingNumeracy,
    employmentExperience,
    educationExperience,
    employmentAndEducationChanges,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'employment-education-summary' })],
      },
    }),
  ],
})
