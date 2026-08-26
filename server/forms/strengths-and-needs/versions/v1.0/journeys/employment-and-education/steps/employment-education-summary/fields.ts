import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { Section } from '../../../../constants/section'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Step } from '../../constants/step'
import { employmentEducationSection } from '../../section'

export const questions = questionsOf({
  section: Section.employment_and_education,
  config: employmentEducationSection,
})

export const summary = GovUKSummaryList({
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

export const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.employment_education_summary.path)]

export const summaryTab = HtmlBlock({
  content: [
    MOJBanner({
      bannerType: 'information',
      text: 'This section has not been started',
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
              employmentEducationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
              employmentEducationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
              employmentEducationSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
              markAsCompleteButton,
            ],
          },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
