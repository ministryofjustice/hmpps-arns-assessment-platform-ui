/**
 * Decode common HTML entities back to their original characters.
 * Used to fix double-encoding issues when data passes through multiple encoding layers.
 */
export function decodeHtmlEntities(text: string | undefined): string {
  if (!text) {
    return ''
  }

  return text
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
}

/**
 * Escape HTML special characters to prevent XSS and ensure proper display.
 * Used when inserting user content into HTML templates.
 */
export function escapeHtml(text: string | undefined): string {
  if (!text) {
    return ''
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
