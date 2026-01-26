import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKDetails, GovUKPagination, GovUKWarningText } from '@form-engine-govuk-components/components'
import { CodeBlock } from '../../../../components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'

/**
 * References - Data()
 *
 * Comprehensive documentation for the Data() reference,
 * covering external data access, onAccess effects, and common patterns.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Data()

The \`Data()\` reference retrieves values from external data sources
loaded via onAccess transitions. Use it to access API responses, database lookups,
and pre-fetched configuration. {.lead}

---

## Signature

{{slot:signatureCode}}

**Parameters:**

- \`key\` — The data key, with optional dot notation for nested access

---

## How Data Gets Loaded

Data must be loaded before you can reference it. This happens in **onAccess transitions**
using effects that call \`context.setData()\`:

{{slot:loadingCode}}

{{slot:warning}}

---

## Basic Usage

{{slot:basicCode}}

---

## Common Scenarios

### 1. Pre-Populating Fields

Load existing data and use it as default values:

{{slot:scenario1Code}}

### 2. Dynamic Dropdown Options

Load options from an API and use them in select fields:

{{slot:scenario2Code}}

### 3. Displaying Information

Show external data in read-only blocks:

{{slot:scenario3Code}}

### 4. Conditional Logic

Show or hide content based on external data:

{{slot:scenario4Code}}

---

## Data Structure Patterns

Organise your data keys thoughtfully. Here are common patterns:

{{slot:structurePatterns}}

---

## Data() vs Answer()

| Aspect | Data() | Answer() |
|--------|--------|----------|
| Source | External (APIs, databases) | User input (form fields) |
| When loaded | onAccess transitions | Form submission / defaults |
| Typical use | Lookup data, configuration | Validation, dynamic display |
| Mutability | Set once at load time | Changes with user interaction |

---

## Best Practices

- **Always load before use:** Ensure your onAccess effects set all required data before the step renders
- **Use consistent key naming:** Stick to camelCase for data keys (e.g., \`userData\`, not \`user_data\`)
- **Handle loading errors:** If an API call fails, set appropriate fallback data or show an error message
- **Keep data minimal:** Only load what you need for the current step to keep the form responsive
- **Document your data shape:** Use TypeScript interfaces to define expected data structures

---

{{slot:pagination}}
`),
  slots: {
    signatureCode: [
      CodeBlock({
        language: 'typescript',
        code: `
          Data(key: string): ReferenceExpr
        `,
      }),
    ],
    loadingCode: [
      CodeBlock({
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
            onAccess: [
              accessTransition({
                effects: [MyEffects.loadUserProfile()],
              }),
            ],
            blocks: [/* ... */],
          })
        `,
      }),
    ],
    warning: [
      GovUKWarningText({
        html: `<strong>Data must be loaded before use.</strong> If you reference <code>Data('user')</code>
          without loading it in onAccess, the value will be <code>undefined</code>.`,
      }),
    ],
    basicCode: [
      CodeBlock({
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
          Data('config.features.darkMode')
        `,
      }),
    ],
    scenario1Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Effect loads user data
          context.setData('existingApplication', await api.getApplication(id))

          // Field uses it as default
          GovUKTextInput({
            code: 'businessName',
            label: 'Business name',
            defaultValue: Data('existingApplication.businessName'),
          })
        `,
      }),
    ],
    scenario2Code: [
      CodeBlock({
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
          GovUKRadioInput({
            code: 'country',
            fieldset: { legend: { text: 'Country' } },
            items: Data('countries'),
          })
        `,
      }),
    ],
    scenario3Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          HtmlBlock({
            content: Format(
              '<h2 class="govuk-heading-m">Application: %1</h2><p class="govuk-body">Status: %2</p>',
              Data('application.reference'),
              Data('application.status')
            ),
          })
        `,
      }),
    ],
    scenario4Code: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Show premium features only for premium users
          HtmlBlock({
            hidden: Data('user.tier').not.match(Condition.Equals('premium')),
            content: '<p class="govuk-body">Premium feature content here...</p>',
          })

          // Show different step based on user permissions
          GovUKRadioInput({
            code: 'action',
            hidden: Data('permissions.canApprove').not.match(Condition.Equals(true)),
            // ...
          })
        `,
      }),
    ],
    structurePatterns: [
      GovUKDetails({
        summaryText: 'View recommended data structure',
        content: [
          CodeBlock({
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
              })
            `,
          }),
        ],
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/form-engine-developer-guide/references/answer',
          labelText: 'Answer Reference',
        },
        next: {
          href: '/form-engine-developer-guide/references/self',
          labelText: 'Self Reference',
        },
      }),
    ],
  },
})
