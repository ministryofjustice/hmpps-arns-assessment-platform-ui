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
  const stepDescription = Item().path('description').pipe(Transformer.String.EscapeHtml())
  const columnCount = 4
  const dataColumnCount = columnCount - 1

  const moveUpButton = GovUKButton({
    html: Format('Move up<span class="govuk-visually-hidden"> (%1)</span>', stepDescription),
    name: 'action',
    value: Format('moveUp_%1', Loop.Index0()),
    classes: 'govuk-button--secondary govuk-!-margin-bottom-0',
    visibleWhen: when(isFirstStep).then(false).else(true),
    attributes: {
      'data-ai-id': Format(`${page}-move-up-%1`, Loop.Index0()),
    },
  })

  const moveDownButton = GovUKButton({
    html: Format('Move down<span class="govuk-visually-hidden"> (%1)</span>', stepDescription),
    name: 'action',
    value: Format('moveDown_%1', Loop.Index0()),
    classes: 'govuk-button--secondary govuk-!-margin-bottom-0',
    visibleWhen: when(isLastStep).then(false).else(true),
    attributes: {
      'data-ai-id': Format(`${page}-move-down-%1`, Loop.Index0()),
    },
  })

  const spacerRow = TemplateWrapper({
    template: `<tr aria-hidden="true" class="reorder-steps-table__spacer"><td colspan="${columnCount}"></td></tr>`,
    visibleWhen: when(isLastStep).then(false).else(true),
  })

  return TemplateWrapper({
    template: `<table class="govuk-table reorder-steps-table" aria-label="Reorder steps">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header reorder-steps-table__counter-header"><span class="govuk-visually-hidden">Step number</span></th>
          <th scope="col" class="govuk-table__header reorder-steps-table__actor-header">Who will do this</th>
          <th scope="col" class="govuk-table__header reorder-steps-table__steps-header">Steps</th>
          <th scope="col" class="govuk-table__header">Status</th>
        </tr>
      </thead>
      {{slot:steps}}
    </table>`,
    slots: {
      steps: [
        CollectionBlock({
          collection: Data('activeGoal.steps').each(
            Iterator.Map(
              TemplateWrapper({
                template: `<tbody>
                  <tr class="govuk-table__row reorder-steps-table__data-row">
                    <td class="govuk-table__cell reorder-steps-table__counter" rowspan="2">{{stepNumber}}.</td>
                    <td class="govuk-table__cell">{{actorLabel}}</td>
                    <td class="govuk-table__cell">{{description}}</td>
                    <td class="govuk-table__cell">{{slot:status}}</td>
                  </tr>
                  <tr class="govuk-table__row reorder-steps-table__actions-row">
                    <td class="govuk-table__cell" colspan="${dataColumnCount}">
                      <div class="govuk-button-group govuk-!-margin-bottom-0">
                        {{slot:moveButtons}}
                      </div>
                    </td>
                  </tr>
                  {{slot:spacer}}
                </tbody>`,
                values: {
                  stepNumber: Loop.Index0().pipe(Transformer.Number.Add(1)),
                  actorLabel: Item().path('actorLabel').pipe(Transformer.String.EscapeHtml()),
                  description: Item().path('description').pipe(Transformer.String.EscapeHtml()),
                },
                slots: {
                  status: statusTag,
                  moveButtons: [moveUpButton, moveDownButton],
                  spacer: [spacerRow],
                },
              }),
            ),
          ),
        }),
      ],
    },
  })
}
