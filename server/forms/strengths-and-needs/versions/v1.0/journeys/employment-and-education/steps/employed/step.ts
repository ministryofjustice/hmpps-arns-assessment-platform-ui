import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  academicQualification,
  dayToDayCommitments,
  difficultiesReadingWritingNumeracy,
  educationExperience,
  employmentAndEducationChanges,
  employmentExperience,
  employmentHistory,
  employmentSector,
  jobSkills,
  professionalQualifications,
} from './fields'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionPath } from '../../../../constants/path'

export const employedEmploymentStep = step({
  path: `/${Step.employed.path}`,
  title: 'Employed', // TODO: contentFor('step.employed')
  view: {
    locals: {
      backlink: sectionPath(Section.employment_and_education),
    },
  },
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
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.employment_and_education.statusKey,
            SectionStatus.incomplete,
          ),
        ],
        next: [redirect({ goto: Step.employment_education_summary.path })],
      },
    }),
  ],
})
