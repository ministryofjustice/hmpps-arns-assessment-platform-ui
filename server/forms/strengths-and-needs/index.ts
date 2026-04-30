import { access, createForgePackage, journey, redirect, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { strengthsAndNeedsV1Journey } from './versions/v1.0'
import { StrengthsAndNeedsEffectImplementations } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import config from '../../config'

export const latestVersion = 'v1.0'

const versionRedirectStep = step({
  path: '/',
  title: 'Strengths and needs',
  onAccess: [
    access({
      next: [
        redirect({
          goto: `/strengths-and-needs/${latestVersion}/accommodation/current-accommodation`,
        }),
      ],
    }),
  ],
})

const strengthsAndNeedsRootJourney = journey({
  code: 'strengths-and-needs',
  title: 'Strengths and needs',
  path: '/strengths-and-needs',
  steps: [versionRedirectStep],
  children: [strengthsAndNeedsV1Journey],
})

/**
 * Root Strengths and Needs Form Package
 */
export default createForgePackage<StrengthsAndNeedsEffectsDeps>({
  enabled: config.forms.strengthsAndNeeds.enabled,
  journey: strengthsAndNeedsRootJourney,
  functions: StrengthsAndNeedsEffectImplementations,
})
