import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { healthWellbeingSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const healthWellbeingSummary = GovUKSummaryList({
  rows: [
    healthWellbeingSection.questions.healthConditions.displayModes.summaryRow,
    healthWellbeingSection.questions.mentalHealthProblems.displayModes.summaryRow,
    healthWellbeingSection.questions.prescribedPhysicalHealthMedicationsTreatments.displayModes.summaryRow,
    healthWellbeingSection.questions.prescribedMentalHealthMedicationsTreatments.displayModes.summaryRow,
    healthWellbeingSection.questions.psychiatricTreatment.displayModes.summaryRow,
    healthWellbeingSection.questions.headInjuries.displayModes.summaryRow,
    healthWellbeingSection.questions.neurodiverseConditions.displayModes.summaryRow,
    healthWellbeingSection.questions.impactOnLearningAbilities.displayModes.summaryRow,
    healthWellbeingSection.questions.copeWithDayToDayLife.displayModes.summaryRow,
    healthWellbeingSection.questions.attitudeTowardsSelf.displayModes.summaryRow,
    healthWellbeingSection.questions.selfHarm.displayModes.summaryRow,
    healthWellbeingSection.questions.suicidalTendencies.displayModes.summaryRow,
    healthWellbeingSection.questions.feelingsAboutFuture.displayModes.summaryRow,
    healthWellbeingSection.questions.helpedDuringPeriodsGoodHealthWellbeing.displayModes.summaryRow,
    healthWellbeingSection.questions.changes.displayModes.summaryRow,
  ],
})

export const healthWellbeingSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [healthWellbeingSummary, goToPractitionerAnalysisButton(Step.health_wellbeing_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          healthWellbeingSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          healthWellbeingSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          healthWellbeingSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
