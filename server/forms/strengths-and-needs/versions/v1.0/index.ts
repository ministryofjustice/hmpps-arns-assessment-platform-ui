import {access, Data, journey} from '@ministryofjustice/hmpps-forge/core/authoring'
import { accommodationJourney } from './journeys/accommodation'
import { employmentJourney } from './journeys/employment-and-education'
import { drugUseJourney } from './journeys/drug-use'
import { formVersion, sectionNavItems } from './constants'
import { StrengthsAndNeedsEffects } from '../../effects'
import {healthWellbeingJourney} from "./journeys/health-wellbeing";

/**
 * Strengths and Needs v1.0 Journey
 *
 * Contains all section journeys for the SAN assessment.
 * Sets the SAN template and section navigation for all child journeys.
 */
export const strengthsAndNeedsV1Journey = journey({
  code: 'strengths-and-needs-v1',
  title: 'Strengths and needs',
  path: '/v1.0',
  view: {
    template: 'strengths-and-needs/views/san-step-index',
    locals: {
      basePath: '/strengths-and-needs/v1.0',
      sectionNavItems: sectionNavItems.map((section) => ({
        ...section,
        status: Data(section.statusKey),
      })),
    },
  },
  data: {
    formVersion,
  },
  onAccess: [
    access({
      effects: [
        StrengthsAndNeedsEffects.initializeSessionFromAccess(),
        StrengthsAndNeedsEffects.loadSessionData(),
        StrengthsAndNeedsEffects.loadAssessment(),
      ],
    }),
  ],
  children: [accommodationJourney, employmentJourney, healthWellbeingJourney, drugUseJourney],
})
