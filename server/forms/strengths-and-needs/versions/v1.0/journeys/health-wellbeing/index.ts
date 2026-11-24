import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { healthWellbeingStatusStep } from './steps/health-wellbeing-status/step'
import { healthWellbeingDetailsStep } from './steps/health-wellbeing-details/step'
import { healthWellbeingSummaryStep } from './steps/health-wellbeing-summary/step'
import { healthWellbeingAnalysisStep } from './steps/health-wellbeing-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Health and wellbeing Journey
 *
 * Flow:
 * health-wellbeing-status → health-wellbeing-details → health-wellbeing-summary → health-wellbeing-analysis
 */
export const healthWellbeingJourney = journey({
  code: Section.health_and_wellbeing.code,
  title: sectionPageTitle(Section.health_and_wellbeing),
  path: Section.health_and_wellbeing.path,
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [redirectToAnalysisIfReadOnly(Section.health_and_wellbeing.path, Step.health_wellbeing_analysis.path)],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.health_and_wellbeing),
      sectionStatusTag: sectionStatusTag(Section.health_and_wellbeing),
    },
  },
  steps: [
    healthWellbeingStatusStep,
    healthWellbeingDetailsStep,
    healthWellbeingSummaryStep,
    healthWellbeingAnalysisStep,
  ],
})
