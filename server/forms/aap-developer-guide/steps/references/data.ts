import { step, block } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { TemplateWrapper } from '@form-engine/registry/components/templateWrapper'
import { CodeBlock } from '@form-engine/registry/components/codeBlock'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'

/**
 * References - Data()
 *
 * Comprehensive documentation for the Data() reference,
 * covering external data access, onLoad effects, and common patterns.
 */
export const dataStep = step({
  path: '/data',
  title: 'Data Reference',
  blocks: [
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <h1 class="govuk-heading-l">Data()</h1>

        <p class="govuk-body-l">
          The <code>Data()</code> reference retrieves values from external data sources
          loaded via onLoad transitions. Use it to access API responses, database lookups,
          and pre-fetched configuration.
        </p>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">Signature</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `Data(key: string): ReferenceExpr`,
    }),

    block<HtmlBlock>({
      variant: 'html',
      content: `
        <p class="govuk-body">
          <strong>Parameters:</strong>
        </p>
        <ul class="govuk-list govuk-list--bullet">
          <li><code>key</code> &mdash; The data key, with optional dot notation for nested access</li>
        </ul>

        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">

        <h2 class="govuk-heading-m">How Data Gets Loaded</h2>
        <p class="govuk-body">
          Data must be loaded before you can reference it. This happens in <strong>onLoad transitions</strong>
          using effects that call <code>context.setData()</code>:
        </p>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
// In your effects file
export const { effects: MyEffects, createRegistry: createMyEffectsRegistry } =
  defineEffectsWithDeps<{ api: ApiService }>()({
    loadUserProfile: deps => async (context: EffectFunctionContext) => {
      const userId = context.getParams().id
      const user = await deps.api.getUser(userId)

      // Make the data available via Data('user')
      context.setData('user', user)
    },
  })

// In your step definition
step({
  path: '/profile',
  title: 'User Profile',
  onLoad: [
    loadTransition({
      effects: [MyEffects.loadUserProfile()],
    }),
  ],
  blocks: [/* ... */],
})`,
    }),

    block<GovUKWarningText>({
      variant: 'govukWarningText',
      html: `<strong>Data must be loaded before use.</strong> If you reference <code>Data('user')</code>
        without loading it in onLoad, the value will be <code>undefined</code>.`,
    }),

    // Basic usage
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Basic Usage</h2>
      `,
    }),

    block<CodeBlock>({
      variant: 'codeBlock',
      language: 'typescript',
      code: `
import { Data } from '@form-engine/form/builders'

// Simple data access
Data('user')
Data('config')
Data('lookupOptions')

// Nested property access
Data('user.email')
Data('user.profile.address.postcode')
Data('config.features.darkMode')`,
    }),

    // Common scenarios
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Common Scenarios</h2>
      `,
    }),

    // Scenario 1: Pre-populating fields
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">1. Pre-Populating Fields</h3>
        <p class="govuk-body">
          Load existing data and use it as default values:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Effect loads user data
context.setData('existingApplication', await api.getApplication(id))

// Field uses it as default
field<GovUKTextInput>({
  variant: 'govukTextInput',
  code: 'businessName',
  label: 'Business name',
  defaultValue: Data('existingApplication.businessName'),
})`,
          }),
        ],
      },
    }),

    // Scenario 2: Dropdown options
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">2. Dynamic Dropdown Options</h3>
        <p class="govuk-body">
          Load options from an API and use them in select fields:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Effect loads options
loadCountries: deps => async (context: EffectFunctionContext) => {
  const countries = await deps.api.getCountries()
  context.setData('countries', countries.map(c => ({
    value: c.code,
    text: c.name,
  })))
}

// Field uses the options
field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'country',
  fieldset: { legend: { text: 'Country' } },
  items: Data('countries'),
})`,
          }),
        ],
      },
    }),

    // Scenario 3: Displaying external information
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">3. Displaying Information</h3>
        <p class="govuk-body">
          Show external data in read-only blocks:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
