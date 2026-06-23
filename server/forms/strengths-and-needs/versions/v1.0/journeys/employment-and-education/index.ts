import { Condition, Data, journey, Query } from '@ministryofjustice/hmpps-forge/core/authoring'
import { currentEmploymentStep } from './steps/current-employment/step'
import { employedEmploymentStep } from './steps/employed-employment/step'
import { employmentEducationSummaryStep } from './steps/employment-education-summary/step'
import { employmentEducationAnalysisStep } from './steps/employment-education-analysis/step'
import { Section } from '../../constants/section'
import { commonContentFor } from '../../locales';

/**
 * Employment Journey
 *
 * Flow:
 * current-employment → (branching based on type)
 *   ├── current-employment               → current-employment
 *   ├── employed-employment              → employed-employment
 *   ├── employment-education-summary     → employment-education-summary
 *   ├── employment-education-analysis    → employment-education-analysis
 */
export const employmentJourney = journey({
  code: Section.employment_and_education.code,
  // title: commonContentFor('sectionTitle.employment_and_education'),
  title: 'PLACEHOLDER',
  path: Section.employment_and_education.path,
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: commonContentFor('sectionTitle.employment-and-education'),
      sectionStatus: Data(Section.employment_and_education.statusKey),
    },
  },
  steps: [
    currentEmploymentStep,
    employedEmploymentStep,
    employmentEducationSummaryStep,
    employmentEducationAnalysisStep,
  ],
})
