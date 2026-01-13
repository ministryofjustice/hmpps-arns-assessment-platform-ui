import { Data, Format, Item, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKRadioInput, GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { GoalSummaryCardDraft } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = HtmlBlock({
  content: Format('<h1 class="govuk-heading-l">Confirm if %1 has achieved this goal</h1>', CaseData.Forename),
})

export const allStepsCompletedField = HtmlBlock({
  content: '<p class="govuk-body">All steps have been completed. Check if this goal can now be marked as achieved.</p>',
})

export const goalCard = GoalSummaryCardDraft({
  goalTitle: Data('activeGoal.title'),
  goalStatus: Data('activeGoal.status'),
  targetDate: Data('activeGoal.targetDate').pipe(Transformer.Date.ToUKLongDate()),
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
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
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
