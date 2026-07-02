import { step, submit, access, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
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
    access({
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
    submit({
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
