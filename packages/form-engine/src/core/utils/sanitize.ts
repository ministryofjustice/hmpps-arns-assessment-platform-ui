/**
 * Sanitize/escape HTML entities in a string value.
 *
 * IMPORTANT: This function intentionally does NOT encode any characters.
 * XSS protection is handled at render time through multiple layers:
 *
 * ## Security Model - Output Encoding
 *
 * This codebase uses OUTPUT ENCODING (recommended by OWASP) rather than input encoding:
 *
 * | Layer                  | Protection                                      |
 * |------------------------|-------------------------------------------------|
 * | Nunjucks templates     | `autoescape: true` escapes < > & " automatically |
 * | Format() expressions   | FormatHandler escapes interpolated values       |
 * | Custom components      | Manual escapeHtmlAttribute() for attributes     |
 * | GOV.UK components      | Uses `| escape` filter in attributes macro      |
 *
 * ## Why Output Encoding?
 *
 * Input encoding (encoding at storage time) causes problems:
 * - User types "&" → stored as "&amp;" → template escapes → "&amp;amp;" → displays "&amp;" (WRONG)
 * - User types "&amp;" → stored as "&amp;amp;" → loses user intent
 *
 * Output encoding (encoding at render time) preserves user intent:
 * - User types "&" → stored as "&" → template escapes → "&amp;" → displays "&" (CORRECT)
 * - User types "&amp;" → stored as "&amp;" → template escapes → "&amp;amp;" → displays "&amp;" (CORRECT)
 *
 * ## CRITICAL Security Requirements
 *
 * For this approach to be secure:
 *
 * 1. NEVER use `| safe` filter for user-generated content in Nunjucks templates
 * 2. ALWAYS use escapeHtmlAttribute() when building HTML attributes manually
 * 3. Format() templates must be trusted strings, not user input
 * 4. Nunjucks must have `autoescape: true` (configured in nunjucksSetup.ts)
 *
 * ## XSS Attack Prevention Example
 *
 * ```
 * User types: <script>alert('xss')</script>
 * Stored as:  <script>alert('xss')</script>
 * Rendered:   &lt;script&gt;alert('xss')&lt;/script&gt;
 * Displayed:  <script>alert('xss')</script> (as TEXT, not executed)
 * ```
 *
 * @param value - The string value (returned unchanged)
 * @returns The original string value (no modifications)
 */
export function escapeHtmlEntities(value: string): string {
  // No encoding - let template engine handle XSS protection at render time
  return value
}

/**
 * Sanitize a value if it is a string, otherwise return unchanged.
 *
 * Note: Currently this is a pass-through function. XSS protection is
 * delegated to the template engine's auto-escaping at render time.
 *
 * @param value - The value to potentially sanitize
 * @returns The original value (no modifications for strings)
 */
export function sanitizeValue(value: unknown): unknown {
  if (typeof value !== 'string') {
    return value
  }

  return escapeHtmlEntities(value)
}
