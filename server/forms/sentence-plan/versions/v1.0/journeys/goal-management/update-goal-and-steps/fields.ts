import {
  Data,
  Format,
  Item,
  Loop,
  when,
  Transformer,
  Iterator,
  Condition,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock, TemplateWrapper, CollectionBlock } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKButton,
  GovUKSelectInput,
  GovUKTextareaInput,
  GovUKDetails,
  GovUKGridRow,
  GovUKHeading,
  GovUKBody,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { CaseData } from '../../../constants'

const relatedAreasOfNeedText = Data('activeGoal.relatedAreasOfNeedLabels').pipe(
  Transformer.Array.Sort(),
  Transformer.Array.Join('; '),
  Transformer.String.ToLowerCase(),
)

const hasSteps = Data('activeGoal.steps').match(Condition.IsRequired())

const stepStatusOptions = [
  { text: 'Not started', value: 'NOT_STARTED' },
  { text: 'In progress', value: 'IN_PROGRESS' },
  { text: 'Completed', value: 'COMPLETED' },
  { text: 'Cannot be done yet', value: 'CANNOT_BE_DONE_YET' },
  { text: 'No longer needed', value: 'NO_LONGER_NEEDED' },
]

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
  text: 'Update goal and steps',
})

export const goalSubheading = GovUKHeading({
  text: Format('Goal: %1', Data('activeGoal.title').pipe(Transformer.String.EscapeHtml())),
  size: 'm',
})

export const goalInfoFuture = GovUKBody({
  visibleWhen: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
  text: Format(
    'This is a future goal. <a href="../../goal/%1/change-goal" class="govuk-link">Change goal details</a>',
    Data('activeGoal.uuid'),
  ),
})

export const goalInfoActive = GovUKBody({
  visibleWhen: Data('activeGoal.status').not.match(Condition.Equals('FUTURE')),
  text: Format(
    'Aim to achieve this by %1. <a href="../../goal/%2/change-goal" class="govuk-link">Change goal details</a>',
    Data('activeGoal.targetDate').pipe(Transformer.String.FormatDate({ dateStyle: 'long' })),
    Data('activeGoal.uuid'),
  ),
})

export const reviewStepsHeading = GovUKHeading({
  text: 'Review steps',
  size: 'm',
})

export const addOrChangeStepsLink = GovUKBody({
  visibleWhen: hasSteps,
  text: Format('<a href="../../goal/%1/add-steps" class="govuk-link">Add or change steps</a>', Data('activeGoal.uuid')),
})

export const noStepsMessage = HtmlBlock({
  visibleWhen: Data('activeGoal.steps').not.match(Condition.IsRequired()),
  classes: 'goal-summary-card__steps--empty-no-shadow',
  content: [
    GovUKBody({
      text: Format(
        'No steps added. <a href="../../goal/%1/add-steps" class="govuk-link">Add steps</a>',
        Data('activeGoal.uuid'),
      ),
    }),
  ],
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
                statusField: [
                  GovUKSelectInput({
                    code: Format('step_status_%1', Loop.Index0()),
                    label: {
                      text: 'Status',
                      classes: 'govuk-visually-hidden',
                    },
                    classes: 'govuk-select--auto-width',
                    formGroup: {
                      classes: 'govuk-!-margin-bottom-0',
                    },
                    items: stepStatusOptions,
                    defaultValue: Item().path('status'),
                  }),
                ],
              },
            }),
          ),
        ),
      }),
    ],
  },
})

const progressNotesField = GovUKTextareaInput({
  code: 'progress_notes',
  label: {
    text: 'Add notes about progress (optional)',
    classes: 'govuk-label govuk-label--m',
  },
  hint: Format(
    'For example, how %1 feels about their progress, any strengths or protective factors they have developed, or any support they need.',
    CaseData.Forename,
  ),
  rows: '3',
})

export const progressNotesSection = GovUKGridRow({
  columns: [{ width: 'two-thirds', blocks: [progressNotesField] }],
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
})

const saveButton = GovUKButton({
  text: 'Save goal and steps',
  name: 'action',
  value: 'save',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'update-goal-and-steps-save-button',
  },
})

const markAsAchievedButton = GovUKButton({
  text: 'Mark as achieved',
  name: 'action',
  value: 'mark-achieved',
  classes: 'govuk-button--secondary',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'update-goal-and-steps-mark-achieved-button',
  },
})

const removeGoalLink = GovUKBody({
  text: Format(
    '<a href="../../goal/%1/confirm-remove-goal" class="govuk-link" data-ai-id="update-goal-and-steps-remove-goal-link">Remove goal from plan</a>',
    Data('activeGoal.uuid'),
  ),
})

export const actionButtons = TemplateWrapper({
  template: `
    <div class="govuk-button-group">
      {{slot:saveButton}}
      {{slot:markAsAchievedButton}}
    </div>
    {{slot:removeGoalLink}}
  `,
  slots: {
    saveButton: [saveButton],
    markAsAchievedButton: [markAsAchievedButton],
    removeGoalLink: [removeGoalLink],
  },
})
