import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { commonContentFor } from '../../../../locales'
import { employmentEducationSection } from '../../section'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { questions, summary } from '../employment-education-summary/fields'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    employmentEducationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    employmentEducationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    employmentEducationSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.employment_education_analysis.path)]

export const employmentStatusAnalysisSummaryTab = HtmlBlock({
  content: [
    MOJBanner({
      bannerType: 'information',
      text: 'This section has not been started',
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
          panel: { blocks: [practitionerAnalysisSummary] },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
