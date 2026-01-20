import { Data, field, Format, Item, Self, validation } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton, GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { GoalSummaryCardAgreed, ButtonAsLink } from '../../../../../components'
import { CaseData } from '../../../constants'
import { canStartNow } from '../sharedFields'

export const pageHeading = HtmlBlock({
  content: Format(
    '<h1 class="govuk-heading-l">Confirm you want to add this goal back into %1 plan</h1>',
    CaseData.ForenamePossessive,
  ),
})

export const goalCard = GoalSummaryCardAgreed({
  goalTitle: Data('activeGoal.title'),
  goalStatus: Data('activeGoal.status'),
  statusDate: Data('activeGoal.statusDate').pipe(Transformer.Date.ToUKLongDate()),
  areaOfNeed: Data('activeGoal.areaOfNeedLabel'),
  relatedAreasOfNeed: Data('activeGoal.relatedAreasOfNeedLabels'),
  notes: Data('activeGoal.notes').each(
    Iterator.Map({
      type: Item().path('type'),
      note: Item().path('note'),
    }),
  ),
  steps: Data('activeGoal.steps').each(
    Iterator.Map({
      actor: Item().path('actorLabel'),
      description: Item().path('description'),
      status: Item().path('status'),
    }),
  ),
})

const readdNoteField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'readd_note',
  label: {
    text: Format('Why do you want to add this goal back into %1 plan?', CaseData.ForenamePossessive),
    classes: 'govuk-label--m',
  },
  rows: '3',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter why you want to add this goal back into their plan',
    }),
  ],
})

export const readdNoteSection = TemplateWrapper({
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        {{slot:field}}
      </div>
    </div>
  `,
  slots: {
    field: [readdNoteField],
  },
})

export const canStartNowSection = TemplateWrapper({
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        {{slot:field}}
      </div>
    </div>
  `,
  slots: {
    field: [canStartNow],
  },
})

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
  preventDoubleClick: true,
})

export const cancelLink = ButtonAsLink({
  text: 'Do not add goal back into plan',
  name: 'action',
  value: 'cancel',
})

export const buttonGroup = TemplateWrapper({
  template: `<div class="govuk-button-group">{{slot:buttons}}</div>`,
  slots: {
    buttons: [confirmButton, cancelLink],
  },
})
