/**
 * Target service configuration for access form.
 *
 * Each service that can be accessed via OASys/CRN flows
 * registers its entry path here.
 */
export interface TargetService {
  /** Display name for the service */
  name: string
  /** Path to redirect to after access setup completes */
  entryPath: string
}

/**
 * Registry of target services accessible via the access form.
 *
 * Add new services here to enable access via:
 * - /access/{service}/oasys (OASys handover flow)
 * - /access/{service}/crn/:crn (Direct CRN access)
 */
export const targetServices: Record<string, TargetService> = {
  'sentence-plan': {
    name: 'Sentence Plan',
    entryPath: '/sentence-plan',
  },
}

/**
 * Get target service configuration by service key.
 * Returns undefined if service is not registered.
 */
export function getTargetService(serviceKey: string): TargetService | undefined {
  return targetServices[serviceKey]
}
