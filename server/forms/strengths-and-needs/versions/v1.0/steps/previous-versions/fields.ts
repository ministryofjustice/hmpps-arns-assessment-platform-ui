import { Data, Format, Item, Iterator } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKTable } from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { StrengthsAndNeedsTransformers } from '../../../../transformers'
import { CaseData } from '../../constants/formVersion'
import { contentFor } from './locales'

export const leadingParagraph = GovUKBody({
  text: Format(contentFor('lead_paragraph'), CaseData.ForenamePossessive),
})

export const previousVersionTable = GovUKTable({
  head: [
    { text: contentFor('previous_versions_table_head_date') },
    { text: contentFor('previous_versions_table_head_assessment') },
  ],
  rows: Data('previousVersions').each(
    Iterator.Map([
      GovUKBody({ text: Item().value().pipe(StrengthsAndNeedsTransformers.FormatDate()) }),
      HtmlBlock({
        content: Format(
          `<button class="button-as-link" type="submit" name="select-version" value="%1">View<span class="govuk-visually-hidden"> assessment from %2</span></button>`,
          Item().value(),
          Item().value().pipe(StrengthsAndNeedsTransformers.FormatDate()),
        ),
      }),
    ]),
  ),
})
