import { access, createForgePackage, journey, redirect, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { strengthsAndNeedsV1Journey } from './versions/v1.0'
import { StrengthsAndNeedsEffectImplementations } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import config from '../../config'
import { StrengthsAndNeedsGeneratorImplementations } from './generators'
import { strengthsAndNeedsTransformerImplementations } from './transformers'
import { strengthsAndNeedsConditionImplementations } from './conditions'
import { Section } from './versions/v1.0/constants/section'
import { commonContentFor } from './versions/v1.0/locales'

const versionRedirectStep = step({
  path: '/',
  title: commonContentFor('strengths_and_needs'),
  onAccess: [
    access({
      next: [
        redirect({
          goto: Section.accommodation.sideNavHref,
        }),
      ],
    }),
  ],
})

export const strengthsAndNeedsRootJourney = journey({
  code: 'strengths-and-needs',
  title: commonContentFor('strengths_and_needs'),
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
  functions: {
    ...StrengthsAndNeedsEffectImplementations,
    ...StrengthsAndNeedsGeneratorImplementations,
    ...strengthsAndNeedsTransformerImplementations,
    ...strengthsAndNeedsConditionImplementations,
  },
})
