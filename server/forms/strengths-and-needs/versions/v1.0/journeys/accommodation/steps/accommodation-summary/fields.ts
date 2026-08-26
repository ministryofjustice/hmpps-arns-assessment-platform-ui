import { GovUKSummaryList, GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { accommodationSection } from '../../section'
import { goToPractitionerAnalysisButton, markAsCompleteButton } from '../../../../constants/buttons'
import { commonContentFor } from '../../../../locales'
import { questionsOf } from '../../../../steps/view-all-answers/sections'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { Section } from '../../../../constants/section'
import { Step } from '../../constants/step'

export const questions = questionsOf({ section: Section.accommodation, config: accommodationSection })

export const summary = GovUKSummaryList({
  rows: [
    accommodationSection.questions.currentAccommodation.displayModes.summaryRow,
    accommodationSection.questions.livingWith.displayModes.summaryRow,
    accommodationSection.questions.suitableHousingLocation.displayModes.summaryRow,
    accommodationSection.questions.suitableHousing.displayModes.summaryRow,
    accommodationSection.questions.noAccommodationReason.displayModes.summaryRow,
    accommodationSection.questions.pastAccommodationDetails.displayModes.summaryRow,
    accommodationSection.questions.suitableHousingPlanned.displayModes.summaryRow,
    accommodationSection.questions.changes.displayModes.summaryRow,
  ],
})

export const summaryPanel = [summary, goToPractitionerAnalysisButton(Step.accommodation_summary.path)]

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
          panel: { blocks: summaryPanel },
        },
        {
          id: 'practitioner-analysis',
          label: commonContentFor('practitioner_analysis'),
          panel: {
            blocks: [
              accommodationSection.practitionerAnalysis.strengthsOrProtectiveFactors.displayModes.field,
              accommodationSection.practitionerAnalysis.riskOfSeriousHarm.displayModes.field,
              accommodationSection.practitionerAnalysis.riskOfReoffending.displayModes.field,
              markAsCompleteButton,
            ],
          },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
