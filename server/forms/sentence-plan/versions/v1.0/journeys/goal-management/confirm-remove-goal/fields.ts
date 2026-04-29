import {
  Data,
  Format,
  Item,
  validation,
  Self,
  Condition,
  Iterator,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKButton,
  GovUKTextareaInput,
  GovUKHeading,
  GovUKButtonGroup,
  GovUKGridRow,
  GovUKBody,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { GoalSummaryCardAgreed } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = GovUKHeading({ text: 'Confirm you want to remove this goal' })

export const introText = GovUKGridRow({
  columns: [
    {
      width: 'two-thirds',
      blocks: [
        GovUKBody({ text: Format('Remove a goal if it is no longer relevant to %1.', CaseData.Forename) }),
        GovUKBody({
          text: Format(
            "You will still be able to see it in 'Removed goals', but %1 will not be expected to achieve it.",
            CaseData.Forename,
          ),
        }),
      ],
    },
  ],
})

export const goalCard = GoalSummaryCardAgreed({
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

const removalNoteField = GovUKTextareaInput({
  code: 'removal_note',
  label: {
    text: 'Why do you want to remove this goal?',
    classes: 'govuk-label--m',
  },
  rows: '3',
  validWhen: [
    validation({
      condition: Self().match(Condition.IsRequired()),
      message: 'Enter why you want to remove this goal',
    }),
  ],
})

export const removalNoteSection = GovUKGridRow({
  columns: [{ width: 'two-thirds', blocks: [removalNoteField] }],
})

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
  attributes: {
    'data-ai-id': 'confirm-remove-goal-confirm-button',
  },
})

export const cancelLink = GovUKBody({
  text: '<a href="update-goal-steps" class="govuk-link" data-ai-id="confirm-remove-goal-cancel-link">Do not remove goal</a>',
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
