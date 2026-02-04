import crypto from 'crypto'

import type { SpanProcessorFn } from '../types/SpanProcessor'
import type { ObfuscatorConfig } from '../types/ObfuscatorConfig'

function hash(value: string, key: string): string {
  return crypto.createHmac('sha256', key).update(value).digest('hex').slice(0, 16)
}

/**
 * Creates a processor that obfuscates sensitive data in span attributes.
 * Uses HMAC-SHA256 with a key so the same input always produces the same hash.
 *
 * @param config - Obfuscation configuration
 * @returns A SpanProcessorFn that obfuscates matching attributes
 *
 * @example
 * processSpan: [
 *   telemetry.helpers.createSpanObfuscator({
 *     key: process.env.OBFUSCATION_KEY,
 *     rules: [
 *       { attribute: 'http.url', pattern: /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi },
 *       { attribute: 'enduser.id' }, // Hash entire value
 *     ],
 *   }),
 * ]
 */
export function createSpanObfuscator(config: ObfuscatorConfig): SpanProcessorFn {
  return span => {
    for (const rule of config.rules) {
      const value = span.attributes[rule.attribute]

      if (typeof value === 'string') {
        if (rule.pattern) {
          span.attributes[rule.attribute] = value.replace(rule.pattern, match => hash(match, config.key))
        } else {
          span.attributes[rule.attribute] = hash(value, config.key)
        }
      }
    }

    return {}
  }
}
