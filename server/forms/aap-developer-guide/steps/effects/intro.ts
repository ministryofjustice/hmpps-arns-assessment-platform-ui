import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKPagination } from '@form-engine-govuk-components/components'

/**
 * Effects - Introduction
 *
 * What effects are, when to use them, and the EffectFunctionContext API.
 */
export const introStep = step({
  path: '/intro',
  title: 'Understanding Effects',
  isEntryPoint: true,
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Effects</h1>

        <p class="govuk-body-l">
          Effects are functions that perform side effects during form processing &mdash;
          loading data, saving answers, calling APIs, and managing session state.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">When to Use Effects</h2>

        <p class="govuk-body">
          Effects are used within <strong>transitions</strong> to perform actions at
          specific lifecycle points:
        </p>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Loading data:</strong> Fetch user profiles, assessment data, or
            reference data from APIs
          </li>
          <li>
            <strong>Saving answers:</strong> Persist form answers to a database or API
          </li>
          <li>
            <strong>Pre-populating fields:</strong> Set initial field values from loaded data
          </li>
          <li>
            <strong>In-page actions:</strong> Handle postcode lookups, address fetches, or
            other interactive features
          </li>
          <li>
            <strong>Session management:</strong> Track progress, store temporary state
          </li>
          <li>
            <strong>Notifications:</strong> Send emails, trigger webhooks, log analytics
          </li>
        </ul>
      `,
    }),

    // Effects vs Other Functions
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Effects vs Conditions vs Transformers</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Function Type</th>
              <th scope="col" class="govuk-table__header">Purpose</th>
              <th scope="col" class="govuk-table__header">Returns</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Effect</strong></td>
              <td class="govuk-table__cell">Perform side effects (load, save, call APIs)</td>
              <td class="govuk-table__cell"><code>void</code> or <code>Promise&lt;void&gt;</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Condition</strong></td>
              <td class="govuk-table__cell">Test values (validation, visibility)</td>
              <td class="govuk-table__cell"><code>boolean</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><strong>Transformer</strong></td>
              <td class="govuk-table__cell">Transform values (format, clean)</td>
              <td class="govuk-table__cell">Transformed value</td>
            </tr>
          </tbody>
        </table>

        <p class="govuk-body">
          <strong>Key difference:</strong> Effects receive a <code>context</code> object that
          provides access to form state, answers, session data, and API for setting data.
          Conditions and transformers only receive values.
        </p>
      `,
    }),

    // The Context Object
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">The EffectFunctionContext API</h2>

        <p class="govuk-body">
          Every effect receives a <code>context</code> object as its first parameter.
          This provides methods to read and write form state:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Reading data
context.getAnswer('fieldCode')          // Get a single answer value
context.getAnswers()                    // Get all answers
context.getData('key')                  // Get supplementary data
context.getData()                       // Get all supplementary data
context.getSession()                    // Get session object (mutable)
context.getState('key')                 // Get state value (e.g., user, csrfToken)
context.getRequestParam('paramName')    // Get URL route parameter

