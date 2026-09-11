import {
  Data,
  Format,
  Item,
  when,
  Iterator,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKHeading, GovUKButtonGroup, GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { GoalSummaryCardDraft } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = GovUKHeading({ text: 'Confirm you want to delete this goal' })

export const introText = [
  GovUKBody({
    text: Format("Delete this goal if it’s not needed. It will not be saved to %1's plan.", CaseData.Forename),
  }),
  GovUKBody({
    text: 'Alternatively, you can <a href="change-goal" class="govuk-link">update the goal</a> instead.',
  }),
]

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

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
  attributes: {
    'data-ai-id': 'confirm-delete-goal-confirm-button',
  },
})

export const cancelLink = GovUKBody({
  text: Format(
    '<a href="%1" class="govuk-link" data-ai-id="confirm-delete-goal-cancel-link">Do not delete goal</a>',
    when(Data('activeGoal.status').match(Condition.Equals('FUTURE')))
      .then('../../plan/overview?goalStatusTab=future')
      .else('../../plan/overview?goalStatusTab=current'),
  ),
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
