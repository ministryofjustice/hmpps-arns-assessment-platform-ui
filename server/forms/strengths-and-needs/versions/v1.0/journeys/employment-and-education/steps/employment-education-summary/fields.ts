import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { employmentEducationSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { Step } from '../../constants/step'
import { commonContentFor } from '../../../../locales'

export const employmentStatusSummary = GovUKSummaryList({
  rows: [
    employmentEducationSection.fields.currentEmploymentStatus.displayModes.summaryRow,
    employmentEducationSection.fields.employmentSector.displayModes.summaryRow,
    employmentEducationSection.fields.employmentHistory.displayModes.summaryRow,
    employmentEducationSection.fields.dayToDayCommitments.displayModes.summaryRow,
    employmentEducationSection.fields.academicQualification.displayModes.summaryRow,
    employmentEducationSection.fields.professionalQualification.displayModes.summaryRow,
    employmentEducationSection.fields.jobSkills.displayModes.summaryRow,
    employmentEducationSection.fields.difficultiesReadingWritingNumeracy.displayModes.summaryRow,
    employmentEducationSection.fields.employmentExperience.displayModes.summaryRow,
    employmentEducationSection.fields.educationExperience.displayModes.summaryRow,
    employmentEducationSection.fields.changes.displayModes.summaryRow,
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
          employmentEducationSection.fields.strengthsOrProtectiveFactors.displayModes.field,
          employmentEducationSection.fields.riskOfSeriousHarm.displayModes.field,
          employmentEducationSection.fields.riskOfReoffending.displayModes.field,
          markAsCompleteButton,
        ],
      },
    },
  ],
})
