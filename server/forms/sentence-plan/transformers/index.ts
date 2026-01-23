import { defineTransformers } from '@form-engine/registry/utils/createRegisterableFunction'
import { decodeHtmlEntities, escapeHtml } from '../../../utils/htmlEntities'

/**
 * Sentence Plan Transformers
 *
 * Custom transformers for sentence plan forms.
 *
 * Usage in forms:
 * ```typescript
 * import { SentencePlanTransformers } from '../transformers'
 *
 * formatters: [SentencePlanTransformers.DecodeHtmlEntities()]
 * ```
 */
export const { transformers: SentencePlanTransformers, registry: SentencePlanTransformersRegistry } =
  defineTransformers({
    /**
     * Decode HTML entities in a string value.
     *
     * Used after form-engine sanitization to prevent double-encoding:
     * 1. Form engine sanitizes user input (e.g., ' → &#39;) for XSS protection
     * 2. This transformer decodes it back to plain text
     * 3. Nunjucks template then escapes once when rendering
     *
     * Without this, the value would be double-encoded (&#39; → &amp;#39;)
     * and display literal entity codes to the user.
     */
    DecodeHtmlEntities: (value: unknown) => {
      if (typeof value !== 'string') {
        return value
      }
      return decodeHtmlEntities(value)
    },

    /**
     * Escape HTML special characters in a string value.
     *
     * Used when inserting user content into Format() templates that build HTML.
     * Since Format() outputs raw text into the template, the value won't be
     * auto-escaped by Nunjucks. This transformer ensures proper escaping.
     *
     * Example:
     * - Data: `&amp;` (user typed literal &amp;)
     * - EscapeHtml: `&amp;amp;`
     * - Browser displays: `&amp;` ✓
     */
    EscapeHtml: (value: unknown) => {
      if (typeof value !== 'string') {
        return value
      }
      return escapeHtml(value)
    },
  })
