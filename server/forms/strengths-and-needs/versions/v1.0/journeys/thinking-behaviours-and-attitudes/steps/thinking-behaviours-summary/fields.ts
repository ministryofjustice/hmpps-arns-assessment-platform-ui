import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'

export const questions = questionsOf({
  section: Section.thinking_behaviours_and_attitudes,
  config: thinkingBehavioursAttitudesSection,
})

export const summary = GovUKSummaryList({
  rows: [
    thinkingBehavioursAttitudesSection.questions.consequences.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.stableBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.offendingActivities.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.peerPressure.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.problemSolving.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.peoplesViews.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.manipulativePredatoryBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.temperManagement.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.violenceControllingBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.impulsiveBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.positiveAttitude.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.hostileOrientation.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.supervision.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.criminalBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.changes.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.riskSexualHarm.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.sexualPreoccupation.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.offenceRelatedSexualInterest.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.questions.emotionalIntimacy.displayModes.summaryRow,
  ],
})

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.thinkingBehavioursSummary.path)]

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
              thinkingBehavioursAttitudesSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
              thinkingBehavioursAttitudesSection.practitionerAnalysis.linkedToSeriousHarm.displayModes.field,
              thinkingBehavioursAttitudesSection.practitionerAnalysis.linkedToReoffending.displayModes.field,
              markAsCompleteButton,
            ],
          },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
