import { access, Data, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { accommodationJourney } from './journeys/accommodation'
import { employmentJourney } from './journeys/employment-and-education'
import { financeJourney } from './journeys/finance'
import { drugUseJourney } from './journeys/drug-use'
import { StrengthsAndNeedsEffects } from '../../effects'
import { Section } from './constants/section'
import { basePath, formVersion } from './constants/formVersion'
import { commonLocale } from './constants/locale'

/**
 * Strengths and Needs v1.0 Journey
 *
 * Contains all section journeys for the SAN assessment.
 * Sets the SAN template and section navigation for all child journeys.
 */
export const strengthsAndNeedsV1Journey = journey({
  code: 'strengths-and-needs-v1',
  title: commonLocale.strengths_and_needs,
  path: `/${formVersion}`,
  view: {
    template: 'strengths-and-needs/views/san-step-index',
    locals: {
      basePath,
      sectionNavItems: Object.values(Section).map(section => ({
        ...section,
        status: Data(section.statusKey),
        text: commonLocale.sectionTitle[section.code],
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
  children: [accommodationJourney, employmentJourney, drugUseJourney, financeJourney],
})
