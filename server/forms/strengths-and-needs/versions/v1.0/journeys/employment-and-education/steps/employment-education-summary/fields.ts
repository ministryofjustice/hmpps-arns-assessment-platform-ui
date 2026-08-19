import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { employmentEducationSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const employmentStatusSummary = GovUKSummaryList({
  rows: [
    employmentEducationSection.questions.currentEmploymentStatus.displayModes.summaryRow,
    employmentEducationSection.questions.employmentSector.displayModes.summaryRow,
    employmentEducationSection.questions.employmentHistory.displayModes.summaryRow,
    employmentEducationSection.questions.dayToDayCommitments.displayModes.summaryRow,
    employmentEducationSection.questions.academicQualification.displayModes.summaryRow,
    employmentEducationSection.questions.professionalQualification.displayModes.summaryRow,
    employmentEducationSection.questions.jobSkills.displayModes.summaryRow,
    employmentEducationSection.questions.difficultiesReadingWritingNumeracy.displayModes.summaryRow,
    employmentEducationSection.questions.employmentExperience.displayModes.summaryRow,
    employmentEducationSection.questions.educationExperience.displayModes.summaryRow,
    employmentEducationSection.questions.changes.displayModes.summaryRow,
  ],
})

export const employmentStatusSummaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: commonContentFor('summary'),
      panel: {
        blocks: [employmentStatusSummary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)],
      },
    },
    {
      id: 'practitioner-analysis',
      label: commonContentFor('practitioner_analysis'),
      panel: {
        blocks: [
          employmentEducationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
          employmentEducationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
          employmentEducationSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
