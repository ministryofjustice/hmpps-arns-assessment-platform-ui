import {
  step,
  block,
  field,
  Data,
  Self,
  Post,
  loadTransition,
  accessTransition,
  submitTransition,
  next,
  validation,
  when,
  and,
  Params,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import {
  GovUKButton,
  GovUKDetails,
  GovUKRadioInput,
  GovUKTextInput,
  GovukTextareaInput,
} from '@form-engine-govuk-components/components'
import { DeveloperGuideEffects } from '../../../effects'

/**
 * Collections Playground - Edit (CRUD Demo Spoke)
 *
 * Edit form for individual tasks, demonstrating the spoke page pattern.
 */
export const editStep = step({
  path: '/hub/:itemId/edit',
  title: 'Edit Task',

  // Hide from step navigation
  view: {
    hiddenFromNavigation: true,
  },

  // Load item data
  onLoad: [
    loadTransition({
      effects: [DeveloperGuideEffects.initializePlaygroundItems(), DeveloperGuideEffects.loadPlaygroundItem()],
    }),
  ],

  // Redirect if item not found (allow 'new' or existing item IDs)
  onAccess: [
    accessTransition({
      guards: and(
        Params('itemId').not.match(Condition.Equals('new')),
        Params('itemId').not.match(Condition.Array.IsIn(Data('playgroundItems').pipe(Transformer.Array.Map('id')))),
      ),
      redirect: [next({ goto: 'hub' })],
    }),
  ],

  blocks: [
    // Dynamic heading based on new vs edit
    block<HtmlBlock>({
      variant: 'html',
      content: when(Data('isNewItem').match(Condition.Equals(true)))
        .then('<h1 class="govuk-heading-l">Add task</h1>')
        .else('<h1 class="govuk-heading-l">Edit task</h1>'),
    }),

    // Form wrapper containing all fields and buttons
    block<TemplateWrapper>({
      variant: 'templateWrapper',
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
          field<GovUKTextInput>({
            variant: 'govukTextInput',
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
          field<GovukTextareaInput>({
            variant: 'govukTextarea',
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
          field<GovUKRadioInput>({
            variant: 'govukRadioInput',
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
          field<GovUKRadioInput>({
            variant: 'govukRadioInput',
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
          block<GovUKButton>({
            variant: 'govukButton',
            text: 'Save task',
            name: 'action',
            value: 'save',
          }),
          block<GovUKButton>({
            variant: 'govukButton',
            text: 'Save and add another',
            name: 'action',
            value: 'saveAndAdd',
            classes: 'govuk-button--secondary',
          }),
          // Only show delete for existing items (not new)
          block<GovUKButton>({
            variant: 'govukButton',
            text: 'Delete task',
            name: 'action',
            value: 'delete',
            classes: 'govuk-button--warning',
            hidden: Data('isNewItem').match(Condition.Equals(true)),
          }),
          block<HtmlBlock>({
            variant: 'html',
            content:
              '<a href="/forms/form-engine-developer-guide/collections/playground/hub" class="govuk-link govuk-!-margin-left-3" style="line-height: 3;">Cancel</a>',
          }),
        ],
      },
    }),

    // Code examples
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">How this works</h2>
        <p class="govuk-body">
          This page is the <strong>spoke</strong> in the hub-and-spoke pattern.
          It uses URL parameters to identify the item and effects to load/save data.
        </p>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View spoke page code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `step({
  path: '/hub/:itemId/edit',  // :itemId captures the ID
  title: 'Edit Task',

  // Hide from step navigation
  view: {
    hiddenFromNavigation: true,
  },

  // Load item data on access
  onLoad: [
    loadTransition({
      effects: [
        MyEffects.initializePlaygroundItems(),
        MyEffects.loadPlaygroundItem(),  // Uses context.getRequestParam('itemId')
      ],
    }),
  ],

  // Redirect if item not found
  onAccess: [
    accessTransition({
      guards: Data('itemNotFound').match(Condition.Equals(true)),
      redirect: [next({ goto: 'hub' })],
    }),
  ],

  blocks: [
    // Dynamic heading
    block<HtmlBlock>({
      content: when(Data('isNewItem').match(Condition.Equals(true)))
        .then('<h1>Add task</h1>')
        .else('<h1>Edit task</h1>'),
    }),

    // Form fields
    field<GovUKTextInput>({
      code: 'taskName',
      label: 'Task name',
      validate: [/* ... */],
    }),

    // Submit buttons
    block<GovUKButton>({
      text: 'Save task',
      name: 'action',
      value: 'save',
    }),
  ],

  onSubmission: [
    // Save and return to hub
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [MyEffects.savePlaygroundItem()],
        next: [next({ goto: 'hub' })],
      },
    }),

    // Save and add another
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndAdd')),
      validate: true,
      onValid: {
        effects: [MyEffects.savePlaygroundItem()],
        next: [next({ goto: 'hub/new/edit' })],
      },
    }),
  ],
})`,
        }),
      ],
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View load/save effects code',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `// Load item for editing
loadPlaygroundItem: _deps => (context: EffectFunctionContext) => {
  const itemId = context.getRequestParam('itemId')
  const session = context.getSession()
  const items = session.playgroundItems || []

  if (itemId === 'new') {
    // Empty form for new item
    context.setAnswer('taskName', '')
    context.setAnswer('taskDescription', '')
    context.setData('isNewItem', true)
  } else {
    // Populate form with existing item
    const item = items.find((i: { id: string }) => i.id === itemId)

    if (item) {
      context.setAnswer('taskName', item.name)
      context.setAnswer('taskDescription', item.description)
      context.setAnswer('taskCategory', item.category)
      context.setAnswer('taskPriority', item.priority)
      context.setData('isNewItem', false)
    } else {
      context.setData('itemNotFound', true)
    }
  }
}

// Save item changes
savePlaygroundItem: _deps => (context: EffectFunctionContext) => {
  const itemId = context.getRequestParam('itemId')
  const session = context.getSession()
  const items = session.playgroundItems || []

  const itemData = {
    name: context.getAnswer('taskName'),
    description: context.getAnswer('taskDescription'),
    category: context.getAnswer('taskCategory'),
    priority: context.getAnswer('taskPriority'),
  }

  if (itemId === 'new') {
    // Create new item
    const newItem = { id: \`task_\${Date.now()}\`, ...itemData }
    session.playgroundItems = [...items, newItem]
  } else {
    // Update existing item
    session.playgroundItems = items.map(item =>
      item.id === itemId ? { ...item, ...itemData } : item
    )
  }

  context.setData('playgroundItems', session.playgroundItems)
}`,
        }),
      ],
    }),

    // Back link
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <p class="govuk-body">
          <a href="/forms/form-engine-developer-guide/collections/playground/hub" class="govuk-link">&larr; Back to tasks</a>
        </p>
        <p class="govuk-body">
          <a href="/forms/form-engine-developer-guide/hub" class="govuk-link">&larr; Back to Guide Hub</a>
        </p>
      `,
    }),
  ],

  onSubmission: [
    // Save and return to hub
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [DeveloperGuideEffects.savePlaygroundItem()],
        next: [next({ goto: 'hub' })],
      },
    }),

    // Save and add another
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndAdd')),
      validate: true,
      onValid: {
        effects: [DeveloperGuideEffects.savePlaygroundItem()],
        next: [next({ goto: 'hub/new/edit' })],
      },
    }),

    // Delete item
    submitTransition({
      when: Post('action').match(Condition.Equals('delete')),
      validate: false,
      onAlways: {
        effects: [DeveloperGuideEffects.removePlaygroundItem(Params('itemId'))],
        next: [next({ goto: 'hub' })],
      },
    }),
  ],
})
