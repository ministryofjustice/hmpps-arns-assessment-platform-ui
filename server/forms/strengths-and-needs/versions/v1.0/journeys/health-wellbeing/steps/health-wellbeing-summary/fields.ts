import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { healthWellbeingSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const healthWellbeingSummary = GovUKSummaryList({
  rows: [
    healthWellbeingSection.fields.healthConditions.displayModes.summaryRow,
    healthWellbeingSection.fields.mentalHealthProblems.displayModes.summaryRow,
    healthWellbeingSection.fields.prescribedPhysicalHealthMedicationsTreatments.displayModes.summaryRow,
    healthWellbeingSection.fields.prescribedMentalHealthMedicationsTreatments.displayModes.summaryRow,
    healthWellbeingSection.fields.psychiatricTreatment.displayModes.summaryRow,
    healthWellbeingSection.fields.headInjuries.displayModes.summaryRow,
    healthWellbeingSection.fields.neurodiverseConditions.displayModes.summaryRow,
    healthWellbeingSection.fields.impactOnLearningAbilities.displayModes.summaryRow,
    healthWellbeingSection.fields.copeWithDayToDayLife.displayModes.summaryRow,
    healthWellbeingSection.fields.attitudeTowardsSelf.displayModes.summaryRow,
    healthWellbeingSection.fields.selfHarm.displayModes.summaryRow,
    healthWellbeingSection.fields.suicidalTendencies.displayModes.summaryRow,
    healthWellbeingSection.fields.feelingsAboutFuture.displayModes.summaryRow,
    healthWellbeingSection.fields.helpedDuringPeriodsGoodHealthWellbeing.displayModes.summaryRow,
    healthWellbeingSection.fields.changes.displayModes.summaryRow,
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
          healthWellbeingSection.fields.strengthsOrProtectiveFactors.displayModes.field,
          healthWellbeingSection.fields.riskOfSeriousHarm.displayModes.field,
          healthWellbeingSection.fields.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
