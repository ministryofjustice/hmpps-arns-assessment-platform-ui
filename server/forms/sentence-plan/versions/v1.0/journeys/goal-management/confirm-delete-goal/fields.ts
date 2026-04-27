import { Data, Format, Item, when, Iterator, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKButton, GovUKHeading, GovUKButtonGroup, GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { GoalSummaryCardDraft } from '../../../../../components'
import { SentencePlanTransformers } from '../../../../../transformers'
import { CaseData } from '../../../constants'

export const pageHeading = GovUKHeading({ text: 'Confirm you want to delete this goal' })

export const introText = [
  GovUKBody({
    text: Format("Delete this goal if you've made a mistake. It will not be saved to %1's plan.", CaseData.Forename),
  }),
  GovUKBody({
    text: 'Alternatively, you can <a href="change-goal" class="govuk-link">change the goal</a> instead.',
  }),
]

export const goalCard = GoalSummaryCardDraft({
  goalTitle: Data('activeGoal.title'),
  goalStatus: Data('activeGoal.status'),
  targetDate: Data('activeGoal.targetDate').pipe(SentencePlanTransformers.String.FormatDate({ dateStyle: 'long' })),
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

export const cancelLink = GovUKBody({
  text: Format(
    '<a href="%1" class="govuk-link">Do not delete goal</a>',
    when(Data('activeGoal.status').match(Condition.Equals('FUTURE')))
      .then('../../plan/overview?type=future')
      .else('../../plan/overview?type=current'),
  ),
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