// Writing data
context.setAnswer('fieldCode', value)   // Set a form answer (pre-populate)
context.setData('key', value)           // Set supplementary data
// Session is mutable: context.getSession().myKey = value`,
    }),

    // Basic Usage
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Usage</h2>
        <p class="govuk-body">
          Effects are used inside transitions. Import the effect builders and use them
          in the <code>effects</code> array:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `import { loadTransition, submitTransition, next } from '@form-engine/form/builders'
import { MyEffects } from './effects'

step({
  path: '/my-step',
  title: 'My Step',

  // Load effects run when the step is accessed
  onLoad: [
    loadTransition({
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
        next: [next({ goto: 'next-step' })],
      },
    }),
  ],

  blocks: [/* ... */],
})`,
          }),
        ],
      },
    }),

    // Effect Parameters
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Effect Parameters</h2>
        <p class="govuk-body">
          Effects can accept additional parameters. Pass static values or dynamic
          expressions like <code>Answer()</code>, <code>Data()</code>, or <code>Params()</code>:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `// Static parameter
MyEffects.loadAssessment('assessment-123')

// Dynamic: from URL route parameter
MyEffects.loadAssessment(Params('id'))

// Dynamic: from another field's answer
MyEffects.lookupPostcode(Post('postcode'))

// Multiple parameters
MyEffects.saveWithOptions('accommodation', { draft: true })`,
          }),
        ],
      },
    }),

    // setAnswer vs setData
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">setAnswer() vs setData()</h2>

        <p class="govuk-body">
          Understanding when to use each is important:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Method</th>
              <th scope="col" class="govuk-table__header">Use For</th>
              <th scope="col" class="govuk-table__header">Access Via</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>setAnswer()</code></td>
              <td class="govuk-table__cell">Pre-populating form fields, loading saved drafts</td>
              <td class="govuk-table__cell"><code>Answer('code')</code></td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>setData()</code></td>
              <td class="govuk-table__cell">API responses, reference data, dropdown options</td>
              <td class="govuk-table__cell"><code>Data('key')</code></td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `// Loading saved answers into form fields
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
field<GovUKRadioInput>({
  code: 'country',
  items: Data('countries'),  // Reference data, not an answer
})`,
    }),

    // Where Effects Run
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Where Effects Run</h2>

        <p class="govuk-body">
          Effects are used in different transition types depending on when you need them to run:
        </p>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Transition</th>
              <th scope="col" class="govuk-table__header">When Effects Run</th>
              <th scope="col" class="govuk-table__header">Common Uses</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>loadTransition</code></td>
              <td class="govuk-table__cell">Before access checks, on every request</td>
              <td class="govuk-table__cell">Load data from APIs, populate dropdowns</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>accessTransition</code></td>
              <td class="govuk-table__cell">Before redirect (when denied)</td>
              <td class="govuk-table__cell">Log access attempts, analytics</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>actionTransition</code></td>
              <td class="govuk-table__cell">During POST, before render</td>
              <td class="govuk-table__cell">Postcode lookup, address fetch</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell"><code>submitTransition</code></td>
              <td class="govuk-table__cell">After validation (onValid/onInvalid/onAlways)</td>
              <td class="govuk-table__cell">Save answers, send notifications</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Example: Complete Load and Save Cycle
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Example: Load and Save Cycle</h2>
        <p class="govuk-body">
          A typical step loads data when accessed and saves answers when submitted:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `step({
  path: '/personal-details',
  title: 'Personal Details',

  onLoad: [
    loadTransition({
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
        next: [next({ goto: 'contact-details' })],
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
})`,
          }),
        ],
      },
    }),

    // Next steps
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Next Steps</h2>
        <ul class="govuk-list">
          <li>
            <a href="/forms/form-engine-developer-guide/effects/context" class="govuk-link govuk-link--no-visited-state">
              <strong>The Context Object &rarr;</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Deep dive into the context API methods.
            </p>
          </li>
          <li class="govuk-!-margin-top-4">
            <a href="/forms/form-engine-developer-guide/effects/custom" class="govuk-link govuk-link--no-visited-state">
              <strong>Building Custom Effects &rarr;</strong>
            </a>
            <p class="govuk-body govuk-!-margin-top-1">
              Learn how to create your own effects with dependency injection.
            </p>
          </li>
        </ul>
      `,
    }),

    // Navigation
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        {{slot:pagination}}
      `,
      slots: {
        pagination: [
          block<GovUKPagination>({
            variant: 'govukPagination',
            classes: 'govuk-pagination--inline',
            previous: {
              href: '/forms/form-engine-developer-guide/hub',
              labelText: 'Guide Hub',
            },
            next: {
              href: '/forms/form-engine-developer-guide/effects/context',
              labelText: 'The Context Object',
            },
          }),
        ],
      },
    }),
  ],
})
