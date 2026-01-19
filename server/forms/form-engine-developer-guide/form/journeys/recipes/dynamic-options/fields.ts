import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../helpers/markdown'
import { CodeBlock } from '../../../../components'

/**
 * Recipe: Dynamic Dropdown Options
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
# Recipe: Dynamic Dropdown Options

Populate dropdown or radio options from loaded data,
or filter options based on another field's value. {.lead}

---

## The Pattern

Load options via an effect, then reference them with \`Data()\`:

### Step 1: Load the options in an effect

{{slot:effectExample}}

### Step 2: Reference the data in your field

{{slot:fieldExample}}

---

## How It Works

1. Effect runs on access via \`accessTransition\`
2. \`context.setData('key', options)\` stores the options
3. \`items: Data('key')\` binds the field to that data
4. Options can be an array of \`{ value, text }\` objects
5. To filter, chain \`.each(Iterator.Filter(predicate))\` on the data reference

---

## Common Variations

### Filter options based on another field

{{slot:filterExample}}

### Cascading dropdowns (country → city)

{{slot:cascadeExample}}

### Options from API response

{{slot:apiExample}}

---

## Related Concepts

- [Effects](/forms/form-engine-developer-guide/effects/intro) - Loading data with effects
- [References](/forms/form-engine-developer-guide/references/data) - Using Data() references
- [Iterators](/forms/form-engine-developer-guide/iterators/intro) - Filtering and transforming arrays

---

{{slot:pagination}}
`),
  slots: {
    effectExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects.ts
          loadCountryOptions: _deps => (context: EffectFunctionContext) => {
            context.setData('countries', [
              { value: 'UK', text: 'United Kingdom' },
              { value: 'US', text: 'United States' },
              { value: 'CA', text: 'Canada' },
              { value: 'AU', text: 'Australia' },
            ])
          }

          // step.ts - attach to accessTransition
          onAccess: [
            accessTransition({
              effects: [MyFormEffects.loadCountryOptions()],
            }),
          ]
        `,
      }),
    ],
    fieldExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Data } from '@form-engine/form/builders'
          import { GovUKRadioInput } from '@form-engine-govuk-components/components'

          export const country = GovUKRadioInput({
            code: 'country',
            fieldset: {
              legend: { text: 'Which country do you live in?' },
            },
            items: Data('countries'),
          })
        `,
      }),
    ],
    filterExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          import { Data, Iterator, Item, Answer } from '@form-engine/form/builders'
          import { Condition } from '@form-engine/registry/conditions'

          // Effect loads all options with a 'region' property
          // context.setData('cities', [
          //   { value: 'london', text: 'London', region: 'UK' },
          //   { value: 'manchester', text: 'Manchester', region: 'UK' },
          //   { value: 'new-york', text: 'New York', region: 'US' },
          //   { value: 'los-angeles', text: 'Los Angeles', region: 'US' },
          // ])

          // Field filters based on selected country
          // Uses .each(Iterator.Filter(...)) chained on the data reference
          export const city = GovUKRadioInput({
            code: 'city',
            fieldset: {
              legend: { text: 'Which city?' },
            },
            items: Data('cities').each(
              Iterator.Filter(
                Item().path('region').match(Condition.Equals(Answer('country')))
              )
            ),
          })
        `,
      }),
    ],
    cascadeExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // Effect loads nested data structure
          loadRegionData: _deps => (context: EffectFunctionContext) => {
            context.setData('regions', {
              UK: [
                { value: 'london', text: 'London' },
                { value: 'manchester', text: 'Manchester' },
              ],
              US: [
                { value: 'new-york', text: 'New York' },
                { value: 'los-angeles', text: 'Los Angeles' },
              ],
            })
          }

          // Field accesses nested path based on country selection
          export const city = GovUKRadioInput({
            code: 'city',
            fieldset: {
              legend: { text: 'Which city?' },
            },
            // Access regions[country] dynamically
            items: Data('regions').path(Answer('country')),
            // Hide until country is selected
            hidden: Answer('country').not.match(Condition.IsRequired()),
          })
        `,
      }),
    ],
    apiExample: [
      CodeBlock({
        language: 'typescript',
        code: `
          // effects.ts - store raw API response
          loadAccommodationTypes: deps => async (context: EffectFunctionContext) => {
            const types = await deps.api.getAccommodationTypes()
            // Store raw response - transform in form config
            context.setData('accommodationTypes', types)
          }

          // fields.ts - transform shape with Iterator.Map
          import { Data, Iterator, Item } from '@form-engine/form/builders'

          export const accommodationType = GovUKRadioInput({
            code: 'accommodationType',
            fieldset: {
              legend: { text: 'What type of accommodation?' },
            },
            // Transform API shape { code, description } to { value, text }
            items: Data('accommodationTypes').each(
              Iterator.Map({
                value: Item().path('code'),
                text: Item().path('description'),
              })
            ),
          })
        `,
      }),
    ],
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/recipes/save-answers',
          labelText: 'Save Answers on Submit',
        },
        next: {
          href: '/forms/form-engine-developer-guide/recipes/branching-navigation',
          labelText: 'Branching Navigation',
        },
      }),
    ],
  },
})
