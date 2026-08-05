import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { employmentStatusSummary } from '../employment-education-summary/fields'
import { employmentEducationSection } from '../../section'
import { Step } from '../../constants/step'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    employmentEducationSection.fields.strengthsOrProtectiveFactors.displayModes.summaryRow,
    employmentEducationSection.fields.riskOfSeriousHarm.displayModes.summaryRow,
    employmentEducationSection.fields.riskOfReoffending.displayModes.summaryRow,
  ],
})

export const employmentStatusAnalysisSummaryTab = GovUKTabs({
  id: 'final-employment-education-analysis',
  items: [
    {
      id: 'summary-analysis',
      label: commonContentFor('summary'),
      panel: {
        blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis-summary',
      label: commonContentFor('practitioner_analysis'),
      panel: { blocks: [practitionerAnalysisSummary] },
    },
  ],
})
