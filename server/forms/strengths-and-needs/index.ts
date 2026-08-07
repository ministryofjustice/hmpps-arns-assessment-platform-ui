import { access, createForgePackage, journey, redirect, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { strengthsAndNeedsV1Journey } from './versions/v1.0'
import { StrengthsAndNeedsEffectImplementations, StrengthsAndNeedsEffects } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import config from '../../config'
import { StrengthsAndNeedsGeneratorImplementations } from './generators'
import { strengthsAndNeedsTransformerImplementations } from './transformers'
import { strengthsAndNeedsConditionImplementations } from './conditions'
import { Section } from './versions/v1.0/constants/section'
import { commonContentFor } from './versions/v1.0/locales'
import { createPrivacyScreen } from '../shared'
import { basePath, CaseData } from './versions/v1.0/constants/formVersion'

const privacyScreenStep = createPrivacyScreen({
  loadEffects: [StrengthsAndNeedsEffects.loadSessionData()],
  submitEffects: [StrengthsAndNeedsEffects.setPrivacyAccepted()],
  submitRedirectPath: Section.accommodation.sideNavHref,
  alreadyAcceptedRedirectPath: Section.accommodation.sideNavHref,
  template: 'strengths-and-needs/views/san-step',
  basePath,
  headerServiceNameLink: Section.accommodation.sideNavHref,
  personForename: CaseData.Forename,
  title: commonContentFor('pageTitle.privacy'),
})

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

const strengthsAndNeedsRootJourney = journey({
  code: 'strengths-and-needs',
  title: commonContentFor('strengths_and_needs'),
  path: '/strengths-and-needs',
  steps: [versionRedirectStep, privacyScreenStep],
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
