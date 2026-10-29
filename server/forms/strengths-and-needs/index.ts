import {
  access,
  and,
  Condition,
  createForgePackage,
  Data,
  Format,
  journey,
  not,
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
import { isHistoricView } from './versions/v1.0/guards'

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
      effects: [StrengthsAndNeedsEffects.resolveEntryRoute()],
      next: [
        redirect({
          goto: Format(
            `${formRootPath}/%1/%2/%3`,
            Data('assessment.formVersion'),
            Data('entryRoute.mode'),
            Data('entryRoute.uuid'),
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
      ],
    }),
    // Previous versions are looked up by the assessment's UUID, which is only known once the entry step
    // has loaded the assessment for this access (e.g. not for a bookmarked view-historic URL)
    access({
      when: and(isHistoricView, not(Session('san.assessmentUuid').match(Condition.IsRequired()))),
      next: [redirect({ goto: `${formRootPath}/` })],
    }),
    access({
      when: isHistoricView,
      effects: [StrengthsAndNeedsEffects.resolveHistoricVersion()],
    }),
    access({
      effects: [StrengthsAndNeedsEffects.loadAssessment()],
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
