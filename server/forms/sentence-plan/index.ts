import { createFormPackage, Data, journey } from '@form-engine/form/builders'
import { sentencePlanV1Journey } from './versions/v1.0'
import { SentencePlanEffectsDeps } from './effects/types'
import { SentencePlanEffects, SentencePlanEffectsRegistry } from './effects'
import { sentencePlanComponents } from './components'
import { createPrivacyScreen } from '../shared'
import config from '../../config'

/**
 * Privacy screen for Sentence Plan
 *
 * Uses the shared privacy screen factory with Sentence Plan specific configuration.
 */
const privacyScreenStep = createPrivacyScreen({
  loadEffects: [SentencePlanEffects.loadSessionData(), SentencePlanEffects.loadPersonByCrn()],
  submitEffect: SentencePlanEffects.setPrivacyAccepted(),
  submitRedirectPath: 'v1.0/plan/overview',
  alreadyAcceptedRedirectPath: 'v1.0/plan/overview',
  template: 'sentence-plan/views/sentence-plan-step',
  basePath: '/forms/sentence-plan/v1.0',
  forenameRef: Data('caseData.name.forename'),
})

/**
 * Root Sentence Plan Journey
 *
 * Access to this form is managed by the access form which handles
 * OASys handover and CRN-based authentication flows.
 *
 * Entry points:
 * - /forms/access/sentence-plan/oasys     → OASys handover
 * - /forms/access/sentence-plan/crn/:crn  → CRN-based access
 *
 * Both redirect to /forms/sentence-plan/v1.0/plan/overview after
 * setting up session with case details and access configuration.
 *
 * Structure:
 * /forms/sentence-plan/
 * └── /v1.0/              - Version 1.0 sub-journey
 *     ├── /privacy        - Privacy screen (shown every OASys session)
 *     ├── /plan/overview  - Plan overview page (entry point)
 *     └── ...
 */
const sentencePlanRootJourney = journey({
  code: 'sentence-plan',
  title: 'Sentence Plan',
  path: '/sentence-plan',
  entryPath: '/v1.0/plan/overview',
  children: [sentencePlanV1Journey],
  steps: [privacyScreenStep],
})

/**
 * Root Sentence Plan Form Package
 */
export default createFormPackage({
  enabled: config.forms.sentencePlan.enabled,
  journey: sentencePlanRootJourney,
  components: sentencePlanComponents,
  createRegistries: (deps: SentencePlanEffectsDeps) => ({
    ...SentencePlanEffectsRegistry(deps),
  }),
})
