import { step, submitTransition, redirect, block, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  employmentSector,
  dayToDayCommitments,
  academicQualification,
  employmentHistory,
  professionalQualifications, jobSkills, difficultiesReadingWritingNumeracy, employmentExperience, educationExperience,
  employmentAndEducationChanges
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
  blocks: [employmentSector, employmentHistory, dayToDayCommitments, academicQualification,
    professionalQualifications, jobSkills, difficultiesReadingWritingNumeracy, employmentExperience,
    educationExperience, employmentAndEducationChanges, saveButton],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: 'employment-education-summary' })],
      },
    }),
  ],
})
