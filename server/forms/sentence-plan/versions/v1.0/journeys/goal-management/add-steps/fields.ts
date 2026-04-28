import {
  Data,
  Format,
  Item,
  Loop,
  Iterator,
  Self,
  validation,
  when,
  Condition,
  Transformer,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock, TemplateWrapper } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKButton,
  GovUKSelectInput,
  GovUKTextInput,
  GovUKHeading,
  GovUKGridRow,
  GovUKBody,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { AssessmentInfoDetails, ButtonAsLink } from '../../../../../components'
import { actorLabelOptions, CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'

const stepActorLabelText = 'Who will do the step?'
const stepActorHintText = 'Add one person or agency.'
const stepDescriptionLabelText = 'What should they do to achieve the goal?'
const stepDescriptionHintText = 'Enter one step at a time.'
const stepActorHintId = 'step-actor-hint'
const stepDescriptionHintId = 'step-description-hint'

export const pageHeading = GovUKHeading({
  caption: Data('activeGoal.title').pipe(Transformer.String.EscapeHtml()),
  text: 'Add or change steps',
})

/**
 * Assessment info details - shows practitioner analysis from SAN assessment
 */
export const assessmentInfoDetails = AssessmentInfoDetails({
  personName: CaseData.Forename,
  areaName: Data('currentAreaOfNeed').path('text'),
  assessmentData: Data('currentAreaAssessment'),
  status: Data('currentAreaAssessmentStatus'),
  visibleWhen: canAccessSanContent,
})

/**
 * Column headers for the step rows
 */
export const columnHeaders = GovUKGridRow({
  classes: 'govuk-!-margin-bottom-2',
  columns: [
    {
      width: 'one-quarter',
      blocks: [
        GovUKBody({ text: stepActorLabelText, classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1' }),
        GovUKBody({
          text: stepActorHintText,
          classes: 'govuk-hint govuk-!-margin-bottom-0',
          attributes: { id: stepActorHintId },
        }),
      ],
    },
    {
      width: 'two-thirds',
      blocks: [
        GovUKBody({
          text: stepDescriptionLabelText,
          classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1',
        }),
        GovUKBody({
          text: stepDescriptionHintText,
          classes: 'govuk-hint govuk-!-margin-bottom-0',
          attributes: { id: stepDescriptionHintId },
        }),
      ],
    },
  ],
})

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
            width: 'one-quarter',
            blocks: [
              GovUKSelectInput({
                code: Format('step_actor_%1', Loop.Index0()),
                label: {
                  text: stepActorLabelText,
                  classes: 'govuk-visually-hidden',
                },
                describedBy: stepActorHintId,
                items: actorLabelOptions,
                defaultValue: Item().path('actor'),
                validWhen: [
                  validation({
                    condition: Self().match(Condition.IsRequired()),
                    message: 'Select who will do the step',
                  }),
                ],
              }),
            ],
          },
          {
            width: 'two-thirds',
            blocks: [
              GovUKTextInput({
                code: Format('step_description_%1', Loop.Index0()),
                label: {
                  text: stepDescriptionLabelText,
                  classes: 'govuk-visually-hidden',
                },
                describedBy: stepDescriptionHintId,
                classes: 'govuk-!-width-full',
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
              ButtonAsLink({
                text: when(Data('activeGoalStepsEdited').pipe(Transformer.Array.Length()).match(Condition.Equals(1)))
                  .then('Clear')
                  .else('Remove'),
                name: 'action',
                value: Format('remove_%1', Loop.Index0()),
                classes: 'govuk-!-margin-bottom-0',
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
})

/**
 * "Save and continue" button
 */
export const saveAndContinueButton = GovUKButton({
  text: 'Save and continue',
  name: 'action',
  value: 'saveAndContinue',
  preventDoubleClick: true,
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
        {{slot:columnHeaders}}
        {{slot:stepRows}}
        {{slot:buttonGroup}}
        {{slot:addStepButton}}
      </div>
      {{slot:saveAndContinueButton}}
  `,
  slots: {
    hiddenDefaultSubmit: [hiddenDefaultSubmit],
    pageHeading: [pageHeading],
    assessmentInfoDetails: [assessmentInfoDetails],
    columnHeaders: [columnHeaders],
    stepRows: [stepRows],
    saveAndContinueButton: [saveAndContinueButton],
    addStepButton: [addStepButton],
  },
})
