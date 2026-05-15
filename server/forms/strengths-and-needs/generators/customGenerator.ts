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

    getTextsFromListDefinitions: (deps) => (items: any[], values: string[]): Array<BlockDefinition> => {

      const blocks: BlockDefinition[] = []
      console.log('MGEO block: ', items)
      console.log('MGEO value: ', values)

      values.forEach((selection: any) => {
        const selectedItem
          = items.find(item=> 'value' in item && item.value === selection && !item.divider)

        console.log('MGEO item', selectedItem)
        if (!selectedItem || !('text' in selectedItem)) {
          return ''
        }
        console.log('MGEO item text', selectedItem.text)
        blocks.push(GovUKBody({text: selectedItem.text}))
      })

      console.log('MGEO return blocks: ', blocks)
      return blocks
    },
  })
