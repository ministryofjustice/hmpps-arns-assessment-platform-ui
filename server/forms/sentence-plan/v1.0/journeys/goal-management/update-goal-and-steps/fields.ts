import { block, Data, Format, Item, field, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { GovUKSelectInput, GovUKTextareaInput, GovUKDetails } from '@form-engine-govuk-components/components'
import { Transformer } from '@form-engine/registry/transformers'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { Iterator } from '@form-engine/form/builders/IteratorBuilder'
import { Condition } from '@form-engine/registry/conditions'
import { CaseData } from '../../../constants'

const stepStatusOptions = [
  { text: 'Not started', value: 'NOT_STARTED' },
  { text: 'In progress', value: 'IN_PROGRESS' },
  { text: 'Completed', value: 'COMPLETED' },
  { text: 'Cannot be done yet', value: 'CANNOT_BE_DONE_YET' },
  { text: 'No longer needed', value: 'NO_LONGER_NEEDED' },
]

export const pageHeading = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<span class="govuk-caption-l">%1</span>
    <h1 class="govuk-heading-l">Update goal and steps</h1>
    <h2 class="govuk-heading-m">Goal: %2</h2>`,
    Data('activeGoal.areaOfNeedLabel'),
    Data('activeGoal.title'),
  ),
})

export const goalInfo = block<HtmlBlock>({
  variant: 'html',
  content: Format(
    `<p class="govuk-body">Aim to achieve this by %1. <a href="../../goal/%2/change-goal" class="govuk-link">Change goal details</a></p>`,
    Data('activeGoal.targetDate').pipe(Transformer.Date.ToUKLongDate()),
    Data('activeGoal.uuid'),
  ),
})

const reviewStepsHeading = HtmlBlock({
  content: '<h2 class="govuk-heading-m">Review steps</h2>',
})

const addOrChangeStepsLink = HtmlBlock({
  content: Format(
    `<p class="govuk-body"><a href="../../goal/%1/add-steps" class="govuk-link">Add or change steps</a></p>`,
    Data('activeGoal.uuid'),
  ),
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
                Item().path('actorLabel'),
                Item().path('description'),
              ),
              slots: {
                statusField: [
                  field<GovUKSelectInput>({
                    variant: 'govukSelectInput',
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
  template: `
    <div>
      {{slot:heading}}
      {{slot:table}}
      {{slot:addOrChangeStepsLink}}
    </div>
  `,
  slots: {
    heading: [reviewStepsHeading],
    table: [reviewStepsTable],
    addOrChangeStepsLink: [addOrChangeStepsLink],
  },
})

const progressNotesField = field<GovUKTextareaInput>({
  variant: 'govukTextarea',
  code: 'progress_notes',
  label: {
    text: 'Add notes about progress (optional)',
    classes: 'govuk-label govuk-label--m',
  },
  hint: Format(
    'For example, how %1 feels about their progress, any strengths or protective factors they have developed, or any support they need.',
    CaseData.Forename,
  ),
  rows: '5',
})

export const progressNotesSection = TemplateWrapper({
  template: `
    <div class="govuk-grid-row">
      <div class="govuk-grid-column-two-thirds">
        {{slot:progressNotesField}}
      </div>
    </div>
  `,
  slots: {
    progressNotesField: [progressNotesField],
  },
})

export const viewAllNotesSection = block<GovUKDetails>({
  variant: 'govukDetails',
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
                    `<label class="govuk-heading-s">%1 by %2</label>
                    <p class="goal-note">%3</p>`,
                    Item().path('createdAt').pipe(Transformer.Date.ToUKLongDate()),
                    Item().path('createdBy'),
                    Item().path('note'),
                  ),
                  slots: {},
                }),
              ),
            ),
          }),
        ],
      },
    }),
  ],
})

const saveButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Save goal and steps',
  name: 'action',
  value: 'save',
  preventDoubleClick: true,
})

const markAsAchievedButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Mark as achieved',
  name: 'action',
  value: 'mark-achieved',
  classes: 'govuk-button--secondary',
  preventDoubleClick: true,
})

const removeGoalLink = HtmlBlock({
  content: Format(
    `<p class="govuk-body"><a href="../../goal/%1/confirm-delete-goal" class="govuk-link">Remove goal from plan</a></p>`,
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
