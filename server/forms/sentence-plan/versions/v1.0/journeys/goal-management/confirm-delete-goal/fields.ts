import { Data, Format, Item, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GoalSummaryCardDraft } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = HtmlBlock({
  content: '<h1 class="govuk-heading-l">Confirm you want to delete this goal</h1>',
})

export const introText = HtmlBlock({
  content: Format(
    `<p class="govuk-body">Delete this goal if you've made a mistake. It will not be saved to %1's plan.</p>
    <p class="govuk-body">Alternatively, you can <a href="change-goal" class="govuk-link">change the goal</a> instead.</p>`,
    CaseData.Forename,
  ),
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

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
})

export const cancelLink = HtmlBlock({
  content: Format(
    '<a href="%1" class="govuk-link">Do not delete goal</a>',
    when(Data('activeGoal.status').match(Condition.Equals('FUTURE')))
      .then('../../plan/overview?type=future')
      .else('../../plan/overview?type=current'),
  ),
})

export const buttonGroup = TemplateWrapper({
  template: `<div class="govuk-button-group">{{slot:buttons}}</div>`,
  slots: {
    buttons: [confirmButton, cancelLink],
  },
})
