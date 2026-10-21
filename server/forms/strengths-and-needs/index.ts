import {
  access,
  createForgePackage,
  Data,
  Format,
  journey,
  redirect,
  Session,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { CommonAuditEvent, sanEffects, StrengthsAndNeedsEffects } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import config from '../../config'
import { sanTransformers } from './transformers'
import { sanConditions } from './conditions'
import { commonContentFor } from './versions/v2.0/locales'
import { createPrivacyScreen } from '../shared'
import { CaseData, formRootPath, basePath } from './versions/v2.0/constants/formVersion'
import { sanGeneratorRegistry, SANGenerators } from './generators'
import { Section } from './versions/v2.0/constants/section'
import { modalComponent } from './components/modal/modalComponent'
import { strengthsAndNeedsV2Journey } from './versions/v2.0'

const { createRoute } = SANGenerators

// Where to send the user after accepting privacy, using the mode/uuid from the
// handover session so they resume where they left off in the accommodation section.
const privacyScreenRedirectPath = createRoute(
  [basePath, 'edit', Session('sessionDetails.assessmentIdentifier.uuid'), Section.accommodation.sideNavHref],
  [{ name: 'resume', value: 'true' }],
)

const privacyScreenStep = createPrivacyScreen({
  loadEffects: [],
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
      next: [
        redirect({
          goto: Format(
            `/strengths-and-needs/%1/%2/%3`,
            Data('assessment.formVersion'),
            Session('mode'),
            Session('uuid'),
          ),
        }),
      ],
    }),
  ],
})

export const strengthsAndNeedsRootJourney = journey({
  code: 'strengths-and-needs',
  title: commonContentFor('strengths_and_needs'),
  path: formRootPath,
  onAccess: [
    access({
      effects: [
        StrengthsAndNeedsEffects.initializeSessionFromAccess(),
        StrengthsAndNeedsEffects.loadSessionData(),
        StrengthsAndNeedsEffects.extractModeAndVersionUuidFromUrl(),
        StrengthsAndNeedsEffects.loadAssessment(),
        StrengthsAndNeedsEffects.extractModeAndVersionUuidFromHandoverContext(),
      ],
    }),
  ],
  steps: [versionRedirectStep, privacyScreenStep],
  children: [strengthsAndNeedsV2Journey],
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
