interface Buildable {
  build(): unknown
}

const isBuildable = (value: unknown): value is Buildable => {
  return value !== null && typeof value === 'object' && 'build' in value && typeof (value as any).build === 'function'
}

/**
 * Convert form configuration from builders into JSON.
 * Recursively processes objects and arrays, calling build() on any Buildable instances.
 *
 * Uses a WeakMap cache so that shared builder instances (e.g. a Data() reference stored
 * as a module-level constant) are built once and the result is reused, rather than
 * returning the raw builder on subsequent encounters.
 *
 * @param input - Objects, arrays that contain builders
 */
export const finaliseBuilders = <T>(input: T, cache: WeakMap<object, unknown> = new WeakMap()): unknown => {
  if (input === null || typeof input !== 'object') {
    return input
  }

  // Return cached result for previously seen objects (handles circular references
  // and shared builder instances)
  if (cache.has(input)) {
    return cache.get(input)
  }

  if (Array.isArray(input)) {
    const result = input.map(item => finaliseBuilders(item, cache))
    cache.set(input, result)
    return result
  }

  if (isBuildable(input)) {
    // Recursively finalise in case build() returns more builders
    const result = finaliseBuilders(input.build(), cache)
    cache.set(input, result)
    return result
  }

  const result: Record<string, unknown> = {}
  cache.set(input, result)

  Object.entries(input).forEach(([key, value]) => {
    result[key] = finaliseBuilders(value, cache)
  })

  return result
}
