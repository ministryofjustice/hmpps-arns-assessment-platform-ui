import {
  Data,
  Format,
  Item,
  when,
  Transformer,
  Iterator,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKDetails, GovUKLinkButton, GovUKHeading, GovUKBody } from '@ministryofjustice/hmpps-forge/govuk-components'
import { TemplateWrapper, CollectionBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { statusTag } from '../sharedFields'

/**
 * Shared fields for viewing inactive goals (achieved or removed)
 */

const relatedAreasOfNeedText = Data('activeGoal.relatedAreasOfNeedLabels').pipe(
  Transformer.Array.Join(', '),
  Transformer.String.ToLowerCase(),
)

const hasSteps = Data('activeGoal.steps').match(Condition.IsRequired())

export const pageHeading = GovUKHeading({
  caption: when(Data('activeGoal.relatedAreasOfNeedLabels').match(Condition.IsRequired()))
    .then(
      Format(
        '%1 (and %2)',
        Data('activeGoal.areaOfNeedLabel').pipe(Transformer.String.EscapeHtml()),
        relatedAreasOfNeedText.pipe(Transformer.String.EscapeHtml()),
      ),
    )
    .else(Data('activeGoal.areaOfNeedLabel').pipe(Transformer.String.EscapeHtml())),
  text: 'View goal details',
  classes: 'govuk-!-margin-bottom-2',
})

export const goalSubheading = GovUKHeading({
  text: Format('Goal: %1', Data('activeGoal.title').pipe(Transformer.String.EscapeHtml())),
  size: 'm',
  classes: 'govuk-!-margin-bottom-2',
})

export const goalAchievedInfo = GovUKBody({
  visibleWhen: Data('activeGoal.status').match(Condition.Equals('ACHIEVED')),
  text: Format(
    'Marked as achieved on %1.',
    Data('activeGoal.statusDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
  ),
})

export const goalRemovedInfo = GovUKBody({
  visibleWhen: Data('activeGoal.status').match(Condition.Equals('REMOVED')),
  text: Format(
    'Removed on %1.',
    Data('activeGoal.statusDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
  ),
})

export const reviewStepsTable = TemplateWrapper({
  visibleWhen: hasSteps,
  template: `
    <table class="govuk-table goal-summary-card__steps">
      <thead class="govuk-table__head">
        <tr class="govuk-table__row">
          <th scope="col" class="govuk-table__header">Who will do this</th>
          <th scope="col" class="govuk-table__header">Steps</th>
          <th scope="col" class="govuk-table__header">Status</th>
        </tr>
      </thead>
      <tbody class="govuk-table__body">
        {{slot:steps}}
      </tbody>
    </table>
  `,
  slots: {
    steps: [
      CollectionBlock({
        collection: Data('activeGoal.steps').each(
          Iterator.Map(
            TemplateWrapper({
              template: `<tr class="govuk-table__row">
                  <td class="govuk-table__cell">{{actorLabel}}</td>
                  <td class="govuk-table__cell">{{description}}</td>
                  <td class="govuk-table__cell">{{slot:statusField}}</td>
                </tr>`,
              values: {
                actorLabel: Item().path('actorLabel').pipe(Transformer.String.EscapeHtml()),
                description: Item().path('description').pipe(Transformer.String.EscapeHtml()),
              },
              slots: {
                statusField: statusTag,
              },
            }),
          ),
        ),
      }),
    ],
  },
})

export const noStepsMessage = GovUKBody({
  visibleWhen: Data('activeGoal.steps').not.match(Condition.IsRequired()),
  text: 'No steps were added to this goal.',
})

export const viewAllNotesSection = GovUKDetails({
  summaryText: 'View all notes',
  content: [
    CollectionBlock({
      collection: Data('activeGoal.notes').each(
        Iterator.Map(
          TemplateWrapper({
            template: `<label class="govuk-heading-s">{{createdAt}} by {{createdBy}}</label>
                       {{slot:typeLabel}}
                       <p class="goal-note">{{note}}</p>`,
            values: {
              createdAt: Item()
                .path('createdAt')
                .pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
              createdBy: Item().path('createdBy'),
              note: Item().path('note'),
            },
            slots: {
              typeLabel: [
                GovUKBody({
                  visibleWhen: Item().path('type').match(Condition.Equals('READDED')),
                  text: Format(
                    'Goal added back into plan on %1.',
                    Item()
                      .path('createdAt')
                      .pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
                  ),
                }),
                GovUKBody({
                  visibleWhen: Item().path('type').match(Condition.Equals('REMOVED')),
                  text: Format(
                    'Goal removed on %1.',
                    Item()
                      .path('createdAt')
                      .pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
                  ),
                }),
              ],
            },
          }),
        ),
      ),
      fallback: [GovUKBody({ text: 'There are no notes on this goal yet.' })],
    }),
  ],
  attributes: { 'data-ai-id': 'view-inactive-goal-view-all-notes-details' },
})

export const addToPlanButton = GovUKLinkButton({
  text: 'Add to plan',
  href: 'confirm-readd-goal',
  classes: 'govuk-button--secondary',
  visibleWhen: Data('activeGoal.status').match(Condition.Equals('REMOVED')),
  attributes: {
    'data-ai-id': 'view-inactive-goal-add-to-plan-button',
  },
})
