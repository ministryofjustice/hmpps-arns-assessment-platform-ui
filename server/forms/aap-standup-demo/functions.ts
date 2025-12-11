import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'

interface LabelOption {
  value: string
  text: string
}

/**
 * Custom transformer functions for the standup demo form
 */
export const { transformers: StandupDemoTransformers, registry: StandupDemoTransformersRegistry } = defineTransformers({
  /**
   * Maps an array of keys to their corresponding labels from an options list
   *
   * @param value - Single value or array of values to map
   * @param options - Array of { value, text } objects to use for lookup
   * @returns Array of label strings
   *
   * @example
   * // MapKeysToLabels(['prs', 'form-router'], squadProgressOptions)
   * // Returns: ["Bunch of PRs for folks to review...", "Form router is now setup..."]
   */
  MapKeysToLabels: (value: unknown, options: LabelOption[]) => {
    if (value === undefined || value === null) {
      return []
    }

    const labelMap = new Map(options.map(opt => [opt.value, opt.text]))
    const values = Array.isArray(value) ? value : [value]

    return values.map(v => labelMap.get(String(v)) ?? String(v))
  },

  /**
   * Formats an array as an HTML bullet list using GovUK styling
   *
   * @param value - Array of items to format
   * @returns HTML unordered list, or 'None selected' if empty
   *
   * @example
   * // ToBulletList(['Item 1', 'Item 2'])
   * // Returns: "<ul class="govuk-list govuk-list--bullet"><li>Item 1</li><li>Item 2</li></ul>"
   */
  ToBulletList: (value: unknown) => {
    if (!Array.isArray(value) || value.length === 0) {
      return 'None selected'
    }

    const items = value.map(v => `<li>${v}</li>`).join('')

    return `<ul class="govuk-list govuk-list--bullet">${items}</ul>`
  },
})
