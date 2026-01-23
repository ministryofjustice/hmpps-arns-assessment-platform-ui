/**
 * Decode common HTML entities back to their original characters.
 * Used to fix double-encoding issues when data passes through multiple encoding layers.
 */
export function decodeHtmlEntities(text: string | undefined): string {
  if (!text) {
    return ''
  }

  return text
    .replace(/&amp;/g, '&')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
}
