import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { thinkingBehavioursAttitudesSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const thinkingBehavioursSummary = GovUKSummaryList({
  rows: [
    thinkingBehavioursAttitudesSection.fields.consequences.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.stableBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.offendingActivities.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.peerPressure.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.problemSolving.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.peoplesViews.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.manipulativePredatoryBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.temperManagement.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.violenceControllingBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.impulsiveBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.positiveAttitude.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.hostileOrientation.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.supervision.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.criminalBehaviour.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.changes.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.riskSexualHarm.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.sexualPreoccupation.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.offenceRelatedSexualInterest.displayModes.summaryRow,
    thinkingBehavioursAttitudesSection.fields.emotionalIntimacy.displayModes.summaryRow,
  ],
})

export const summaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [thinkingBehavioursSummary, goToPractitionerAnalysisButton(Step.thinkingBehavioursSummary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          thinkingBehavioursAttitudesSection.fields.strengthsOrProtectiveFactors.displayModes.field,
          thinkingBehavioursAttitudesSection.fields.linkedToSeriousHarm.displayModes.field,
          thinkingBehavioursAttitudesSection.fields.linkedToReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
