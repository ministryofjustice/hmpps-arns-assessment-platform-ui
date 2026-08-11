import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { thinkingBehavioursSummary } from '../thinking-behaviours-summary/fields'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    thinkingBehavioursAttitudesSection.fields.strengthsOrProtectiveFactors.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.linkedToSeriousHarm.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.linkedToReoffending.displayModes.summaryRow,
  ],
})

export const thinkingBehavioursAnalysisSummaryTab = GovUKTabs({
  id: 'thinking-behaviours-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [thinkingBehavioursSummary, goToPractitionerAnalysisButton(Step.thinkingBehavioursAnalysis.path)],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
