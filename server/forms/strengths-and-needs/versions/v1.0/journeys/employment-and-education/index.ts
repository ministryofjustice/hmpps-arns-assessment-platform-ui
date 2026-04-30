import { Data, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { currentEmploymentStep } from './steps/current-employment/step'
import { employedEmploymentStep } from './steps/employed-employment/step'
import { employmentEducationSummaryStep } from './steps/employment-education-summary/step'

/**
 * Employment Journey
 *
 * Flow:
 * current-employment → (branching based on type)
 *   ├── current-employment               → current-employment
 *   ├── employed-employment              → employed-employment
 */
export const employmentJourney = journey({
  code: 'employment-and-education',
  title: 'Employment and education',
  path: '/employment-and-education',
  view: {
    locals: {
      sectionTitle: 'Employment and education',
      sectionStatus: Data('sectionStatus.employment-and-education'),
    },
  },
  steps: [currentEmploymentStep, employedEmploymentStep, employmentEducationSummaryStep],
})
