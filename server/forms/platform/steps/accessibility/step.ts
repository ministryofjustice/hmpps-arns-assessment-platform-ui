import { step } from '@ministryofjustice/hmpps-forge/core/authoring'

export const accessibilityStepPath = '/accessibility'

/**
 * Configuration for creating the accessibility statement step
 */
export interface AccessibilityStatementStepConfig {
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
 * Creates an accessibility statement step with the given configuration.
 *
 * This factory allows different form packages to share the same accessibility statement while providing their own:
 * - Base URL
 *
 * @example
 * ```typescript
 * const accessibilityStatementStep = createAccessibilityStatementStep({
 *   baseUrl: 'https://feedback.url'
 * })
 * ```
 */
export const createAccessibilityStatementStep = (stepConfig: AccessibilityStatementStepConfig) =>
  step({
    path: accessibilityStepPath,
    title: 'Accessibility statement for Assess and plan',
    reachability: { entryWhen: true },
    view: {
      template: 'platform/views/accessibility-statement',
      locals: {
        footerBaseUrl: stepConfig.baseUrl,
        feedbackUrl: stepConfig.feedbackUrl,
        hideSessionTimeoutModal: true,
      },
    },
  })
