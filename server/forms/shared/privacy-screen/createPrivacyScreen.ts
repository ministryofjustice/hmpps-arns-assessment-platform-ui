import { step, submitTransition, redirect, Data, accessTransition, when, Query } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { EffectFunctionExpr } from '@form-engine/form/types/expressions.type'
import { ConditionalString } from '@form-engine/form/types/structures.type'
import { createPrivacyContent, privacyCheckbox, buttonGroup } from './fields'

/**
 * Configuration for creating a privacy screen step
 */
export interface PrivacyScreenConfig {
  /**
   * Effects to run on page access (e.g., load session data, load person data)
   * These run before the page renders.
   */
  loadEffects: EffectFunctionExpr[]

  /**
   * Effect to run when form is submitted successfully (e.g., set privacy accepted flag)
   */
  submitEffect: EffectFunctionExpr

  /**
   * Path to redirect to after successful submission
   * Relative to the current journey (e.g., 'v1.0/plan/overview')
   */
  submitRedirectPath: string

  /**
   * Path to redirect to if privacy has already been accepted this session
   * Relative to the current journey (e.g., 'v1.0/plan/overview')
   */
  alreadyAcceptedRedirectPath: string

  /**
   * Nunjucks template to use for rendering
   * (e.g., 'sentence-plan/views/sentence-plan-step')
   */
  template: string

  /**
   * Base path for links in the template
   * (e.g., '/forms/sentence-plan/v1.0')
   */
  basePath: string

  /**
   * Reference to the person's forename in the data context
   * (e.g., Data('caseData.name.forename'))
   */
  forenameRef: ConditionalString
}

/**
 * Creates a privacy screen step with the given configuration.
 *
 * This factory allows different form packages (e.g., sentence-plan, strengths-and-needs)
 * to share the same privacy screen UI while providing their own:
 * - Data loading effects
 * - Redirect paths
 * - Template configuration
 *
 * @example
 * ```typescript
 * const privacyScreenStep = createPrivacyScreen({
 *   loadEffects: [
 *     SentencePlanEffects.loadSessionData(),
 *     SentencePlanEffects.loadPersonByCrn(),
 *   ],
 *   submitEffect: SentencePlanEffects.setPrivacyAccepted(),
 *   submitRedirectPath: 'v1.0/plan/overview',
 *   alreadyAcceptedRedirectPath: 'v1.0/plan/overview',
 *   template: 'sentence-plan/views/sentence-plan-step',
 *   basePath: '/forms/sentence-plan/v1.0',
 *   forenameRef: Data('caseData.name.forename'),
 * })
 * ```
 */
export function createPrivacyScreen(config: PrivacyScreenConfig) {
  const {
    loadEffects,
    submitEffect,
    submitRedirectPath,
    alreadyAcceptedRedirectPath,
    template,
    basePath,
    forenameRef,
  } = config

  const privacyContent = createPrivacyContent(forenameRef)

  return step({
    path: '/privacy',
    title: 'Confirm privacy',
    view: {
      template,
      locals: {
        basePath,
        showNavigation: false,
        mainClasses: 'govuk-main-wrapper--no-padding',
        backlink: Data('session.accessType').match(Condition.Equals('oasys')),
      },
    },
    blocks: [privacyContent, privacyCheckbox, buttonGroup],
    onAccess: [
      accessTransition({
        effects: loadEffects,
        next: [
          // If already accepted privacy this session, skip to the destination
          redirect({
            when: Data('session.privacyAccepted').match(Condition.Equals(true)),
            goto: alreadyAcceptedRedirectPath,
          }),
        ],
      }),
    ],
    onSubmission: [
      submitTransition({
        validate: true,
        onValid: {
          effects: [submitEffect],
          next: [redirect({ goto: submitRedirectPath })],
        },
      }),
    ],
  })
}
