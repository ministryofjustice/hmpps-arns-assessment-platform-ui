import { Data, Format, Item, Iterator, not, Self, validation, when } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKSelectInput, GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { GovUKHeading } from '@form-engine-govuk-components/wrappers/govukHeading'
import { GovUKGridRow } from '@form-engine-govuk-components/wrappers/govukGridRow'
import { GovUKBody } from '@form-engine-govuk-components/wrappers/govukBody'
import { AssessmentInfoDetails, ButtonAsLink } from '../../../../../components'
import { actorLabelOptions, CaseData } from '../../../constants'
import { canAccessSanContent } from '../../../guards'

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
  hidden: not(canAccessSanContent),
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
        GovUKBody({ text: 'Who will do the step?', classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1' }),
        GovUKBody({ text: 'Add one person or agency.', classes: 'govuk-hint govuk-!-margin-bottom-0' }),
      ],
    },
    {
      width: 'two-thirds',
      blocks: [
        GovUKBody({
          text: 'What should they do to achieve the goal?',
          classes: 'govuk-!-font-weight-bold govuk-!-margin-bottom-1',
        }),
        GovUKBody({ text: 'Enter one step at a time.', classes: 'govuk-hint govuk-!-margin-bottom-0' }),
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
                code: Format('step_actor_%1', Item().index()),
                label: {
                  text: 'Who will do the step?',
                  classes: 'govuk-visually-hidden',
                },
                items: actorLabelOptions,
                defaultValue: Item().path('actor'),
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
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
                code: Format('step_description_%1', Item().index()),
                label: {
                  text: 'What should they do to achieve the goal?',
                  classes: 'govuk-visually-hidden',
                },
                classes: 'govuk-!-width-full',
                defaultValue: Item().path('description'),
                validate: [
                  validation({
                    when: Self().not.match(Condition.IsRequired()),
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
                value: Format('remove_%1', Item().index()),
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
