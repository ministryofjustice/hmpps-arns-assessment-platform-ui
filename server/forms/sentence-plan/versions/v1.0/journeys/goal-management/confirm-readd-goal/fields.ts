import { Data, Format, Item, Self, validation } from '@form-engine/form/builders'
import { GovUKButton, GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { GovUKButtonGroup } from '@form-engine-govuk-components/wrappers/govukButtonGroup'
import { GovUKGridRow } from '@form-engine-govuk-components/wrappers/govukGridRow'
import { GoalSummaryCardAgreed } from '../../../../../components'
import { CaseData } from '../../../constants'
import { canStartNow } from '../sharedFields'

export const pageHeading = GovUKHeading({
  text: Format('Confirm you want to add this goal back into %1 plan', CaseData.ForenamePossessive),
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

const readdNoteField = GovUKTextareaInput({
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

export const readdNoteSection = GovUKGridRow({
  columns: [{ width: 'two-thirds', blocks: [readdNoteField] }],
})

export const canStartNowSection = GovUKGridRow({
  columns: [{ width: 'two-thirds', blocks: [canStartNow] }],
})

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
  preventDoubleClick: true,
})

export const cancelLink = GovUKBody({
  text: '<a href="view-inactive-goal" class="govuk-link">Do not add goal back into plan</a>',
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
