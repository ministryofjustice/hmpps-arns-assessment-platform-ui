import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionStatus } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'

export const employedEmploymentStep = step({
  path: `/${Step.employed.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  view: {
    locals: {
      backlink: sectionPath(Section.employment_and_education),
    },
  },
  blocks: [
    employmentEducationSection.fields.employmentSector.displayModes.field,
    employmentEducationSection.fields.employmentHistory.displayModes.field,
    employmentEducationSection.fields.dayToDayCommitments.displayModes.field,
    employmentEducationSection.fields.academicQualification.displayModes.field,
    employmentEducationSection.fields.professionalQualification.displayModes.field,
    employmentEducationSection.fields.jobSkills.displayModes.field,
    employmentEducationSection.fields.difficultiesReadingWritingNumeracy.displayModes.field,
    employmentEducationSection.fields.employmentExperience.displayModes.field,
    employmentEducationSection.fields.educationExperience.displayModes.field,
    employmentEducationSection.fields.changes.displayModes.field,
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
