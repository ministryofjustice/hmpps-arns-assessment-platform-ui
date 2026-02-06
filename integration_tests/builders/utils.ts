/**
 * Generate a unique user ID to avoid conflicts in parallel tests.
 * Uses timestamp + random suffix for uniqueness.
 */
export function generateUserId(prefix: string = 'e2e-test'): string {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0')

  return `${prefix}-${timestamp}-${random}`
}
