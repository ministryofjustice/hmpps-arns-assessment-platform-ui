import {
  Condition,
  Data,
  Format,
  Item,
  Iterator,
  Loop,
  Transformer,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { CollectionBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import { GovUKButton } from '@ministryofjustice/hmpps-forge/govuk-components'
import { statusTag } from '../../versions/v1.0/journeys/goal-management/sharedFields'

interface StepSummaryCardProps {
  page: string
}

// Step summary card list with move up/down buttons
export const StepSummaryCardList = ({ page }: StepSummaryCardProps) => {
  const stepCount = Data('activeGoal.steps').pipe(Transformer.Array.Length())
  const isFirstStep = Loop.Index0().match(Condition.Equals(0))
  const isLastStep = Loop.Index0().match(Condition.Equals(stepCount.pipe(Transformer.Number.Subtract(1))))

  const moveUpButton = GovUKButton({
    text: 'Move up',
    name: 'action',
    value: Format('moveUp_%1', Loop.Index0()),
    classes: 'govuk-button--secondary govuk-!-margin-bottom-0',
    visibleWhen: when(isFirstStep).then(false).else(true),
    attributes: {
      'data-ai-id': Format(`${page}-move-up-%1`, Loop.Index0()),
    },
  })

  const moveDownButton = GovUKButton({
    text: 'Move down',
    name: 'action',
    value: Format('moveDown_%1', Loop.Index0()),
    classes: 'govuk-button--secondary govuk-!-margin-bottom-0',
    visibleWhen: when(isLastStep).then(false).else(true),
    attributes: {
      'data-ai-id': Format(`${page}-move-down-%1`, Loop.Index0()),
    },
  })

  return TemplateWrapper({
    template: `<div class="reorder-steps-headers">
        <span class="govuk-body govuk-!-font-weight-bold">Who will do this</span>
        <span class="govuk-body govuk-!-font-weight-bold govuk-!-margin-left-1">Steps</span>
        <span class="govuk-body govuk-!-font-weight-bold">Status</span>
      </div>
      <ol class="goal-list govuk-list govuk-list--number">{{slot:items}}</ol>`,
    slots: {
      items: [
        CollectionBlock({
          collection: Data('activeGoal.steps').each(
            Iterator.Map(
              TemplateWrapper({
                template: `<li>
                  <div class="govuk-summary-card goal-summary-card">
                    <div class="reorder-steps-card__header">
                      <span class="govuk-body govuk-!-margin-bottom-0">{{actorLabel}}</span>
                      <span class="govuk-body govuk-!-margin-bottom-0">{{description}}</span>
                      <span class="govuk-!-margin-left-1">{{slot:status}}</span>
                    </div>
                    <div class="govuk-summary-card__content govuk-!-padding-2">
                      <div class="govuk-button-group govuk-!-margin-bottom-0">
                        {{slot:moveButtons}}
                      </div>
                    </div>
                  </div>
                </li>`,
                values: {
                  actorLabel: Item().path('actorLabel').pipe(Transformer.String.EscapeHtml()),
                  description: Item().path('description').pipe(Transformer.String.EscapeHtml()),
                },
                slots: {
                  status: statusTag,
                  moveButtons: [moveUpButton, moveDownButton],
                },
              }),
            ),
          ),
        }),
      ],
    },
  })
}
