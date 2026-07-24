import { block, Condition, Post, redirect, step, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsEffects } from '../../../../../../effects'
import { healthConditions, mentalHealthProblems } from './fields'
import { Step } from '../../constants/step'

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save and continue',
  name: 'action',
  value: 'save',
})

export const healthWellbeingStep = step({
  path: `/${Step.health_wellbeing.path}`,
  title: 'Health Wellbeing',
  reachability: { entryWhen: true },
  blocks: [healthConditions, mentalHealthProblems, saveButton],
  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [
          StrengthsAndNeedsEffects.saveCurrentStepAnswers(),
          StrengthsAndNeedsEffects.setSectionProgress('health_section_status', 'INCOMPLETE'),
        ],
        next: [
          redirect({
            goto: 'physical-mental-health',
          }),
        ],
      },
    }),
  ],
})
