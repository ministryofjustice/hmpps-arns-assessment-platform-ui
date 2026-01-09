import { block, Data, field, Format, Item } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GoalSummaryCardDraft, ButtonAsLink } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: Format('<h1 class="govuk-heading-l">Confirm %1 has achieved this goal</h1>', CaseData.Forename),
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

export const howHelpedField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'how_helped',
  label: {
    text: Format('How has achieving this goal helped %1? (optional)', CaseData.Forename),
    classes: 'govuk-label govuk-label--m',
  },
  classes: 'govuk-!-width-two-thirds',
  rows: '3',
})

export const confirmButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
})

export const cancelLink = ButtonAsLink({
  text: 'Do not mark as achieved',
  name: 'action',
  value: 'cancel',
})

export const buttonGroup = TemplateWrapper({
  template: `<div class="govuk-button-group">{{slot:buttons}}</div>`,
  slots: {
    buttons: [confirmButton, cancelLink],
  },
})
