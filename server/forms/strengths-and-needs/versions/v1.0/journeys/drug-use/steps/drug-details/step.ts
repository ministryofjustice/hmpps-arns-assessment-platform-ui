import { step, submitTransition, accessTransition, redirect, Post } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import {
  usedInLastSixMonthsSection,
  sectionDivider,
  usedMoreThanSixMonthsSection,
  injectedDrugsField,
  receivingTreatmentField,
  anyDrugUsedInLastSix,
} from './fields'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const drugDetailsStep = step({
  path: '/drug-details',
  title: 'Drug details',
  onAccess: [
    accessTransition({
      effects: [StrengthsAndNeedsEffects.deriveDrugCategories()],
    }),
  ],
  blocks: [
    usedInLastSixMonthsSection,
    sectionDivider,
    usedMoreThanSixMonthsSection,
    injectedDrugsField,
    receivingTreatmentField,
    saveButton,
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [
          redirect({
            when: anyDrugUsedInLastSix,
            goto: 'drug-use-history',
          }),
          redirect({ goto: 'drug-use-history-more-than-six-months' }),
        ],
      },
    }),
  ],
})
