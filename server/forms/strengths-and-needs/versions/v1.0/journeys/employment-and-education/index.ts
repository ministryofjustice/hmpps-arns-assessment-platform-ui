import {Condition, Data, journey, Query} from '@ministryofjustice/hmpps-forge/core/authoring'
import {currentEmploymentStep} from './steps/current-employment/step'
import {employedEmploymentStep} from './steps/employed-employment/step'
import {employmentEducationSummaryStep} from './steps/employment-education-summary/step'
import {employmentEducationAnalysisStep} from "./steps/employment-education-analysis/step";

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
  code: 'employment-and-education',
  title: 'Employment and education',
  path: '/employment-and-education',
  reachability: { resumeWhen: Query('resume').match(Condition.Equals('true')) },
  view: {
    locals: {
      sectionTitle: 'Employment and education',
      sectionStatus: Data('employment_section_status'),
    },
  },
  steps: [currentEmploymentStep, employedEmploymentStep, employmentEducationSummaryStep, employmentEducationAnalysisStep],
})
