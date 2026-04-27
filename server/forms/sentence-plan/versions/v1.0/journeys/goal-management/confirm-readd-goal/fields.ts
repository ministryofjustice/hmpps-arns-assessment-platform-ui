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
  GovUKTextareaInput,
  GovUKHeading,
  GovUKBody,
  GovUKButtonGroup,
  GovUKGridRow,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { GoalSummaryCardAgreed } from '../../../../../components'
import { CaseData } from '../../../constants'
import { canStartNow } from '../sharedFields'

export const pageHeading = GovUKHeading({
  text: Format('Confirm you want to add this goal back into %1 plan', CaseData.ForenamePossessive),
})

export const goalCard = GoalSummaryCardAgreed({
  goalTitle: Data('activeGoal.title'),
  goalStatus: Data('activeGoal.status'),
  statusDate: Data('activeGoal.statusDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
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
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
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
