import { Data, Format, Item, field, validation, Self } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GoalSummaryCardAgreed, ButtonAsLink } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = HtmlBlock({
  content: '<h1 class="govuk-heading-l">Confirm you want to remove this goal</h1>',
})

export const introText = HtmlBlock({
  content: Format(
    `<div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        <p class="govuk-body">Remove a goal if it is no longer relevant to %1.</p>
        <p class="govuk-body">You will still be able to see it in 'Removed goals', but %1 will not be expected to achieve it.</p>
      </div>
    </div>`,
    CaseData.Forename,
  ),
})

export const goalCard = GoalSummaryCardAgreed({
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

const removalNoteField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'removal_note',
  label: {
    text: 'Why do you want to remove this goal?',
    classes: 'govuk-label--m',
  },
  rows: '3',
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: 'Enter why you want to remove this goal',
    }),
  ],
})

export const removalNoteSection = TemplateWrapper({
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        {{slot:field}}
      </div>
    </div>
  `,
  slots: {
    field: [removalNoteField],
  },
})

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
})

export const cancelLink = ButtonAsLink({
  text: 'Do not remove goal',
  name: 'action',
  value: 'cancel',
})

export const buttonGroup = TemplateWrapper({
  template: `<div class="govuk-button-group">{{slot:buttons}}</div>`,
  slots: {
    buttons: [confirmButton, cancelLink],
  },
})
