import { createFormPackage, journey } from '@form-engine/form/builders'
import { sentencePlanV1Journey } from './versions/v1.0'
import { SentencePlanEffectsDeps } from './effects/types'
import { SentencePlanEffectsRegistry } from './effects'
import { SentencePlanTransformersRegistry } from './transformers'
import { sentencePlanComponents } from './components'
import { oasysAccessStep } from './access-steps/oasys-access/step'
import { mpopAccessStep } from './access-steps/mpop-access/step'
import config from '../../config'

/**
 * Root Sentence Plan Journey
 *
 * This is the root journey that provides entry points for authentication
 * and delegates to versioned sub-journeys for actual functionality.
 *
 * Structure:
 * /forms/sentence-plan/
 * ├── /oasys              - Entry point for OASys handover (handles auth)
 * ├── /crn/:crn            - Entry point for MPOP access (handles auth)
 * └── /v1.0/              - Version 1.0 sub-journey
 *     ├── /plan/overview  - Plan overview page
 *     └── ...
 */
const sentencePlanRootJourney = journey({
  code: 'sentence-plan',
  title: 'Sentence Plan',
  path: '/sentence-plan',
  children: [sentencePlanV1Journey],
  steps: [oasysAccessStep, mpopAccessStep],
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
    ...SentencePlanTransformersRegistry,
  }),
})
