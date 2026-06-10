import {defineGeneratorFunctions, Format} from '@ministryofjustice/hmpps-forge/core/authoring'

import {BlockDefinition, ResolvableString} from "@ministryofjustice/hmpps-forge/core/components";
import {GovUKBody} from "@ministryofjustice/hmpps-forge/govuk-components";

export const { generators: SANGenerators, implementations: myGeneratorImplementations } =
  defineGeneratorFunctions<any, any>({
    getTextFromListDefinition: {
      // Strips out everything but the `value` and `text` from the generators arguments
      prepare: (items: any[], value: string): [any[], string] => {
        const filteredItems = items
          .filter(x => !x.divider)
          .map(x => ({ value: x.value, text: x.text }))

        return [filteredItems, value]
      },

      // Returns the relevant selected item for the given value
      factory: (deps) => (items: any[], value: string): ResolvableString | undefined => {
        const selectedItem = items.find(item => 'value' in item && item.value === value)

        if (!selectedItem || !('text' in selectedItem)) {
          return ''
        }

        return selectedItem.text
      },
    },
  })
