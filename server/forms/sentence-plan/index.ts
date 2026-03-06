import { createFormPackage, journey } from '@form-engine/form/builders'
import { sentencePlanV1Journey } from './versions/v1.0'
import { SentencePlanEffectsDeps } from './effects/types'
import { SentencePlanEffectsRegistry } from './effects'
import { sentencePlanComponents } from './components'
import { unsavedInformationDeletedStep } from './steps/unsaved-information-deleted/step'
import config from '../../config'

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
 * READ_WRITE users are sent through the platform privacy screen before
 * entering the form. READ_ONLY users go straight to plan overview.
 *
 * Structure:
 * /sentence-plan/
 * └── /v1.0/              - Version 1.0 sub-journey
 *     ├── /plan/overview  - Plan overview page (entry point)
 *     └── ...
 */
const sentencePlanRootJourney = journey({
  code: 'sentence-plan',
  title: 'Sentence plan',
  path: '/sentence-plan',
  entryPath: '/v1.0/plan/overview',
  children: [sentencePlanV1Journey],
  steps: [unsavedInformationDeletedStep],
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
