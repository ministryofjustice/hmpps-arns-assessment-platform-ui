import {Condition, Data, journey, Query} from '@ministryofjustice/hmpps-forge/core/authoring'
import {healthWellbeingStep} from "./steps/health-wellbeing/step";
import {physicalMentalHealthStep} from "./steps/physical-mental-health/step";
import {healthWellbeingSummaryStep} from "./steps/health-wellbeing-summary/step";
import {healthWellbeingAnalysisStep} from "./steps/health-wellbeing-analysis/step";
import {Section} from "../../constants/section";
import {commonContentFor} from "../../locales";

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
  code: Section.health_and_wellbeing.code,
  title: 'Health and wellbeing',
  path: Section.health_and_wellbeing.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.health_and_wellbeing'),
      sectionStatus: Data(Section.health_and_wellbeing.statusKey),
    },
  },
  steps: [
    healthWellbeingStep,
    physicalMentalHealthStep,
    healthWellbeingSummaryStep,
    healthWellbeingAnalysisStep
  ],
})
