import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'

import { commonContentFor } from '../../../../locales'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import {
  drugsSummaryPartOne,
  drugsSummaryPartThree,
  drugsSummaryPartTwo,
  moreInformationHeading,
  notUsedInLastSixMonthsSummarySection,
  usedInLastSixMonthsSummarySection,
} from '../drug-use-summary/fields'
import { drugUseSection } from '../../section'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    drugUseSection.fields.motivatedToStop.displayModes.summaryRow,
    drugUseSection.fields.strengthsOrProtectiveFactors.displayModes.summaryRow,
    drugUseSection.fields.riskOfSeriousHarm.displayModes.summaryRow,
    drugUseSection.fields.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const drugsSummaryAnalysisTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [
          drugsSummaryPartOne,
          usedInLastSixMonthsSummarySection,
          notUsedInLastSixMonthsSummarySection,
          drugsSummaryPartTwo,
          moreInformationHeading,
          drugsSummaryPartThree,
          goToPractitionerAnalysisButton(Step.drug_use_analysis.path),
        ],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [practitionerAnalysisSummary],
      },
    },
  ],
})
