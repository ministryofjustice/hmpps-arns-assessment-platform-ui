import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'

export const getTextFromListDefinition = {
  // Strips out everything but the `value` and `text`/`html` from the generators arguments
  prepare: (items: any[], value: string): [any[], string] => {
    const filteredItems = items
      .filter(x => !x.divider)
      .map(x => {
        const result: { value: string; text?: string; html?: string } = { value: x.value, text: x.text }
        if (x.html) {
          result.html = x.html
        }
        return result
      })

    return [filteredItems, value]
  },

  // Returns the relevant selected item for the given value
  factory:
    (_deps: unknown) =>
    (items: any[], value: string): ResolvableString | undefined => {
      const selectedItem = items.find(item => 'value' in item && item.value === value)

      if (!selectedItem) {
        return ''
      }

      // Prefer `text`, fall back to `html` with tags stripped (safe for GovUKBody)
      return selectedItem.text ?? selectedItem.html?.replace(/<[^>]*>/g, '')
    },
}
