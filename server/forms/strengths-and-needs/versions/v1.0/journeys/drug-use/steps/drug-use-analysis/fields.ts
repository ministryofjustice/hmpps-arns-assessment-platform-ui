import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { drugUseSection } from '../../section'
import { commonContentFor } from '../../../../locales'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { questions, summary } from '../drug-use-summary/fields'
import { goToPractitionerAnalysisButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'

const practitionerAnalysisSummary = GovUKSummaryList({
  rows: [
    drugUseSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.summaryRow,
    drugUseSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.summaryRow,
    drugUseSection.practitionerAnalysis.riskOfReoffending.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.drug_use_analysis.path)]

export const drugsSummaryAnalysisTab = HtmlBlock({
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
          panel: { blocks: [practitionerAnalysisSummary] },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
