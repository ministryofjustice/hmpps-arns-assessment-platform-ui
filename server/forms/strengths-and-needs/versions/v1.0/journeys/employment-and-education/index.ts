import { and, Condition, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { currentEmploymentStep } from './steps/current-employment/step'
import { employedEmploymentStep } from './steps/employed/step'
import { employmentEducationSummaryStep } from './steps/employment-education-summary/step'
import { employmentEducationAnalysisStep } from './steps/employment-education-analysis/step'
import { Section } from '../../constants/section'
import { sectionPageTitle, sectionStatusTag } from '../../locales'
import { isEditMode, redirectToAnalysisIfReadOnly } from '../../guards'
import { Step } from './constants/step'

/**
 * Employment Journey
 *
 * Flow:
 * employment-status → employment-education-details → employment-education-summary → employment-education-analysis
 */
export const employmentJourney = journey({
  code: Section.employment_and_education.code,
  title: sectionPageTitle(Section.employment_and_education),
  path: Section.employment_and_education.path,
  reachability: { resumeWhen: and(Query('resume').match(Condition.Equals('true')), isEditMode) },
  onAccess: [
    redirectToAnalysisIfReadOnly(Section.employment_and_education.path, Step.employment_education_analysis.path),
  ],
  view: {
    locals: {
      sectionTitle: sectionPageTitle(Section.employment_and_education),
      sectionStatusTag: sectionStatusTag(Section.employment_and_education),
    },
  },
  steps: [
    currentEmploymentStep,
    employedEmploymentStep,
    employmentEducationSummaryStep,
    employmentEducationAnalysisStep,
  ],
})
