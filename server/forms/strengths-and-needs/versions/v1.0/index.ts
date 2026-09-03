import {
  access,
  and,
  Condition,
  Data,
  journey,
  Params,
  redirect,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { accommodationJourney } from './journeys/accommodation'
import { employmentJourney } from './journeys/employment-and-education'
import { financeJourney } from './journeys/finance'
import { drugUseJourney } from './journeys/drug-use'
import { alcoholUseJourney } from './journeys/alcohol-use'
import { StrengthsAndNeedsEffects } from '../../effects'
import { Section } from './constants/section'
import { basePath, formVersion } from './constants/formVersion'
import { commonContentFor } from './locales'
import { healthWellbeingJourney } from './journeys/health-wellbeing'
import { personalRelationshipsJourney } from './journeys/personal-relationships-and-community'
import { thinkingBehavioursAndAttitudesJourney } from './journeys/thinking-behaviours-and-attitudes'
import { isEditMode, isOasysAccess } from './guards'
import config from '../../../../config'
import { createPlatformPages, notAPlatformPage } from '../../../platform'
import { viewAllAnswersStep } from './steps/view-all-answers/step'
import { previousVersionsStep } from './steps/previous-versions/step'
import { configStep } from '../configStep'
import { formConfigsByVersion } from '../../constants/formConfigRegistry'
import { StrengthsAndNeedsTransformers } from '../../transformers'
import { SANGenerators } from '../../generators'

const { createRoute } = SANGenerators

const feedbackUrl = config.privateBetaFeedbackUrl

/**
 * Strengths and Needs v1.0 Journey
 *
 * Contains all section journeys for the SAN assessment.
 * Sets the SAN template and section navigation for all child journeys.
 */
export const strengthsAndNeedsV1Journey = journey({
  code: 'strengths-and-needs-v1',
  title: commonContentFor('strengths_and_needs'),
  path: `/${formVersion}/:mode/:uuid`,
  view: {
    template: 'strengths-and-needs/views/san-step',
    locals: {
      basePath,
      assessmentVersionDate: Data('sessionDetails.assessmentVersion').pipe(
        StrengthsAndNeedsTransformers.FormatFullDateTime(),
      ),
      sectionNavItems: Object.values(Section).map(section => ({
        ...section,
        complete: Data(section.statusKey),
        text: commonContentFor(`sectionTitle.${section.code}`),
        // Override sideNavHref for read-only mode to point to analysis step
        sideNavHref: when(Params('mode').match(Condition.Equals('edit')))
          .then(
            createRoute(
              [basePath, Params('mode'), Params('uuid'), section.sideNavHref],
              [{ name: 'resume', value: 'true' }],
            ),
          )
          .else(createRoute([basePath, Params('mode'), Params('uuid'), section.sideNavHref])),
      })),
      viewPreviousVersionsLink: createRoute([basePath, Params('mode'), Params('uuid'), 'previous-versions']),
      viewAllAnswersLink: createRoute([basePath, Params('mode'), Params('uuid'), 'view-all-answers']),
      buttons: {
        showReturnToOasysButton: isOasysAccess,
      },
      feedbackUrl,
      previousVersionDate: Data('previousVersionDate').pipe(StrengthsAndNeedsTransformers.FormatFullDateTime()),
    },
  },
  data: {
    formVersion,
    formConfig: formConfigsByVersion[formVersion],
  },
  onAccess: [
    access({
      effects: [
        StrengthsAndNeedsEffects.initializeSessionFromAccess(),
        StrengthsAndNeedsEffects.loadSessionData(),
        StrengthsAndNeedsEffects.extractModeAndVersionUuidFromUrl(),
        StrengthsAndNeedsEffects.loadAssessment(),
        StrengthsAndNeedsEffects.setRiskOfSexualHarm(),
      ],
    }),
    // Only redirect to privacy screen for non-read-only users who haven't accepted privacy
    access({
      when: and(notAPlatformPage, Data('privacyAccepted').not.match(Condition.Equals(true)), isEditMode),
      next: [redirect({ goto: '/strengths-and-needs/privacy' })],
    }),
  ],
  steps: [
    ...createPlatformPages({ baseUrl: basePath, feedbackUrl }),
    viewAllAnswersStep,
    previousVersionsStep,
    configStep,
  ],
  children: [
    accommodationJourney,
    employmentJourney,
    financeJourney,
    drugUseJourney,
    alcoholUseJourney,
    healthWellbeingJourney,
    personalRelationshipsJourney,
    thinkingBehavioursAndAttitudesJourney,
  ],
})
