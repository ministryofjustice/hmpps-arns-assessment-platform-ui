import { step } from '@ministryofjustice/hmpps-forge/core/authoring'

export const cookiesPolicyStepPath = '/cookies-policy'

/**
 * Configuration for creating the cookies policy step
 */
export interface CookiesPolicyStepConfig {
  /**
   * Base URL
   */
  baseUrl: string
}

/**
 * Creates a cookie policy step with the given configuration.
 *
 * This factory allows different form packages to share the same cookies policy while providing their own:
 * - Base URL
 *
 * @example
 * ```typescript
 * const cookiesPolicyStep = createCookiesPolicyStep({
 *   baseUrl: 'https://feedback.url'
 * })
 * ```
 */
export const createCookiesPolicyStep = (stepConfig: CookiesPolicyStepConfig) =>
  step({
    path: cookiesPolicyStepPath,
    title: 'Cookies policy for Assess and plan',
    reachability: { entryWhen: true },
    view: {
      template: 'platform/views/cookies-policy',
      locals: {
        footerBaseUrl: stepConfig.baseUrl,
        hideSessionTimeoutModal: true,
      },
    },
  })
