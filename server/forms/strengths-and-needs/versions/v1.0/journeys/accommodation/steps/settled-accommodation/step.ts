import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { livingWith, suitableHousingLocation, suitableHousing, accommodationChanges } from './fields'
import { saveButton } from '../../../../constants/buttons'
import { locale } from '../../constants/locale'
import { Step } from '../../constants/step'
import { Section, SectionStatus } from '../../../../constants/section'

export const settledAccommodationStep = step({
  path: `/${Step.settled_accommodation.path}`,
  title: locale.step[Step.settled_accommodation.code],
  blocks: [livingWith, suitableHousingLocation, suitableHousing, accommodationChanges, saveButton],
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
