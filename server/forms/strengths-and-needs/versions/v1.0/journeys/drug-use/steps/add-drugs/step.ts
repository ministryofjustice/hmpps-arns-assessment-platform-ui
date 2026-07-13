import { step, submit, redirect, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { selectMisusedDrugs } from './fields'
import { Step } from '../../constants/step'

const saveButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const addDrugsStep = step({
  path: `/${Step.add_drugs.path}`,
  title: 'Add drugs',
  blocks: [selectMisusedDrugs, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [StrengthsAndNeedsEffects.saveCurrentStepAnswers()],
        next: [redirect({ goto: Step.drug_details.path })],
      },
    }),
  ],
})
