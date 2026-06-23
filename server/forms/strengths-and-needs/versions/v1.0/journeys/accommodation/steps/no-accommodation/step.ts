import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { accommodationChanges } from '../settled-accommodation/fields'
import { suitableHousingPlanned } from '../temporary-accommodation/fields'
import { noAccommodationReason, pastAccommodationDetails } from './fields'
import { saveButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'

export const noAccommodationStep = step({
  path: `/${Step.no_accommodation.path}`,
  title: 'No accommodation', // TODO: contentFor('step.no_accommodation')
  blocks: [noAccommodationReason, pastAccommodationDetails, suitableHousingPlanned, accommodationChanges, saveButton],
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
