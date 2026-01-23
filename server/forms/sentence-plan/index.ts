import { createFormPackage, journey } from '@form-engine/form/builders'
import { sentencePlanV1Journey } from './versions/v1.0'
import { SentencePlanEffectsDeps } from './effects/types'
import { SentencePlanEffectsRegistry } from './effects'
import { sentencePlanComponents } from './components'
import config from '../../config'

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
 *     ├── /plan/overview  - Plan overview page (entry point)
 *     └── ...
 */
const sentencePlanRootJourney = journey({
  code: 'sentence-plan',
  title: 'Sentence Plan',
  path: '/sentence-plan',
  entryPath: 'v1.0/plan/overview',
  children: [sentencePlanV1Journey],
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
