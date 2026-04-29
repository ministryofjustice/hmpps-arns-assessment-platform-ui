import { Data, Format, Item, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKSelectInput, GovUKTextareaInput, GovUKDetails } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { GovUKGridRow } from '@form-engine-govuk-components/wrappers/govukGridRow'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { CaseData } from '../../../constants'

const relatedAreasOfNeedText = Data('activeGoal.relatedAreasOfNeedLabels').pipe(
  Transformer.Array.Sort(),
  Transformer.Array.Join('; '),
  Transformer.String.ToLowerCase(),
)

const stepStatusOptions = [
  { text: 'Not started', value: 'NOT_STARTED' },
  { text: 'In progress', value: 'IN_PROGRESS' },
  { text: 'Completed', value: 'COMPLETED' },
  { text: 'Cannot be done yet', value: 'CANNOT_BE_DONE_YET' },
  { text: 'No longer needed', value: 'NO_LONGER_NEEDED' },
]

export const pageHeading = GovUKHeading({
  caption: when(Data('activeGoal.relatedAreasOfNeedLabels.length').match(Condition.Number.GreaterThan(0)))
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
  hidden: Data('activeGoal.status').not.match(Condition.Equals('FUTURE')),
  text: Format(
    'This is a future goal. <a href="../../goal/%1/change-goal" class="govuk-link">Change goal details</a>',
    Data('activeGoal.uuid'),
  ),
})

export const goalInfoActive = GovUKBody({
  hidden: Data('activeGoal.status').match(Condition.Equals('FUTURE')),
  text: Format(
    'Aim to achieve this by %1. <a href="../../goal/%2/change-goal" class="govuk-link">Change goal details</a>',
    Data('activeGoal.targetDate').pipe(Transformer.Date.ToUKLongDate()),
    Data('activeGoal.uuid'),
  ),
})

const reviewStepsHeading = GovUKHeading({
  text: 'Review steps',
  size: 'm',
})

const addOrChangeStepsLink = GovUKBody({
  text: Format('<a href="../../goal/%1/add-steps" class="govuk-link">Add or change steps</a>', Data('activeGoal.uuid')),
})

const noStepsMessage = HtmlBlock({
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

const reviewStepsTable = TemplateWrapper({
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
              template: Format(
                `<tr class="govuk-table__row">
                  <td class="govuk-table__cell">%1</td>
                  <td class="govuk-table__cell">%2</td>
                  <td class="govuk-table__cell">{{slot:statusField}}</td>
                </tr>`,
                Item().path('actorLabel').pipe(Transformer.String.EscapeHtml()),
                Item().path('description').pipe(Transformer.String.EscapeHtml()),
              ),
              slots: {
                statusField: [
                  GovUKSelectInput({
                    code: Format('step_status_%1', Item().index()),
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

export const reviewStepsSection = TemplateWrapper({
  template: when(Data('activeGoal.steps.length').match(Condition.Number.GreaterThan(0)))
    .then(
      `<div>
      {{slot:heading}}
      {{slot:table}}
      {{slot:addOrChangeStepsLink}}
    </div>`,
    )
    .else(
      `<div>
      {{slot:heading}}
      {{slot:noStepsMessage}}
    </div>`,
    ),
  slots: {
    heading: [reviewStepsHeading],
    table: [reviewStepsTable],
    addOrChangeStepsLink: [addOrChangeStepsLink],
    noStepsMessage: [noStepsMessage],
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
    TemplateWrapper({
      template: when(Data('activeGoal.notes').not.match(Condition.IsRequired()))
        .then('<p class="govuk-body">There are no notes on this goal yet.</p>')
        .else('{{slot:notesList}}'),
      slots: {
        notesList: [
          CollectionBlock({
            collection: Data('activeGoal.notes').each(
              Iterator.Map(
                TemplateWrapper({
                  template: Format(
                    `<label class="govuk-heading-s">%1 by %2</label>{{slot:typeLabel}}<p class="goal-note">%3</p>`,
                    Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                    Item().path('createdBy').pipe(Transformer.String.EscapeHtml()),
                    Item().path('note').pipe(Transformer.String.EscapeHtml()),
                  ),
                  slots: {
                    typeLabel: [
                      GovUKBody({
                        hidden: Item().path('type').not.match(Condition.Equals('READDED')),
                        text: Format(
                          'Goal added back into plan on %1.',
                          Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                        ),
                      }),
                      GovUKBody({
                        hidden: Item().path('type').not.match(Condition.Equals('REMOVED')),
                        text: Format(
                          'Goal removed on %1.',
                          Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                        ),
                      }),
                    ],
                  },
                }),
              ),
            ),
          }),
        ],
      },
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
