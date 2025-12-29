import { Data, Self, validation, when } from '@form-engine/form/builders'
import { HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import {
  GovUKButton,
  GovUKDetails,
  GovUKRadioInput,
  GovUKTextInput,
  GovUKTextareaInput,
} from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Iterators Playground - Edit (CRUD Demo Spoke)
 *
 * Edit form for individual tasks, demonstrating the spoke page pattern
 * with Iterator syntax for access guards.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  {{slot:heading}}

  {{slot:form}}

  ---

  ## How this works

  This spoke page uses \`Iterator.Find\` in the access guard
  to check if the item exists in the collection.

  {{slot:iteratorCode}}

  {{slot:collectionCode}}

  ### When to Use Each

  | Method | Use Case |
  |--------|----------|
  | \`Iterator.Find\` | When you need to check if a specific item exists, or retrieve a single item by condition. More semantically clear for "find by ID" patterns. |
  | \`Transformer.Array.Map\` | When you need to transform all items (e.g., extract all IDs as an array). Better when working with array-level operations. |

  ---

  [← Back to tasks](/forms/form-engine-developer-guide/iterators/playground/hub)

  [← Back to Guide Hub](/forms/form-engine-developer-guide/hub)
`),
  slots: {
    heading: [
      HtmlBlock({
        content: when(Data('isNewItem').match(Condition.Equals(true)))
          .then('<h1 class="govuk-heading-l">Add task</h1>')
          .else('<h1 class="govuk-heading-l">Edit task</h1>'),
      }),
    ],
    form: [
      TemplateWrapper({
        template: `
          <p class="govuk-body">
            Fill in the task details below. Required fields are marked with an asterisk (*).
          </p>
          <form method="post">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            {{slot:fields}}
            <div class="govuk-button-group govuk-!-margin-top-6">
              {{slot:buttons}}
            </div>
          </form>
        `,
        values: {
          csrfToken: Data('csrfToken'),
        },
        slots: {
          fields: [
            // Task name field
            GovUKTextInput({
              code: 'taskName',
              label: 'Task name *',
              hint: 'Give your task a clear, descriptive name',
              validate: [
                validation({
                  when: Self().not.match(Condition.IsRequired()),
                  message: 'Enter a task name',
                }),
                validation({
                  when: Self().not.match(Condition.String.HasMaxLength(100)),
                  message: 'Task name must be 100 characters or less',
                }),
              ],
            }),

            // Task description field
            GovUKTextareaInput({
              code: 'taskDescription',
              label: 'Description',
              hint: 'Optional: Add more details about what needs to be done',
              rows: '4',
              validate: [
                validation({
                  when: Self().not.match(Condition.String.HasMaxLength(500)),
                  message: 'Description must be 500 characters or less',
                }),
              ],
            }),

            // Category field
            GovUKRadioInput({
              code: 'taskCategory',
              fieldset: {
                legend: { text: 'Category' },
              },
              hint: 'Choose a category for this task',
              items: [
                { value: 'learning', text: 'Learning' },
                { value: 'development', text: 'Development' },
                { value: 'testing', text: 'Testing' },
                { value: 'documentation', text: 'Documentation' },
                { value: 'other', text: 'Other' },
              ],
            }),

            // Priority field
            GovUKRadioInput({
              code: 'taskPriority',
              fieldset: {
                legend: { text: 'Priority' },
              },
              items: [
                { value: 'high', text: 'High', hint: { text: 'Needs immediate attention' } },
                { value: 'medium', text: 'Medium', hint: { text: 'Should be done soon' } },
                { value: 'low', text: 'Low', hint: { text: 'Can wait if needed' } },
              ],
            }),
          ],
          buttons: [
            GovUKButton({
              text: 'Save task',
              name: 'action',
              value: 'save',
            }),
            GovUKButton({
              text: 'Save and add another',
              name: 'action',
              value: 'saveAndAdd',
              classes: 'govuk-button--secondary',
            }),
            // Only show delete for existing items (not new)
            GovUKButton({
              text: 'Delete task',
              name: 'action',
              value: 'delete',
              classes: 'govuk-button--warning',
              hidden: Data('isNewItem').match(Condition.Equals(true)),
            }),
            HtmlBlock({
              content:
                '<a href="/forms/form-engine-developer-guide/iterators/playground/hub" class="govuk-link govuk-!-margin-left-3" style="line-height: 3;">Cancel</a>',
            }),
          ],
        },
      }),
    ],
    iteratorCode: [
      GovUKDetails({
        summaryText: 'View Iterator.Find access guard',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Using Iterator.Find instead of Transformer.Array.Map + Array.IsIn
              onAccess: [
                accessTransition({
                  guards: and(
                    Params('itemId').not.match(Condition.Equals('new')),
                    // Use Iterator.Find to check if item exists
                    Data('playgroundItems')
                      .each(Iterator.Find(
                        Item().path('id').match(Condition.Equals(Params('itemId')))
                      ))
                      .not.match(Condition.IsRequired()),
                  ),
                  redirect: [next({ goto: 'hub' })],
                }),
              ]

              // This redirects to the hub if:
              // 1. The itemId is not 'new' AND
              // 2. No item with matching ID was found (Iterator.Find returns undefined)
            `,
          }),
        ],
      }),
    ],
    collectionCode: [
      GovUKDetails({
        summaryText: 'Compare with Collection approach',
        content: [
          CodeBlock({
            language: 'typescript',
            code: `
              // Collection approach (using Transformer.Array.Map)
              onAccess: [
                accessTransition({
                  guards: and(
                    Params('itemId').not.match(Condition.Equals('new')),
                    Params('itemId').not.match(
                      Condition.Array.IsIn(
                        Data('playgroundItems').pipe(Transformer.Array.Map('id'))
                      )
                    ),
                  ),
                  redirect: [next({ goto: 'hub' })],
                }),
              ]

              // This extracts all IDs first, then checks if itemId is in the array.
              // Iterator.Find is more direct - it finds the item or returns undefined.
            `,
          }),
        ],
      }),
    ],
  },
})
