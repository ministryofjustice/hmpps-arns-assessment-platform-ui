import { access, and, Condition, Data, journey, redirect, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
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
import { isOasysAccess } from './guards'
import { accommodationSection } from './journeys/accommodation/section'
import { alcoholUseSection } from './journeys/alcohol-use/section'
import { drugUseSection } from './journeys/drug-use/section'
import { employmentEducationSection } from './journeys/employment-and-education/section'
import { financeSection } from './journeys/finance/section'
import { healthWellbeingSection } from './journeys/health-wellbeing/section'
import { personalRelationshipsCommunitySection } from './journeys/personal-relationships-and-community/section'
import { thinkingBehavioursAttitudesSection } from './journeys/thinking-behaviours-and-attitudes/section'
import { StrengthsAndNeedsTransformers } from '../../transformers'
import { FormConfig } from '../../constants/formConfig'

/**
 * Strengths and Needs v1.0 Journey
 *
 * Contains all section journeys for the SAN assessment.
 * Sets the SAN template and section navigation for all child journeys.
 */
export const strengthsAndNeedsV1Journey = journey({
  code: 'strengths-and-needs-v1',
  title: commonContentFor('strengths_and_needs'),
  path: `/${formVersion}`,
  view: {
    template: 'strengths-and-needs/views/san-step',
    locals: {
      basePath,
      sectionNavItems: Object.values(Section).map(section => ({
        ...section,
        complete: Data(section.statusKey),
        text: commonContentFor(`sectionTitle.${section.code}`),
      })),
      buttons: {
        showReturnToOasysButton: isOasysAccess,
      },
    },
  },
  data: {
    formVersion,
    formConfig: new FormConfig(formVersion, [
      accommodationSection,
      alcoholUseSection,
      drugUseSection,
      employmentEducationSection,
      financeSection,
      healthWellbeingSection,
      personalRelationshipsCommunitySection,
      thinkingBehavioursAttitudesSection,
    ]),
  },
  onAccess: [
    access({
      effects: [
        StrengthsAndNeedsEffects.initializeSessionFromAccess(),
        StrengthsAndNeedsEffects.loadSessionData(),
        StrengthsAndNeedsEffects.loadAssessment(),
        StrengthsAndNeedsEffects.setRiskOfSexualHarm(),
      ],
    }),
    access({
      when: and(
        Data('privacyAccepted').not.match(Condition.Equals(true)),
        Data('sessionDetails.accessMode').not.match(Condition.Equals('READ_ONLY')),
      ),
      next: [redirect({ goto: '/strengths-and-needs/privacy' })],
    }),
  ],
  steps: [
    step({
      path: `/config`,
      title: 'Config',
      reachability: { entryWhen: true },
      blocks: [
        HtmlBlock({
          tag: 'pre',
          content: Data('formConfig').pipe(StrengthsAndNeedsTransformers.JsonStringify()),
        }),
      ],
    }),
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
