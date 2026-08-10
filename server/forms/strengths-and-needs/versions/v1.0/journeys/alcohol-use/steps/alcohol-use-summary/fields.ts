import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { alcoholUseSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const alcoholSummary = GovUKSummaryList({
  rows: [
    alcoholUseSection.fields.alcoholUse.displayModes.summaryRow,
    alcoholUseSection.fields.frequency.displayModes.summaryRow,
    alcoholUseSection.fields.units.displayModes.summaryRow,
    alcoholUseSection.fields.bingeDrinking.displayModes.summaryRow,
    alcoholUseSection.fields.evidenceOfExcessDrinking.displayModes.summaryRow,
    alcoholUseSection.fields.pastIssues.displayModes.summaryRow,
    alcoholUseSection.fields.reasonsForUse.displayModes.summaryRow,
    alcoholUseSection.fields.impactOfUse.displayModes.summaryRow,
    alcoholUseSection.fields.stoppedOrReduced.displayModes.summaryRow,
    alcoholUseSection.fields.changes.displayModes.summaryRow,
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
          alcoholUseSection.fields.strengthsOrProtectiveFactors.displayModes.field,
          alcoholUseSection.fields.riskOfSeriousHarm.displayModes.field,
          alcoholUseSection.fields.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
