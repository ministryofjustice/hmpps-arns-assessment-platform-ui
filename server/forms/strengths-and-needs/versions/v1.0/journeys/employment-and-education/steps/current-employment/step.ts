import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { employmentEducationSection } from '../../section'
import { Section, SectionComplete } from '../../../../constants/section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { sectionTitleClass } from '../../../../constants/formVersion'
import { sectionPageTitle } from '../../../../locales'

export const currentEmploymentStep = step({
  path: `/${Step.current_employment.path}`,
  title: sectionPageTitle(Section.employment_and_education),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [employmentEducationSection.fields.currentEmploymentStatus.displayModes.field, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(
            Section.employment_and_education.statusKey,
            SectionComplete.no,
          ),
        ],
        next: [
          redirect({
            goto: Step.employed.path,
          }),
        ],
      },
    }),
  ],
})
