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
import { modalComponent } from './components/modal/modalComponent'

const { createRoute } = SANGenerators

// Where to send the user after accepting privacy, so they resume where they left off in the
// accommodation section. Uses the loaded assessment's UUID: the session identifier only has one for
// OASys access (MPoP access identifies the assessment by CRN).
const privacyScreenRedirectPath = createRoute(
  [basePath, 'edit', Data('assessmentUuid'), Section.accommodation.sideNavHref],
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
        StrengthsAndNeedsEffects.validateModeAndVersionUuidFromUrl(),
        StrengthsAndNeedsEffects.loadAssessment(),
        StrengthsAndNeedsEffects.extractModeAndVersionUuidFromHandoverContext(),
      ],
    }),
  ],
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
