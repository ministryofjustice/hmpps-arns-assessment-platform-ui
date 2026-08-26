import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { alcoholUseSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'

export const questions = questionsOf({
  section: Section.alcohol_use,
  config: alcoholUseSection,
})

export const summary = GovUKSummaryList({
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

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.alcohol_use_summary.path)]

export const summaryTab = HtmlBlock({
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
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
