import { createForgePackage, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { sentencePlanV1Journey } from './versions/v1.0'
import { AuditEvent, SentencePlanEffects, SentencePlanEffectImplementations } from './effects'
import { SentencePlanEffectsDeps } from './effects/types'
import { sentencePlanComponents } from './components'
import { sentencePlanTransformerImplementations } from './transformers'
import { createPrivacyScreen } from '../shared'
import { CaseData } from './versions/v1.0/constants'
import { unsavedInformationDeletedStep } from './steps/unsaved-information-deleted/step'
import { mergedPlanWarningStep } from './steps/merged-plan-warning/step'
import config from '../../config'

/**
 * Privacy screen for Sentence Plan
 *
 * Uses the shared privacy screen factory with Sentence Plan specific configuration.
 */
const privacyScreenStep = createPrivacyScreen({
  loadEffects: [SentencePlanEffects.loadSessionData()],
  submitEffects: [
    SentencePlanEffects.setPrivacyAccepted(),
    SentencePlanEffects.sendAuditEvent(AuditEvent.CONFIRM_PRIVACY_SCREEN),
  ],
  submitRedirectPath: 'v1.0/plan/overview',
  alreadyAcceptedRedirectPath: 'v1.0/plan/overview',
  template: 'sentence-plan/views/sentence-plan-step',
  basePath: '/sentence-plan/v1.0',
  headerServiceNameLink: '/sentence-plan/v1.0/plan/overview',
  personForename: CaseData.Forename,
})

/**
 * Root Sentence Plan Journey
 *
 * Access to this form is managed by the access form which handles
 * OASys handover and CRN-based authentication flows.
 *
 * Entry points:
 * - /access/sentence-plan/oasys     → OASys handover
 * - /access/sentence-plan/crn/:crn  → CRN-based access
 *
 * Both redirect to /sentence-plan/v1.0/plan/overview after
 * setting up session with case details and access configuration.
 *
 * Structure:
 * /sentence-plan/
 * └── /v1.0/              - Version 1.0 sub-journey
 *     ├── /privacy        - Privacy screen
 *     ├── /plan/overview  - Plan overview page (entry point)
 *     └── ...
 */
const sentencePlanRootJourney = journey({
  code: 'sentence-plan',
  title: 'Sentence plan',
  path: '/sentence-plan',
  children: [sentencePlanV1Journey],
  steps: [mergedPlanWarningStep, privacyScreenStep, unsavedInformationDeletedStep],
})

/**
 * Root Sentence Plan Form Package
 */
export default createForgePackage<SentencePlanEffectsDeps>({
  enabled: config.forms.sentencePlan.enabled,
  journey: sentencePlanRootJourney,
  components: sentencePlanComponents,
  functions: {
    ...SentencePlanEffectImplementations,
    ...sentencePlanTransformerImplementations,
  },
})
