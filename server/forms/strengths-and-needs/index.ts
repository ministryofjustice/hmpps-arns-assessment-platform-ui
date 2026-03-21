import { createFormPackage, journey } from '@form-engine/form/builders'
import { strengthsAndNeedsV1Journey } from './versions/v1.0'
import { StrengthsAndNeedsEffectsRegistry } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'

/**
 * Root Strengths and Needs Journey
 *
 * Structure:
 * /strengths-and-needs/
 * └── /v1.0/
 *     └── /accommodation/   - Accommodation section
 *         ├── /current-accommodation
 *         ├── /settled-accommodation
 *         ├── /temporary-accommodation
 *         ├── /temporary-accommodation-cas-ap
 *         ├── /no-accommodation
 *         ├── /accommodation-summary
 *         └── /accommodation-analysis
 */
const strengthsAndNeedsRootJourney = journey({
  code: 'strengths-and-needs',
  title: 'Strengths and needs',
  path: '/strengths-and-needs',
  entryPath: '/v1.0/accommodation/current-accommodation',
  children: [strengthsAndNeedsV1Journey],
})

/**
 * Root Strengths and Needs Form Package
 */
export default createFormPackage({
  enabled: true, // TODO: Add config.forms.strengthsAndNeeds.enabled
  journey: strengthsAndNeedsRootJourney,
  createRegistries: (deps: StrengthsAndNeedsEffectsDeps) => ({
    ...StrengthsAndNeedsEffectsRegistry(deps),
  }),
})
