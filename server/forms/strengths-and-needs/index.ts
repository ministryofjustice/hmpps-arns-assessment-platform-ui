import {
  access,
  createForgePackage,
  Data,
  journey,
  redirect,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { strengthsAndNeedsV1Journey } from './versions/v1.0'
import { CommonAuditEvent, sanEffects, StrengthsAndNeedsEffects } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import config from '../../config'
import { sanTransformers } from './transformers'
import { sanConditions } from './conditions'
import { commonContentFor } from './versions/v1.0/locales'
import { createPrivacyScreen } from '../shared'
import { basePath, CaseData, formRootPath } from './versions/v1.0/constants/formVersion'
import { sanGeneratorRegistry, SANGenerators } from './generators'
import { Section } from './versions/v1.0/constants/section'
import { baseSanRoute } from './versions/v1.0/constants/path'
import { modalComponent } from './components/modal/modalComponent'

const { createRoute } = SANGenerators

// Where to send the user after accepting privacy, using the mode/uuid from the
// handover session so they resume where they left off in the accommodation section.
const privacyScreenRedirectPath = createRoute(
  [...baseSanRoute, Section.accommodation.sideNavHref],
  [{ name: 'resume', value: 'true' }],
)

const privacyScreenStep = createPrivacyScreen({
  loadEffects: [StrengthsAndNeedsEffects.loadSessionData()],
  submitEffects: [
    StrengthsAndNeedsEffects.setPrivacyAccepted(),
    StrengthsAndNeedsEffects.sendAuditEvent(CommonAuditEvent.CONFIRM_PRIVACY_SCREEN),
  ],
  submitRedirectPath: privacyScreenRedirectPath,
  alreadyAcceptedRedirectPath: privacyScreenRedirectPath,
  template: 'strengths-and-needs/views/san-step',
  basePath,
  headerServiceNameLink: privacyScreenRedirectPath,
  personForename: CaseData.Forename,
  title: commonContentFor('pageTitle.privacy'),
  feedbackUrl: config.privateBetaFeedbackUrl,
})

const versionRedirectStep = step({
  path: '/',
  title: commonContentFor('strengths_and_needs'),
  onAccess: [
    access({
      effects: [StrengthsAndNeedsEffects.generateInitialFormUrl()],
      next: [
        redirect({
          goto: Data('initialFormUrl'),
        }),
      ],
    }),
  ],
})

export const strengthsAndNeedsRootJourney = journey({
  code: 'strengths-and-needs',
  title: commonContentFor('strengths_and_needs'),
  path: formRootPath,
  steps: [versionRedirectStep, privacyScreenStep],
  children: [strengthsAndNeedsV1Journey],
})

/**
 * Root Strengths and Needs Form Package
 */
export default createForgePackage<StrengthsAndNeedsEffectsDeps>({
  enabled: config.forms.strengthsAndNeeds.enabled,
  journey: strengthsAndNeedsRootJourney,
  components: [modalComponent],
  functions: [sanEffects, sanGeneratorRegistry, sanTransformers, sanConditions],
})
