import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { commonContentFor } from '../../../../locales'
import { offenceAnalysisSection } from '../../section'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { victimCards } from '../offence-analysis-victim-summary/fields'
import { Section } from '../../../../constants/section'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'

export const questions = questionsOf({
  section: Section.offence_analysis,
  config: offenceAnalysisSection,
})

export const offenceAnalysisSummary = GovUKSummaryList({
  rows: [
    offenceAnalysisSection.questions.indexOffenceDescription.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceElements.displayModes.summaryRow,
    offenceAnalysisSection.questions.whyOffenceHappened.displayModes.summaryRow,
    offenceAnalysisSection.questions.motivations.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceCommitedAgainst.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisWhoWasTheOffenceCommittedAgainst.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisLeader.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceImpactOnVictims.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisAcceptResponsibility.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisEscalation.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisPerpetratorOfDomesticAbuse.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisVictimOfDomesticAbuse.displayModes.summaryRow,
    offenceAnalysisSection.questions.patternsOfOffending.displayModes.summaryRow,
    offenceAnalysisSection.questions.offenceAnalysisRisk.displayModes.summaryRow,
  ],
})

export const offenceAnalysisSummaryTab = HtmlBlock({
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
            blocks: [offenceAnalysisSummary, victimCards],
          },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
