import {
  Data,
  Format,
  Item,
  Self,
  validation,
  Iterator,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKRadioInput,
  GovUKTextareaInput,
  GovUKHeading,
  GovUKBody,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { GoalSummaryCardDraft } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = GovUKHeading({
  text: Format('Confirm if %1 has achieved this goal', CaseData.Forename),
})

export const allStepsCompletedField = GovUKBody({
  text: 'All steps have been completed. Check if this goal can now be marked as achieved.',
})

export const goalCard = GoalSummaryCardDraft({
  goalTitle: Data('activeGoal.title'),
  goalStatus: Data('activeGoal.status'),
  targetDate: Data('activeGoal.targetDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
  areaOfNeed: Data('activeGoal.areaOfNeedLabel'),
  relatedAreasOfNeed: Data('activeGoal.relatedAreasOfNeedLabels'),
  steps: Data('activeGoal.steps').each(
    Iterator.Map({
      actor: Item().path('actorLabel'),
      description: Item().path('description'),
      status: Item().path('status'),
    }),
  ),
})

export const howAchievingGoalHelpedInput = GovUKTextareaInput({
  code: 'how_helped',
  label: Format('Enter how achieving this goal has helped %1 (optional)', CaseData.Forename),
  classes: 'govuk-!-width-two-thirds',
  rows: '3',
})

export const hasAchievedGoal = GovUKRadioInput({
  code: 'has_achieved_goal',
  fieldset: {
    legend: {
      text: Format('Has %1 achieved this goal?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'yes', text: 'Yes, mark it as achieved', block: howAchievingGoalHelpedInput },
    { value: 'no', text: Format("No, go to %1's plan", CaseData.Forename) },
  ],
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Select if they have achieved this goal',
    }),
  ],
})

export const saveAndContinueButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'saveAndContinue',
  preventDoubleClick: true,
})
