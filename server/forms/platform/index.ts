import { Condition, createForgePackage, journey, Request } from '@ministryofjustice/hmpps-forge/core/authoring'
import { accessibilityStepPath, createAccessibilityStatementStep } from './steps/accessibility/step'
import { cookiesPolicyStepPath, createCookiesPolicyStep } from './steps/cookies-policy/step'
import { createPrivacyPolicyStep, privacyPolicyStepPath } from './steps/privacy-policy/step'
import config from '../../config'

const baseUrl = '/platform'

/**
 * Configuration for creating the cookies policy step
 */
interface PlatformPageConfig {
  /**
   * Base URL
   */
  baseUrl: string

  /**
   * Feedback URL
   */
  feedbackUrl: string
}

/**
 * Creates three steps for use in the footer.
 *
 * This factory allows different form packages to share the same privacy policy while providing their own:
 * - Feedback URL
 *
 * @example
 * ```typescript
 * const platformPages = createPlatformPages({
 *   baseUrl: 'https://feedback.url'
 * })
 * ```
 */
export const createPlatformPages = (stepConfig: PlatformPageConfig) => [
  createAccessibilityStatementStep({ baseUrl: stepConfig.baseUrl, feedbackUrl: stepConfig.feedbackUrl }),
  createCookiesPolicyStep({ baseUrl: stepConfig.baseUrl }),
  createPrivacyPolicyStep({ baseUrl: stepConfig.baseUrl }),
]

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\/]/g, '\\$&')

const createPlatformPageRegex = (...endpoints: string[]) => {
  return `(?:${endpoints.map(s => escapeRegex(s)).join('|')})$`
}

export const notAPlatformPage = Request.Path().not.match(
  Condition.String.MatchesRegex(
    createPlatformPageRegex(accessibilityStepPath, cookiesPolicyStepPath, privacyPolicyStepPath),
  ),
)

const platformPoliciesJourney = journey({
  code: 'platform-policies',
  title: 'Assess and plan',
  path: baseUrl,
  reachability: { disableReachabilityChecks: true },
  steps: createPlatformPages({ baseUrl, feedbackUrl: config.nationalRolloutFeedbackUrl }),
  view: {
    locals: {
      feedbackUrl: config.nationalRolloutFeedbackUrl,
    },
  },
})

export default createForgePackage({
  journey: platformPoliciesJourney,
})
