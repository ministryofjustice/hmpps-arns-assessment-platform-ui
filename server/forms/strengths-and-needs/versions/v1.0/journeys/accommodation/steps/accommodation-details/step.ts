import { Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationSection } from '../../section'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'
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
    accommodationSection.fields.livingWith.displayModes.field,
    accommodationSection.fields.noAccommodationReason.displayModes.field,
    accommodationSection.fields.pastAccommodationDetails.displayModes.field,
    accommodationSection.fields.suitableHousingLocation.displayModes.field,
    accommodationSection.fields.suitableHousing.displayModes.field,
    accommodationSection.fields.suitableHousingPlanned.displayModes.field,
    accommodationSection.fields.changes.displayModes.field,
    saveButton,
  ],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation.statusKey, SectionStatus.incomplete),
          StrengthsAndNeedsEffects.persistOasysEquivalent(),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
    }),
  ],
})
