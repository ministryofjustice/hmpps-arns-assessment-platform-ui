import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { healthWellbeingSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'

export const questions = questionsOf({
  section: Section.health_and_wellbeing,
  config: healthWellbeingSection,
})

export const summary = GovUKSummaryList({
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

const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.health_wellbeing_summary.path)]

export const healthWellbeingSummaryTab = HtmlBlock({
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
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
