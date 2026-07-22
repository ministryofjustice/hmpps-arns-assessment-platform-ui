export const toKebabCase = (value: string): string =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

const optionTag = (value: string | undefined): string => {
  if (value === undefined) return 'unknown'
  return toKebabCase(value) || 'not-selected'
}

export const buildSelectionEventName = (
  controlTag: string | undefined,
  previousValue: string | undefined,
  selectedValue: string | undefined,
): string => {
  if (!controlTag?.trim() || selectedValue === undefined) return ''

  return `${controlTag.trim()}-changed-from-${optionTag(previousValue)}-to-${optionTag(selectedValue)}`
}
