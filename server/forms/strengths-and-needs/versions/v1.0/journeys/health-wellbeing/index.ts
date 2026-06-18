import {Condition, Data, journey, Query} from '@ministryofjustice/hmpps-forge/core/authoring'
import {healthWellbeingStep} from "./steps/health-wellbeing/step";
import {physicalMentalHealthStep} from "./steps/physical-mental-health/step";
import {healthWellbeingSummaryStep} from "./steps/health-wellbeing-summary/step";
import {healthWellbeingAnalysisStep} from "./steps/health-wellbeing-analysis/step";

/**
 * Health and wellbeing Journey
 *
 * Flow:
 * health-wellbeing → (branching based on type)
 *   ├── health-wellbeing               → current-employment
 *        ├── physical-mental-health         → physical-mental-health
 *            ├── health-wellbeing-summary       → health-wellbeing-summary
 *                ├── health-wellbeing-analysis      → health-wellbeing-analysis
 */
export const healthWellbeingJourney = journey({
  code: 'health-and-wellbeing',
  title: 'Health and wellbeing',
  path: '/health-and-wellbeing',
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: 'Health and wellbeing',
      sectionStatus: Data('health_section_status'),
    },
  },
  steps: [
    healthWellbeingStep,
    physicalMentalHealthStep,
    healthWellbeingSummaryStep,
    healthWellbeingAnalysisStep
  ],
})
