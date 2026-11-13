import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { questions, summary } from '../personal-relationships-community-summary/fields'
import { personalRelationshipsCommunitySection } from '../../section'
import { commonContentFor } from '../../../../locales'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { analysisOf } from '../../../../steps/view-all-answers/sections'
import { Section } from '../../../../constants/section'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    personalRelationshipsCommunitySection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    personalRelationshipsCommunitySection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    personalRelationshipsCommunitySection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.personal_relationships_community_analysis.path)]

export const personalRelationshipsCommunityPractitionerAnalysisSummaryTab = HtmlBlock({
  content: [
    MOJBanner({
      bannerType: 'information',
      text: commonContentFor('section_has_not_been_started'),
      visibleWhen: not(anyAnswered(questions)),
    }),
    GovUKTabs({
      id: 'summaries',
      items: [
        {
          id: 'summary',
          label: commonContentFor('summary'),
          panel: {
            blocks: summaryPanel,
          },
        },
        {
          id: 'practitioner-analysis',
          label: commonContentFor('practitioner_analysis'),
          panel: {
            blocks: [practitionerAnalysisSummary],
          },
          visibleWhen: anyAnswered(
            analysisOf({
              section: Section.personal_relationships_and_community,
              config: personalRelationshipsCommunitySection,
            }),
          ),
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
