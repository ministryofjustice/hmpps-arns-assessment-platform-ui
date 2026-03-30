import { Data, Format, Item, Iterator } from '@form-engine/form/builders'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextareaInput } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { GovUKButtonGroup } from '@form-engine-govuk-components/wrappers/govukButtonGroup'
import { GoalSummaryCardDraft } from '../../../../../components'
import { CaseData } from '../../../constants'

export const pageHeading = GovUKHeading({
  text: Format('Confirm %1 has achieved this goal', CaseData.Forename),
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

export const howHelpedField = GovUKTextareaInput({
  code: 'how_helped',
  label: {
    text: Format('How has achieving this goal helped %1? (optional)', CaseData.Forename),
    classes: 'govuk-label govuk-label--m',
  },
  classes: 'govuk-!-width-two-thirds',
  rows: '3',
})

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
})

export const cancelLink = GovUKBody({
  text: Format(
    '<a href="../../goal/%1/update-goal-steps" class="govuk-link">Do not mark as achieved</a>',
    Data('activeGoal.uuid'),
  ),
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
