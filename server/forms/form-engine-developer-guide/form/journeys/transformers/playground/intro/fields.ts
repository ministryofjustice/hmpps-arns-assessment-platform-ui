import { TemplateWrapper } from '@form-engine/registry/components'
import { GovUKPagination } from '@form-engine-govuk-components/components'
import { parseGovUKMarkdown } from '../../../../../helpers/markdown'

/**
 * Transformers Playground - Hub
 *
 * Entry point to the interactive transformer examples.
 */
export const pageContent = TemplateWrapper({
  template: parseGovUKMarkdown(`
  # Transformers Playground

  Try out transformers in real time. Each page below has live fields
  where you can see how transformers clean, format, and convert values. {.lead}

  ---

  ## Choose a transformer type

  - [**String Transformers**](/forms/form-engine-developer-guide/transformers/playground/strings)

    Trim whitespace, change case, replace text, and convert types.

  - [**Number Transformers**](/forms/form-engine-developer-guide/transformers/playground/numbers)

    Round, clamp, and perform arithmetic operations.

  - [**Array Transformers**](/forms/form-engine-developer-guide/transformers/playground/arrays)

    Join, slice, filter, and transform array values.

  ---

  {{slot:pagination}}
`),
  slots: {
    pagination: [
      GovUKPagination({
        classes: 'govuk-pagination--inline',
        previous: {
          href: '/forms/form-engine-developer-guide/transformers/custom',
          labelText: 'Custom Transformers',
        },
        next: {
          href: '/forms/form-engine-developer-guide/transformers/playground/strings',
          labelText: 'String Transformers',
        },
      }),
    ],
  },
})
