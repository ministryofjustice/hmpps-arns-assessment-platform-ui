import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPageTitle } from '../../../../locales'
import { sectionTitleClass } from '../../../../constants/formVersion'

export const currentAccommodationStep = step({
  path: `/${Step.current_accommodation.path}`,
  title: sectionPageTitle(Section.accommodation),
  reachability: { entryWhen: true },
  view: {
    locals: {
      sectionTitleClass,
    },
  },
  blocks: [accommodationSection.questions.currentAccommodation.displayModes.field, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.no),
        ],
        next: [
          redirect({
            goto: Step.accommodation_details.path,
          }),
        ],
      },
    }),
  ],
})
