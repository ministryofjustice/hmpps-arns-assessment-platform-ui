import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { suitableHousingLocation, suitableHousing, accommodationChanges } from '../settled-accommodation/fields'
import { suitableHousingPlanned } from '../temporary-accommodation/fields'
import { Step } from '../../constants/step'
import { saveButton } from '../../../../constants/buttons'
import { Section, SectionStatus } from '../../../../constants/section'

export const temporaryAccommodationCasApStep = step({
  path: `/${Step.temporary_accommodation_cas_ap.path}`,
  title: 'Temporary accommodation', // TODO: contentFor('step.temporary_accommodation_cas_ap')
  blocks: [suitableHousingLocation, suitableHousing, suitableHousingPlanned, accommodationChanges, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress(Section.accommodation.statusKey, SectionStatus.incomplete),
        ],
        next: [redirect({ goto: Step.accommodation_summary.path })],
      },
    }),
  ],
})
