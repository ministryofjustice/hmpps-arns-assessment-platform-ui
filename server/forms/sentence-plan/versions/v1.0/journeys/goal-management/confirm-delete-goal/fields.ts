import { Data, Format, Item, when } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKButtonGroup } from '@form-engine-govuk-components/wrappers/govukButtonGroup'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { GoalSummaryCardDraft } from '../../../../../components'
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

export const cancelLink = GovUKBody({
  text: Format(
    '<a href="%1" class="govuk-link">Do not delete goal</a>',
    when(Data('activeGoal.status').match(Condition.Equals('FUTURE')))
      .then('../../plan/overview?type=future')
      .else('../../plan/overview?type=current'),
  ),
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
