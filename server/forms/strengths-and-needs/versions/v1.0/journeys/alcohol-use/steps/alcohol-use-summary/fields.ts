import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { alcoholUseSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const alcoholSummary = GovUKSummaryList({
  rows: [
    alcoholUseSection.questions.alcoholUse.displayModes.summaryRow,
    alcoholUseSection.questions.frequency.displayModes.summaryRow,
    alcoholUseSection.questions.units.displayModes.summaryRow,
    alcoholUseSection.questions.bingeDrinking.displayModes.summaryRow,
    alcoholUseSection.questions.evidenceOfExcessDrinking.displayModes.summaryRow,
    alcoholUseSection.questions.pastIssues.displayModes.summaryRow,
    alcoholUseSection.questions.reasonsForUse.displayModes.summaryRow,
    alcoholUseSection.questions.impactOfUse.displayModes.summaryRow,
    alcoholUseSection.questions.stoppedOrReduced.displayModes.summaryRow,
    alcoholUseSection.questions.changes.displayModes.summaryRow,
  ],
})

export const alcoholSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [alcoholSummary, goToPractitionerAnalysisButton(Step.alcohol_use_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          alcoholUseSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          alcoholUseSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          alcoholUseSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
