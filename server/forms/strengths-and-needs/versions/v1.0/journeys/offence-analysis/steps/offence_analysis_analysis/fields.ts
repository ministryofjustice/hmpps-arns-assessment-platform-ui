import { GovUKTabs } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { MOJBanner } from '@ministryofjustice/hmpps-forge/moj-components'
import { not } from '@ministryofjustice/hmpps-forge/core/authoring'
import { commonContentFor } from '../../../../locales'
import { victimCards } from '../offence-analysis-victim-summary/fields'
import { anyAnswered } from '../../../../steps/view-all-answers/fields'
import { questions, offenceAnalysisSummary } from '../offence_analysis_summary/fields'

export const offenceAnalysisSummaryTab = HtmlBlock({
  content: [
    MOJBanner({
      bannerType: 'information',
      text: commonContentFor('section_has_not_been_started'),
      visibleWhen: not(anyAnswered(questions)),
    }),
    GovUKTabs({
      id: 'summaries',
      items: [
        {
          id: 'summary',
          label: commonContentFor('summary'),
          panel: {
            blocks: [offenceAnalysisSummary, victimCards],
          },
        },
      ],
      visibleWhen: anyAnswered(questions),
    }),
  ],
})