block<HtmlBlock>({
  variant: 'html',
  content: Format(
    '<h2 class="govuk-heading-m">Application: %1</h2><p class="govuk-body">Status: %2</p>',
    Data('application.reference'),
    Data('application.status')
  ),
})`,
          }),
        ],
      },
    }),

    // Scenario 4: Conditional logic
    block<TemplateWrapper>({
      variant: 'templateWrapper',
      template: `
        <h3 class="govuk-heading-s">4. Conditional Logic</h3>
        <p class="govuk-body">
          Show or hide content based on external data:
        </p>
        {{slot:code}}
      `,
      slots: {
        code: [
          block<CodeBlock>({
            variant: 'codeBlock',
            language: 'typescript',
            code: `
// Show premium features only for premium users
block<HtmlBlock>({
  variant: 'html',
  hidden: Data('user.tier').not.match(Condition.Equals('premium')),
  content: '<p class="govuk-body">Premium feature content here...</p>',
})

// Show different step based on user permissions
field<GovUKRadioInput>({
  variant: 'govukRadioInput',
  code: 'action',
  hidden: Data('permissions.canApprove').not.match(Condition.Equals(true)),
  // ...
})`,
          }),
        ],
      },
    }),

    // Data structure patterns
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Data Structure Patterns</h2>
        <p class="govuk-body">
          Organise your data keys thoughtfully. Here are common patterns:
        </p>
      `,
    }),

    block<GovUKDetails>({
      variant: 'govukDetails',
      summaryText: 'View recommended data structure',
      content: [
        block<CodeBlock>({
          variant: 'codeBlock',
          language: 'typescript',
          code: `
// Pattern 1: Domain-based grouping
context.setData('application', applicationData)
context.setData('user', userData)
context.setData('config', configData)

// Access via:
Data('application.status')
Data('user.email')
Data('config.maxItems')

// Pattern 2: Feature-based grouping
context.setData('lookup', {
  countries: countriesList,
  currencies: currenciesList,
  categories: categoriesList,
})

// Access via:
Data('lookup.countries')
Data('lookup.currencies')

// Pattern 3: Page-specific data
context.setData('pageData', {
  title: 'Edit Application',
  breadcrumbs: [...],
  existingValues: {...},
})`,
        }),
      ],
    }),

    // Data vs Answer
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Data() vs Answer()</h2>

        <table class="govuk-table">
          <thead class="govuk-table__head">
            <tr class="govuk-table__row">
              <th scope="col" class="govuk-table__header">Aspect</th>
              <th scope="col" class="govuk-table__header">Data()</th>
              <th scope="col" class="govuk-table__header">Answer()</th>
            </tr>
          </thead>
          <tbody class="govuk-table__body">
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Source</td>
              <td class="govuk-table__cell">External (APIs, databases)</td>
              <td class="govuk-table__cell">User input (form fields)</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">When loaded</td>
              <td class="govuk-table__cell">onLoad transitions</td>
              <td class="govuk-table__cell">Form submission / defaults</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Typical use</td>
              <td class="govuk-table__cell">Lookup data, configuration</td>
              <td class="govuk-table__cell">Validation, dynamic display</td>
            </tr>
            <tr class="govuk-table__row">
              <td class="govuk-table__cell">Mutability</td>
              <td class="govuk-table__cell">Set once at load time</td>
              <td class="govuk-table__cell">Changes with user interaction</td>
            </tr>
          </tbody>
        </table>
      `,
    }),

    // Best practices
    block<HtmlBlock>({
      variant: 'html',
      content: `
        <hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">
        <h2 class="govuk-heading-m">Best Practices</h2>

        <ul class="govuk-list govuk-list--bullet">
          <li>
            <strong>Always load before use:</strong> Ensure your onLoad effects set all required
            data before the step renders
          </li>
          <li>
            <strong>Use consistent key naming:</strong> Stick to camelCase for data keys
            (e.g., <code>userData</code>, not <code>user_data</code>)
          </li>
          <li>
            <strong>Handle loading errors:</strong> If an API call fails, set appropriate
            fallback data or show an error message
          </li>
          <li>
            <strong>Keep data minimal:</strong> Only load what you need for the current step
            to keep the form responsive
          </li>
          <li>
            <strong>Document your data shape:</strong> Use TypeScript interfaces to define
            expected data structures
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
              href: '/forms/form-engine-developer-guide/references/answer',
              labelText: 'Answer Reference',
            },
            next: {
              href: '/forms/form-engine-developer-guide/references/self',
              labelText: 'Self Reference',
            },
          }),
        ],
      },
    }),
  ],
})
