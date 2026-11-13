import {
  access,
  createForgePackage,
  Data,
  Format,
  journey,
  redirect,
  step,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { CommonAuditEvent, sanEffects, StrengthsAndNeedsEffects } from './effects'
import { StrengthsAndNeedsEffectsDeps } from './effects/types'
import config from '../../config'
import { sanTransformers } from './transformers'
import { sanConditions } from './conditions'
import { commonContentFor } from './versions/v2.0/locales'
import { createPrivacyScreen } from '../shared'
import { sanGeneratorRegistry } from './generators'
import { modalComponent } from './components/modal/modalComponent'
import { isHistoricVersion } from './versions/v1.0/guards'
import { strengthsAndNeedsV2Journey } from './versions/v2.0'
import { strengthsAndNeedsV1Journey } from './versions/v1.0'
import { CaseData, formRootPath } from './constants/common'

const privacyScreenStep = createPrivacyScreen({
  loadEffects: [],
  submitEffects: [
    StrengthsAndNeedsEffects.setPrivacyAccepted(),
    StrengthsAndNeedsEffects.sendAuditEvent(CommonAuditEvent.CONFIRM_PRIVACY_SCREEN),
  ],
  submitRedirectPath: formRootPath,
  alreadyAcceptedRedirectPath: formRootPath,
  template: 'strengths-and-needs/views/san-step',
  basePath: formRootPath,
  headerServiceNameLink: formRootPath,
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
            `${formRootPath}/%1/%2/%3/%4`,
            Data('assessment.formVersion'),
            Data('entryRoute.mode'),
            Data('assessmentUuid'),
            Data('entryRoute.versionUuid'),
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
    access({
      when: isHistoricVersion,
      effects: [StrengthsAndNeedsEffects.resolveHistoricVersion()],
    }),
    access({
      effects: [StrengthsAndNeedsEffects.loadAssessment()],
    }),
  ],
  steps: [versionRedirectStep, privacyScreenStep],
  children: [strengthsAndNeedsV1Journey, strengthsAndNeedsV2Journey],
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
