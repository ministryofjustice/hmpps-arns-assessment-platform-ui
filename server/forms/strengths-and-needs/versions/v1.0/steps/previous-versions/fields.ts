import { Format, Item, Iterator, Session } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKTable } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { StrengthsAndNeedsTransformers } from '../../../../transformers'
import { basePath, CaseData } from '../../constants/formVersion'
import { contentFor } from './locales'
import { Section } from '../../constants/section'
import { SANGenerators } from '../../../../generators'

const { createRoute } = SANGenerators

export const leadingParagraph = GovUKBody({
  text: Format(contentFor('lead_paragraph'), CaseData.ForenamePossessive),
})

export const previousVersionTable = GovUKTable({
  head: [
    { text: contentFor('previous_versions_table_head_date') },
    { text: contentFor('previous_versions_table_head_assessment') },
  ],
  rows: Session('previousVersions').each(
    Iterator.Map([
      GovUKBody({ text: Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()) }),
      HtmlBlock({
        content: Format(
          '<a class="button-as-link" href="%1" target="_blank">View<span class="govuk-visually-hidden"> assessment from %2</span></a>',
          createRoute([basePath, 'view', Item().path('uuid'), Section.accommodation.sideNavHref]),
          Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()),
        ),
      }),
    ]),
  ),
})
