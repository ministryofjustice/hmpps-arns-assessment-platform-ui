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

const versionTableCaptionClasses = 'govuk-table__caption--m govuk-!-margin-top-3'

export const countersignedVersionTable = GovUKTable({
  caption: contentFor('countersigned_versions_table_caption'),
  captionClasses: versionTableCaptionClasses,
  head: [
    { text: contentFor('previous_versions_table_head_date') },
    { text: contentFor('previous_versions_table_head_assessment') },
  ],
  rows: Session('countersignedVersions').each(
    Iterator.Map([
      HtmlBlock({
        content: [
          GovUKBody({
            text: Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()),
            classes: 'govuk-!-margin-bottom-1',
          }),
          GovUKBody({ text: Item().path('description'), classes: 'govuk-!-margin-bottom-0' }),
        ],
      }),
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

export const previousVersionTable = GovUKTable({
  caption: contentFor('previous_versions_table_caption'),
  captionClasses: versionTableCaptionClasses,
  head: [
    { text: contentFor('previous_versions_table_head_date') },
    { text: contentFor('previous_versions_table_head_assessment') },
  ],
  rows: Session('previousVersions').each(
    Iterator.Map([
      HtmlBlock({
        content: [
          GovUKBody({
            text: Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()),
            classes: 'govuk-!-margin-bottom-1',
          }),
          GovUKBody({ text: Item().path('description'), classes: 'govuk-!-margin-bottom-0' }),
        ],
      }),
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

export const backToTopLink = GovUKBody({
  text: '<a class="govuk-link govuk-body govuk-!-margin-bottom-6" href="#main-content">↑ Back to top</a>',
})
