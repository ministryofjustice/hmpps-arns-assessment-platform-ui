import { block, field, Format, Item, Literal, Iterator, Self, Data, validation } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CollectionBlock } from '@form-engine/registry/components/collectionBlock'
import {
  GovUKButton,
  GovUKDetails,
  GovUKPagination,
  GovUKTextInput,
  GovukTextareaInput,
} from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../../components/code-block/codeBlock'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

const teamMembers = [
  { id: 'alice', name: 'Alice Johnson', role: 'Developer' },
  { id: 'bob', name: 'Bob Smith', role: 'Designer' },
  { id: 'carol', name: 'Carol Williams', role: 'Manager' },
]

const questions = [
  { id: 'q1', question: 'What is your primary goal?', hint: 'Be specific about outcomes' },
  { id: 'q2', question: 'What challenges do you face?', hint: 'List any blockers or concerns' },
  { id: 'q3', question: 'What support do you need?', hint: 'Resources, training, etc.' },
]

const ratings = [
  { id: 'communication', label: 'Communication skills', description: 'Ability to convey ideas clearly' },
  { id: 'teamwork', label: 'Teamwork', description: 'Collaboration with colleagues' },
  { id: 'problem_solving', label: 'Problem solving', description: 'Analytical and creative thinking' },
]

/**
 * Iterators Playground - Dynamic Fields
 *
 * Interactive examples of generating fields dynamically within collections.
 */
