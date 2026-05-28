import {defineGeneratorFunctions, Format} from '@ministryofjustice/hmpps-forge/core/authoring'

import {BlockDefinition, ResolvableString} from "@ministryofjustice/hmpps-forge/core/components";
import {GovUKBody} from "@ministryofjustice/hmpps-forge/govuk-components";

export const { generators: SANGenerators, implementations: myGeneratorImplementations } =
  defineGeneratorFunctions<any, any>({
    /**
     * Generates the current date and time.
     *
     * @returns Current Date object with full timestamp
     *
     * @example
     * // In form definition
     * minDate: Generator.Date.Now()
     *
     * @example
     * // With pipeline
     * deadline: Generator.Date.Now().pipe(Transformer.Date.AddDays(7))
     */
    getTextFromListDefinition: (deps) => (items: any[], value: string): ResolvableString | undefined => {

      const selectedItem
        = items.find(item=> 'value' in item && item.value === value)

      if (!selectedItem || !('text' in selectedItem)) {
        return ''
      }
      return selectedItem.text
    },
  })
