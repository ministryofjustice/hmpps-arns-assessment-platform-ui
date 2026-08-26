import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { commonContentFor } from '../../../../locales'
import { offenceAnalysisSection } from '../../section'
import { victimCards } from '../offence-analysis-victim-summary/fields'

// Every question the section can ask, each with its own row — the original
// hand-rolled summary omitted `offenceAnalysisAcceptResponsibility` and
// `offenceAnalysisEscalation` entirely, and its "impact on victims" row
// accidentally showed the victim-of-domestic-abuse *type* answer instead of
// the victim-of-domestic-abuse question itself. Using each question's own
// `summaryRow` fixes both by construction.
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

export const offenceAnalysisSummaryTab = GovUKTabs({
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
})
