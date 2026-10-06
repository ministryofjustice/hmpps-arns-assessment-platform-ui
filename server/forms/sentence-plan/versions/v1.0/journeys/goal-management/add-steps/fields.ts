import {
  Condition,
  Data,
  Format,
  Item,
  Iterator,
  Loop,
  not,
  or,
  Self,
  Transformer,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKBody,
  GovUKButton,
  GovUKButtonGroup,
  GovUKGridRow,
  GovUKHeading,
  GovUKSelectInput,
  GovUKTextareaInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { AssessmentInfoDetails, ButtonAsLink, WrappingSelect } from '../../../../../components'
import { actorLabelOptions, CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'
import { goalContextInsetText } from '../sharedFields'

const stepActorLabelText = 'Who will do the step?'
const stepDescriptionLabelText = 'What should they do to achieve the goal?'
const stepStatusLabelText = 'What is the status?'

const stepStatusOptions = [
  { value: '', text: 'Choose status' },
  { value: 'NOT_STARTED', text: 'Not started' },
  { value: 'IN_PROGRESS', text: 'In progress' },
  { value: 'COMPLETED', text: 'Completed' },
  { value: 'CANNOT_BE_DONE_YET', text: 'Cannot be done yet' },
  { value: 'NO_LONGER_NEEDED', text: 'No longer needed' },
]

export const pageHeading = GovUKHeading({
  text: when(
    or(
      Data('navigationReferrer').match(Condition.Equals('add-goal')),
      Data('activeGoal.steps').not.match(Condition.IsRequired()),
    ),
  )
    .then('Add steps')
    .else('Add or update steps'),
})

/**
 * Assessment info details - shows practitioner analysis from SAN assessment
 */
export const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed.text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
  visibleWhen: canAccessSanContent,
})

/**
 * Column headers for the step rows
 */
export const columnHeaders = GovUKGridRow({
  classes: 'govuk-!-margin-bottom-2 step-row-headers',
  columns: [
    {
      width: 'one-sixth',
      blocks: [GovUKBody({ text: stepActorLabelText, classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1' })],
    },
    {
      width: 'one-half',
      blocks: [
        GovUKBody({
          text: stepDescriptionLabelText,
          classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1',
        }),
      ],
    },
    {
      width: 'one-sixth',
      blocks: [
        GovUKBody({
          text: stepStatusLabelText,
          classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1',
        }),
      ],
    },
  ],
})

const isSingleStep = Data('activeGoalStepsEdited').pipe(Transformer.Array.Length()).match(Condition.Equals(1))

/**
 * Dynamic step rows - renders a row for each step in the collection
 *
 * Shows "Clear" when only 1 step (clears values but keeps row),
 * "Remove" when multiple steps (removes the row entirely).
 */
export const stepRows = HtmlBlock({
  tag: 'div',
  classes: 'step-rows',
  content: Data('activeGoalStepsEdited').each(
    Iterator.Map(
      GovUKGridRow({
        classes: 'step-row',
        attributes: { 'data-qa': 'step-row' },
        columns: [
          {
            width: 'one-sixth',
            blocks: [
              WrappingSelect({
                field: GovUKSelectInput({
                  code: Format('step_actor_%1', Loop.Index0()),
                  label: {
                    text: stepActorLabelText,
                    classes: 'govuk-visually-hidden',
                  },
                  items: actorLabelOptions,
                  defaultValue: Item().path('actor'),
                  validWhen: [
                    validation({
                      condition: Self().match(Condition.IsRequired()),
                      message: 'Select who will do the step',
                    }),
                  ],
                }),
              }),
            ],
          },
          {
            width: 'one-half',
            blocks: [
              GovUKTextareaInput({
                code: Format('step_description_%1', Loop.Index0()),
                label: {
                  text: stepDescriptionLabelText,
                  classes: 'govuk-visually-hidden',
                },
                autocomplete: 'off',
                rows: '1',
                classes: 'govuk-!-width-full app-autosize-textarea',
                attributes: {
                  'data-autosize': 'true',
                },
                defaultValue: Item().path('description'),
                validWhen: [
                  validation({
                    condition: Self().match(Condition.IsRequired()),
                    message: 'Enter what they should do to achieve the goal',
                  }),
                ],
              }),
            ],
          },
          {
            width: 'one-sixth',
            blocks: [
              WrappingSelect({
                field: GovUKSelectInput({
                  code: Format('step_status_%1', Loop.Index0()),
                  label: {
                    text: stepStatusLabelText,
                    classes: 'govuk-visually-hidden',
                  },
                  items: stepStatusOptions,
                  defaultValue: Item().path('status'),
                  validWhen: [
                    validation({
                      condition: Self().match(Condition.IsRequired()),
                      message: 'Select the status',
                    }),
                  ],
                }),
              }),
            ],
          },
          {
            width: 'one-sixth',
            blocks: [
              ButtonAsLink({
                text: when(isSingleStep).then('Clear').else('Remove'),
                name: 'action',
                value: Format('remove_%1', Loop.Index0()),
                classes: 'govuk-!-margin-bottom-0',
                attributes: {
                  'data-ai-id': when(isSingleStep)
                    .then('add-update-steps-clear-step-link')
                    .else(Format('add-update-steps-remove-step-link-%1', Loop.Index0())),
                },
              }),
            ],
          },
        ],
      }),
    ),
  ),
})

/**
 * Cheeky little hack to handle Enter key triggering the removal of a step
 * Stolen straight from SP!
 */
export const hiddenDefaultSubmit = HtmlBlock({
  content: `<button aria-hidden="true" tabindex="-1" value="addStep" type="submit" name="action" class="govuk-visually-hidden">Add another step</button>`,
})

/**
 * "Add another step" button
 */
export const addStepButton = GovUKButton({
  text: 'Add another step',
  name: 'action',
  value: 'addStep',
  classes: 'govuk-button--secondary',
  attributes: {
    'data-ai-id': 'add-steps-add-another-step-button',
  },
})

// Reorder steps button
export const reorderStepButton = GovUKButton({
  text: 'Reorder steps',
  name: 'action',
  value: 'reorderSteps',
  classes: 'govuk-button--secondary',
  attributes: {
    'data-ai-id': 'add-steps-reorder-steps-button',
  },
  visibleWhen: not(isSingleStep),
})

const stepActionButtonsGroup = GovUKButtonGroup({ buttons: [addStepButton, reorderStepButton] })

/**
 * "Save and continue" button
 */
export const saveAndContinueButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'saveAndContinue',
  preventDoubleClick: true,
  attributes: {
    'data-ai-id': 'add-steps-save-and-continue-button',
  },
})

/**
 * Main page layout
 */
export const pageLayout = TemplateWrapper({
  template: `
      {{slot:hiddenDefaultSubmit}}
      <div>
        {{slot:pageHeading}}
        {{slot:assessmentInfoDetails}}
        {{slot:goalContextInsetText}}
        {{slot:columnHeaders}}
        {{slot:stepRows}}
        {{slot:stepActionsButtonGroup}}
      </div>
      {{slot:saveAndContinueButton}}
  `,
  slots: {
    hiddenDefaultSubmit: [hiddenDefaultSubmit],
    pageHeading: [pageHeading],
    assessmentInfoDetails: [assessmentInfoDetails],
    goalContextInsetText: [goalContextInsetText],
    columnHeaders: [columnHeaders],
    stepRows: [stepRows],
    saveAndContinueButton: [saveAndContinueButton],
    stepActionsButtonGroup: [stepActionButtonsGroup],
  },
})
