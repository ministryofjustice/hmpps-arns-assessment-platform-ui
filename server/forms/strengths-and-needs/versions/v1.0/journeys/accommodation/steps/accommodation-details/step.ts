import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionComplete } from '../../../../constants/section'
import { sectionPath } from '../../../../constants/path'
import { sectionPageTitle } from '../../../../locales'

export const accommodationDetailsStep = step({
  path: `/${Step.accommodation_details.path}`,
  title: sectionPageTitle(Section.accommodation),
  view: {
    locals: {
      backlink: sectionPath(Section.accommodation),
    },
  },
  blocks: [
    accommodationSection.questions.livingWith.displayModes.field,
    accommodationSection.questions.noAccommodationReason.displayModes.field,
    accommodationSection.questions.pastAccommodationDetails.displayModes.field,
    accommodationSection.questions.suitableHousingLocation.displayModes.field,
    accommodationSection.questions.suitableHousing.displayModes.field,
    accommodationSection.questions.suitableHousingPlanned.displayModes.field,
    accommodationSection.questions.changes.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation, SectionComplete.no),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
    }),
  ],
})
