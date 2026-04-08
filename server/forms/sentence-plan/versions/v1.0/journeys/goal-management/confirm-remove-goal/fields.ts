import { Data, Format, Item, validation, Self } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKTextareaInput } from '@form-engine-govuk-components/components/textarea-input/govukTextareaInput'
import { Transformer } from '@form-engine/registry/transformers'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKButtonGroup } from '@form-engine-govuk-components/wrappers/govukButtonGroup'
import { GovUKGridRow } from '@form-engine-govuk-components/wrappers/govukGridRow'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
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

const removalNoteField = GovUKTextareaInput({
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

export const removalNoteSection = GovUKGridRow({
  columns: [{ width: 'two-thirds', blocks: [removalNoteField] }],
})

export const confirmButton = GovUKButton({
  text: 'Confirm',
  name: 'action',
  value: 'confirm',
})

export const cancelLink = GovUKBody({
  text: '<a href="update-goal-steps" class="govuk-link">Do not remove goal</a>',
})

export const buttonGroup = GovUKButtonGroup({ buttons: [confirmButton, cancelLink] })
