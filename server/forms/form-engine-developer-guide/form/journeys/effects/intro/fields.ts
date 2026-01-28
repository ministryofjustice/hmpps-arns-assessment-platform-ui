import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * Effects - Introduction
 *
 * What effects are, when to use them, and the EffectFunctionContext API.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Effects

  Effects are functions that perform side effects during form processing —
  loading data, saving answers, calling APIs, and managing session state. {.lead}

  ---

  ## When to Use Effects

  Effects are used within **transitions** to perform actions at specific lifecycle points:

  - **Loading data:** Fetch user profiles, assessment data, or reference data from APIs
  - **Saving answers:** Persist form answers to a database or API
  - **Pre-populating fields:** Set initial field values from loaded data
  - **In-page actions:** Handle postcode lookups, address fetches, or other interactive features
  - **Session management:** Track progress, store temporary state
  - **Notifications:** Send emails, trigger webhooks, log analytics

  ---

  ## Effects vs Conditions vs Transformers

  | Function Type | Purpose | Returns |
  |---------------|---------|---------|
  | **Effect** | Perform side effects (load, save, call APIs) | \`void\` or \`Promise<void>\` |
  | **Condition** | Test values (validation, visibility) | \`boolean\` |
  | **Transformer** | Transform values (format, clean) | Transformed value |

  **Key difference:** Effects receive a \`context\` object that provides access to form state,
  answers, session data, and API for setting data. Conditions and transformers only receive values.

  ---

  ## The EffectFunctionContext API

  Every effect receives a \`context\` object as its first parameter.
  This provides methods to read and write form state:

  {{slot:contextApiCode}}

  ---

  ## Basic Usage

  Effects are used inside transitions. Import the effect builders and use them
  in the \`effects\` array:

  {{slot:basicUsageCode}}

  ---

  ## Effect Parameters

  Effects can accept additional parameters. Pass static values or dynamic
  expressions like \`Answer()\`, \`Data()\`, or \`Params()\`:

  {{slot:parametersCode}}

  ---

  ## setAnswer() vs setData()

  Understanding when to use each is important:

  | Method | Use For | Access Via |
  |--------|---------|------------|
  | \`setAnswer()\` | Pre-populating form fields, loading saved drafts | \`Answer('code')\` |
  | \`setData()\` | API responses, reference data, dropdown options | \`Data('key')\` |

  {{slot:setAnswerVsSetDataCode}}

  ---

  ## Where Effects Run

  Effects are used in different transition types depending on when you need them to run:

  | Transition | When Effects Run | Common Uses |
  |------------|------------------|-------------|
  | \`accessTransition\` | Before evaluating conditions and redirects | Load data from APIs, populate dropdowns |
  | \`actionTransition\` | During POST, before render | Postcode lookup, address fetch |
  | \`submitTransition\` | After validation (onValid/onInvalid/onAlways) | Save answers, send notifications |

  ---

  ## Example: Load and Save Cycle

  A typical step loads data when accessed and saves answers when submitted:

  {{slot:loadSaveExampleCode}}

  ---

  ## Next Steps

  - [**The Context Object →**](/form-engine-developer-guide/effects/context)

    Deep dive into the context API methods.

  - [**Building Custom Effects →**](/form-engine-developer-guide/effects/custom)

    Learn how to create your own effects with dependency injection.

  ---

  {{slot:pagination}}
`),
  slots: {
    contextApiCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Reading data
          context.getAnswer('fieldCode')          // Get a single answer value
          context.getAllAnswers()                    // Get all answers
          context.getData('key')                  // Get supplementary data
          context.getData()                       // Get all supplementary data
          context.getSession()                    // Get session object (mutable)
          context.getState('key')                 // Get state value (e.g., user, csrfToken)
          context.getRequestParam('paramName')    // Get URL route parameter

          // Writing data
          context.setAnswer('fieldCode', value)   // Set a form answer (pre-populate)
          context.setData('key', value)           // Set supplementary data
          // Session is mutable: context.getSession().myKey = value
        `,
      }),
    ],
    basicUsageCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { accessTransition, submitTransition, redirect } from '@form-engine/form/builders'
          import { MyEffects } from './effects'

          step({
            path: '/my-step',
            title: 'My Step',

            // Access effects run when the step is accessed
            onAccess: [
              accessTransition({
                effects: [
                  MyEffects.loadUserProfile(),
                  MyEffects.loadReferenceData(),
                ],
              }),
            ],

            // Submit effects run when the form is submitted
            onSubmission: [
              submitTransition({
                validate: true,
                onValid: {
                  effects: [MyEffects.saveAnswers()],
                  next: [redirect({ goto: 'next-step' })],
                },
              }),
            ],

            blocks: [/* ... */],
          })
        `,
      }),
    ],
    parametersCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Static parameter
          MyEffects.loadAssessment('assessment-123')

          // Dynamic: from URL route parameter
          MyEffects.loadAssessment(Params('id'))

          // Dynamic: from another field's answer
          MyEffects.lookupPostcode(Post('postcode'))

          // Multiple parameters
          MyEffects.saveWithOptions('accommodation', { draft: true })
        `,
      }),
    ],
    setAnswerVsSetDataCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Loading saved answers into form fields
          loadSavedDraft: deps => async (context) => {
            const draft = await deps.api.loadDraft(context.getSession().draftId)

            // Pre-populate form fields with saved values
            context.setAnswer('firstName', draft.firstName)
            context.setAnswer('email', draft.email)
          }

          // Loading reference data for dropdowns
          loadReferenceData: deps => async (context) => {
            const countries = await deps.api.getCountries()
            const titles = await deps.api.getTitles()

            // Store as supplementary data (not form fields)
            context.setData('countries', countries)
            context.setData('titles', titles)
          }

          // In the form, use Data() to access reference data
          GovUKRadioInput({
            code: 'country',
            items: Data('countries'),  // Reference data, not an answer
          })
        `,
      }),
    ],
    loadSaveExampleCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          step({
            path: '/personal-details',
            title: 'Personal Details',

            onAccess: [
              accessTransition({
                effects: [
                  // Load user profile to pre-populate fields
                  MyEffects.loadUserProfile(Params('userId')),
                  // Load dropdown options
                  MyEffects.loadTitleOptions(),
                ],
              }),
            ],

            onSubmission: [
              submitTransition({
                validate: true,
                onValid: {
                  effects: [
                    // Save the answers
                    MyEffects.savePersonalDetails(),
                    // Track completion
                    MyEffects.trackStepComplete('personal-details'),
                  ],
                  next: [redirect({ goto: 'contact-details' })],
                },
                onInvalid: {
                  effects: [
                    // Save as draft even if invalid
                    MyEffects.saveDraft(),
                  ],
                  // Stay on page (no next)
                },
              }),
            ],

            blocks: [/* form fields */],
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/generators/playground/dates',
          labelText: 'Date Generators',
        },
        next: {
          href: '/form-engine-developer-guide/effects/context',
          labelText: 'The Context Object',
        },
      }),
    ],
  },
})
