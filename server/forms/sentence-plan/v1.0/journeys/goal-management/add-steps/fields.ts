import {Data, Format, Item, Iterator, Literal, Self, validation, when} from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { GovUKButton } from '@form-engine-govuk-components/components/button/govukButton'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { GovUKSelectInput, GovUKTextInput } from '@form-engine-govuk-components/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { ButtonAsLink } from '../../../../components'
import { actorLabelOptions } from '../../../constants'

/**
 * Goal title caption showing the goal being worked on
 */
export const pageHeading = HtmlBlock({
  content: Format(
    `<p class="govuk-caption-l">%1</p>
             <h1 class="govuk-heading-l">Add or change steps</h1>`,
    Data('activeGoal.title'),
  ),
})

/**
 * Column headers for the step rows
 */
export const columnHeaders = HtmlBlock({
  content: `
    <div class="govuk-grid-row govuk-!-margin-bottom-2">
      <div class="govuk-grid-column-one-quarter">
        <p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1">Who will do the step?</p>
        <p class="govuk-hint govuk-!-margin-bottom-0">Add one person or agency.</p>
      </div>
      <div class="govuk-grid-column-two-thirds">
        <p class="govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1">What should they do to achieve the goal?</p>
        <p class="govuk-hint govuk-!-margin-bottom-0">Enter one step at a time.</p>
      </div>
    </div>
  `,
})

/**
 * Dynamic step rows - renders a row for each step in the collection
 *
 * Shows "Clear" when only 1 step (clears values but keeps row),
 * "Remove" when multiple steps (removes the row entirely).
 */
export const stepRows = CollectionBlock({
  classes: 'step-rows',
  collection: Data('activeGoalStepsEdited').each(
    Iterator.Map(
      TemplateWrapper({
        template: `
          <div class="govuk-grid-row step-row">
            <div class="govuk-grid-column-one-quarter">
              {{slot:actorField}}
            </div>
            <div class="govuk-grid-column-two-thirds">
              {{slot:descriptionField}}
            </div>
            <div class="govuk-grid-column-one-sixth">
              {{slot:removeButton}}
            </div>
          </div>
        `,
        values: {
          index: Item().index(),
        },
        slots: {
          actorField: [
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
          descriptionField: [
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
          removeButton: [
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
    columnHeaders: [columnHeaders],
    stepRows: [stepRows],
    saveAndContinueButton: [saveAndContinueButton],
    addStepButton: [addStepButton],
  },
})