export const pageContent = block<TemplateWrapper>({
  variant: 'templateWrapper',
  template: parseGovUKMarkdown(`
  # Dynamic Fields with Iterators

  Generate form fields dynamically by iterating over data. Use \`Format()\`
  with \`Item().path()\` or \`Item().index()\` to create unique field codes. {.lead}

  > **Important:** Each field must have a unique \`code\`. Use the item's ID or index to ensure uniqueness.

  ---

  ## 1. Index-Based Field Codes

  Use \`Item().index()\` to generate sequential field codes like
  \`note_0\`, \`note_1\`, \`note_2\`:

  {{slot:example1}}

  {{slot:example1Code}}

  ---

  ## 2. ID-Based Field Codes

  Use \`Item().path('id')\` for stable, meaningful codes like
  \`answer_q1\`, \`answer_q2\`. This is preferred when items have unique IDs:

  {{slot:example2}}

  {{slot:example2Code}}

  ---

  ## 3. Multiple Fields Per Item

  Generate multiple related fields for each item. Use a consistent naming pattern
  like \`rating_[id]_score\` and \`rating_[id]_comment\`:

  {{slot:example3}}

  {{slot:example3Code}}

  ---

  ## 4. Dynamic Fields with Validation

  Add validation to dynamically generated fields. The validation uses \`Self()\`
  to reference the current field's value. Try submitting with empty or short values:

  {{slot:example4}}

  {{slot:example4Code}}

  ---

  ## Best Practices

  | Pattern | When to Use |
  |---------|-------------|
  | \`Format('field_%1', Item().index())\` | Simple lists where order matters, items don't have IDs |
  | \`Format('field_%1', Item().path('id'))\` | Items have stable IDs, order may change, data persistence needed |
  | \`Format('%1_%2', 'prefix', Item().path('id'))\` | Multiple field types per item (score, comment, etc.) |

  > **Tip:** Prefer ID-based codes over index-based when items have unique identifiers.
  > This ensures field values persist correctly if the list order changes.

  ---

  {{slot:pagination}}
`),
  slots: {
    example1: [
      block<TemplateWrapper>({
        variant: 'templateWrapper',
        template: `
          <form method="post" class="govuk-!-margin-bottom-6">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            {{slot:fields}}
            {{slot:submit}}
          </form>
        `,
        values: {
          csrfToken: Data('csrfToken'),
        },
        slots: {
          fields: [
            block<CollectionBlock>({
              variant: 'collection-block',
              collection: Literal(teamMembers).each(
                Iterator.Map(
                  block<TemplateWrapper>({
                    variant: 'templateWrapper',
                    template: `
                      <div class="govuk-!-margin-bottom-4 govuk-!-padding-4" style="background: #f3f2f1; border-left: 4px solid #1d70b8;">
                        <p class="govuk-body-s govuk-!-margin-bottom-2">
                          <strong>{{name}}</strong> &mdash; {{role}}
                        </p>
                        {{slot:field}}
                      </div>
                    `,
                    values: {
                      name: Item().path('name'),
                      role: Item().path('role'),
                    },
                    slots: {
                      field: [
                        field<GovUKTextInput>({
                          variant: 'govukTextInput',
                          code: Format('note_%1', Item().index()),
                          label: Format('Note for %1', Item().path('name')),
                          hint: 'Add a quick note for this team member',
                          classes: 'govuk-!-width-full',
                        }),
                      ],
                    },
                  }),
                ),
              ),
            }),
          ],
          submit: [
            block<GovUKButton>({
              variant: 'govukButton',
              text: 'Save notes',
              classes: 'govuk-!-margin-top-2',
            }),
          ],
        },
      }),
    ],
    example1Code: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              const teamMembers = [
                { id: 'alice', name: 'Alice Johnson', role: 'Developer' },
                { id: 'bob', name: 'Bob Smith', role: 'Designer' },
                { id: 'carol', name: 'Carol Williams', role: 'Manager' },
              ]

              field<GovUKTextInput>({
                variant: 'govukTextInput',
                // Dynamic code: note_0, note_1, note_2
                code: Format('note_%1', Item().index()),
                label: Format('Note for %1', Item().path('name')),
              })
            `,
          }),
        ],
      }),
    ],
    example2: [
      block<TemplateWrapper>({
        variant: 'templateWrapper',
        template: `
          <form method="post" class="govuk-!-margin-bottom-6">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            {{slot:fields}}
            {{slot:submit}}
          </form>
        `,
        values: {
          csrfToken: Data('csrfToken'),
        },
        slots: {
          fields: [
            block<CollectionBlock>({
              variant: 'collection-block',
              collection: Literal(questions).each(
                Iterator.Map(
                  block<TemplateWrapper>({
                    variant: 'templateWrapper',
                    template: `
                      <div class="govuk-!-margin-bottom-6">
                        {{slot:field}}
                      </div>
                    `,
                    slots: {
                      field: [
                        field<GovukTextareaInput>({
                          variant: 'govukTextarea',
                          code: Format('answer_%1', Item().path('id')),
                          label: Item().path('question'),
                          hint: Item().path('hint'),
                          rows: '3',
                        }),
                      ],
                    },
                  }),
                ),
              ),
            }),
          ],
          submit: [
            block<GovUKButton>({
              variant: 'govukButton',
              text: 'Save answers',
              classes: 'govuk-!-margin-top-2',
            }),
          ],
        },
      }),
    ],
    example2Code: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              const questions = [
                { id: 'q1', question: 'What is your primary goal?', hint: 'Be specific' },
                { id: 'q2', question: 'What challenges do you face?', hint: 'List blockers' },
                { id: 'q3', question: 'What support do you need?', hint: 'Resources, etc.' },
              ]

              field<GovukTextareaInput>({
                variant: 'govukTextarea',
                // Dynamic code using item ID: answer_q1, answer_q2, answer_q3
                code: Format('answer_%1', Item().path('id')),
                // Dynamic label from item data
                label: Item().path('question'),
                hint: Item().path('hint'),
                rows: '3',
              })
            `,
          }),
        ],
      }),
    ],
    example3: [
      block<TemplateWrapper>({
        variant: 'templateWrapper',
        template: `
          <form method="post" class="govuk-!-margin-bottom-6">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            {{slot:fields}}
            {{slot:submit}}
          </form>
        `,
        values: {
          csrfToken: Data('csrfToken'),
        },
        slots: {
          fields: [
            block<CollectionBlock>({
              variant: 'collection-block',
              collection: Literal(ratings).each(
                Iterator.Map(
                  block<TemplateWrapper>({
                    variant: 'templateWrapper',
                    template: `
                      <div class="govuk-!-margin-bottom-6 govuk-!-padding-4" style="border: 1px solid #b1b4b6; border-radius: 4px;">
                        <h3 class="govuk-heading-s govuk-!-margin-bottom-1">{{label}}</h3>
                        <p class="govuk-body-s govuk-hint govuk-!-margin-bottom-4">{{description}}</p>
                        <div class="govuk-grid-row">
                          <div class="govuk-grid-column-one-third">
                            {{slot:scoreField}}
                          </div>
                          <div class="govuk-grid-column-two-thirds">
                            {{slot:commentField}}
                          </div>
                        </div>
                      </div>
                    `,
                    values: {
                      label: Item().path('label'),
                      description: Item().path('description'),
                    },
                    slots: {
                      scoreField: [
                        field<GovUKTextInput>({
                          variant: 'govukTextInput',
                          code: Format('rating_%1_score', Item().path('id')),
                          label: 'Score (1-5)',
                          hint: 'Enter 1-5',
                          classes: 'govuk-input--width-2',
                          inputMode: 'numeric',
                        }),
                      ],
                      commentField: [
                        field<GovUKTextInput>({
                          variant: 'govukTextInput',
                          code: Format('rating_%1_comment', Item().path('id')),
                          label: 'Comments',
                          hint: 'Optional feedback',
                          classes: 'govuk-!-width-full',
                        }),
                      ],
                    },
                  }),
                ),
              ),
            }),
          ],
          submit: [
            block<GovUKButton>({
              variant: 'govukButton',
              text: 'Save ratings',
              classes: 'govuk-!-margin-top-2',
            }),
          ],
        },
      }),
    ],
    example3Code: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              const ratings = [
                { id: 'communication', label: 'Communication skills', description: '...' },
                { id: 'teamwork', label: 'Teamwork', description: '...' },
                { id: 'problem_solving', label: 'Problem solving', description: '...' },
              ]

              // Two fields per item with related codes
              slots: {
                scoreField: [
                  field<GovUKTextInput>({
                    variant: 'govukTextInput',
                    // rating_communication_score, rating_teamwork_score, etc.
                    code: Format('rating_%1_score', Item().path('id')),
                    label: 'Score (1-5)',
                  }),
                ],
                commentField: [
                  field<GovUKTextInput>({
                    variant: 'govukTextInput',
                    // rating_communication_comment, rating_teamwork_comment, etc.
                    code: Format('rating_%1_comment', Item().path('id')),
                    label: 'Comments',
                  }),
                ],
              }
            `,
          }),
        ],
      }),
    ],
    example4: [
      block<TemplateWrapper>({
        variant: 'templateWrapper',
        template: `
          <form method="post" class="govuk-!-margin-bottom-6">
            <input type="hidden" name="_csrf" value="{{csrfToken}}">
            {{slot:fields}}
            {{slot:submit}}
          </form>
        `,
        values: {
          csrfToken: Data('csrfToken'),
        },
        slots: {
          fields: [
            block<CollectionBlock>({
              variant: 'collection-block',
              collection: Literal(teamMembers).each(
                Iterator.Map(
                  block<TemplateWrapper>({
                    variant: 'templateWrapper',
                    template: `
                      <div class="govuk-!-margin-bottom-4">
                        {{slot:field}}
                      </div>
                    `,
                    slots: {
                      field: [
                        field<GovUKTextInput>({
                          variant: 'govukTextInput',
                          code: Format('feedback_%1', Item().path('id')),
                          label: Format('Feedback for %1', Item().path('name')),
                          hint: Format('Required: Provide feedback for %1', Item().path('name')),
                          validate: [
                            validation({
                              when: Self().not.match(Condition.IsRequired()),
                              message: 'Enter feedback for this team member',
                            }),
                            validation({
                              when: Self().not.match(Condition.String.HasMinLength(10)),
                              message: 'Feedback must be at least 10 characters',
                            }),
                          ],
                        }),
                      ],
                    },
                  }),
                ),
              ),
            }),
          ],
          submit: [
            block<GovUKButton>({
              variant: 'govukButton',
              text: 'Submit feedback',
              classes: 'govuk-!-margin-top-2',
            }),
          ],
        },
      }),
    ],
    example4Code: [
      block<GovUKDetails>({
        variant: 'govukDetails',
        summaryText: 'View code',
        content: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
              field<GovUKTextInput>({
                variant: 'govukTextInput',
                code: Format('feedback_%1', Item().path('id')),
                // Dynamic label and hint using Format()
                label: Format('Feedback for %1', Item().path('name')),
                hint: Format('Required: Provide feedback for %1', Item().path('name')),
                validate: [
                  validation({
                    // Self() refers to this field's value
                    when: Self().not.match(Condition.IsRequired()),
                    // Note: message must be a static string
                    message: 'Enter feedback for this team member',
                  }),
                  validation({
                    when: Self().not.match(Condition.String.HasMinLength(10)),
                    message: 'Feedback must be at least 10 characters',
                  }),
                ],
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      block<GovUKPagination>({
        variant: 'govukPagination',
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/iterators/playground/find-examples',
          labelText: 'Find Examples',
        },
        next: {
          href: '/forms/form-engine-developer-guide/iterators/playground/chaining-examples',
          labelText: 'Chaining Examples',
        },
      }),
    ],
  },
})
