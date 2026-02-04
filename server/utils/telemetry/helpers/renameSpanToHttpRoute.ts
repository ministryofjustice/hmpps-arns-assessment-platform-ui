import type { SpanProcessorFn } from '../types/SpanProcessor'
import { getStringAttribute } from './getStringAttribute'

/**
 * Processor that renames HTTP spans to use the route pattern.
 * Changes "GET" to "GET /users/:id" for better operation names.
 *
 * @example
 * processSpan: [
 *   telemetry.helpers.renameSpanToHttpRoute,
 * ]
 */
export const renameSpanToHttpRoute: SpanProcessorFn = span => {
  const method = getStringAttribute(span, 'http.request.method', 'http.method')
  const route = getStringAttribute(span, 'http.route')

  if (method && route) {
    return { name: `${method} ${route}` }
  }

  return {}
}
