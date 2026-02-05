import type { SpanProcessorFn } from '../types/SpanProcessor'
import { getStringAttribute } from './getStringAttribute'

/**
 * Creates a processor that filters out requests to specified paths.
 *
 * @param paths - Paths to filter. Supports exact matches and prefix matches (ending with *)
 * @returns A SpanProcessorFn that drops matching spans
 *
 * @example
 * processSpan: [
 *   telemetry.helpers.filterSpanByPath(['/health', '/ping', '/assets/*']),
 * ]
 */
export function filterSpanByPath(paths: string[]): SpanProcessorFn {
  return span => {
    const url = getStringAttribute(span, 'url.path', 'http.target') ?? ''

    const shouldFilter = paths.some(pattern => {
      if (pattern.endsWith('*')) {
        return url.startsWith(pattern.slice(0, -1))
      }

      return url === pattern
    })

    return shouldFilter ? null : {}
  }
}
