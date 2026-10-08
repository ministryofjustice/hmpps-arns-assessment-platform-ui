import { step } from '@ministryofjustice/hmpps-forge/core/authoring'

export const privacyPolicyStepPath = '/privacy-policy'

/**
 * Configuration for creating the privacy policy step
 */
export interface PrivacyPolicyStepConfig {
  /**
   * Base URL
   */
  baseUrl: string
}

/**
 * Creates a privacy policy step with the given configuration.
 *
 * This factory allows different form packages to share the same privacy policy while providing their own:
 * - Base URL
 *
 * @example
 * ```typescript
 * const privacyPolicyStep = createPrivacyPolicyStep({
 *   baseUrl: 'https://feedback.url'
 * })
 * ```
 */
export const createPrivacyPolicyStep = (stepConfig: PrivacyPolicyStepConfig) =>
  step({
    path: privacyPolicyStepPath,
    title: 'Privacy policy',
    reachability: { entryWhen: true },
    view: {
      template: 'platform/views/privacy-policy',
      locals: {
        footerBaseUrl: stepConfig.baseUrl,
        hideSessionTimeoutModal: true,
      },
    },
  })
