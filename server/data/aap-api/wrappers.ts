import { Values } from '../../interfaces/aap-api/dataModel'

/**
 * Wraps plain values into the API's Single/Multi format.
 * Arrays become { type: 'Multi', values: [...] }
 * Everything else becomes { type: 'Single', value: ... }
 * Undefined values are omitted.
 */
export const wrapAll = (obj: object): Record<string, Values> => {
  const result: Record<string, Values> = {}

  Object.entries(obj).forEach(([key, value]) => {
    if (value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      result[key] = { type: 'Multi', values: value }
    } else {
      result[key] = { type: 'Single', value }
    }
  })

  return result
}

/**
 * Unwraps the API's Single/Multi format back to plain values.
 */
export const unwrapAll = <T>(obj: Record<string, Values>): T => {
  const result: Record<string, unknown> = {}

  Object.entries(obj).forEach(([key, wrapped]) => {
    if (wrapped.type === 'Multi') {
      result[key] = wrapped.values
    } else {
      result[key] = wrapped.value
    }
  })

  return result as T
}
