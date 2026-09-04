import { Condition, Format, Item, Iterator, Session, when } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKTable, GovUKTag } from '@ministryofjustice/hmpps-forge/govuk-components'
import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import { StrengthsAndNeedsTransformers } from '../../../../transformers'
import { basePath, CaseData } from '../../constants/formVersion'
import { contentFor } from './locales'
import { Section } from '../../constants/section'
import { SANGenerators } from '../../../../generators'
import { sentencePlanViewHistoricBasePath } from '../../constants/path'

const { createRoute } = SANGenerators

export const leadingParagraph = GovUKBody({
  text: Format(contentFor('lead_paragraph'), CaseData.ForenamePossessive),
})

const versionTableClasses = 'previous-versions-table'
const versionTableCaptionClasses = 'govuk-table__caption--m govuk-!-margin-top-3'

const tableHeadColumns = [
  { text: contentFor('previous_versions_table_head_date') },
  { text: contentFor('previous_versions_table_head_assessment') },
  { text: contentFor('previous_versions_table_head_plan') },
  { text: contentFor('previous_versions_table_head_status') },
]

const dateCell = {
  classes: 'govuk-!-width-one-quarter',
  blocks: [
    GovUKBody({
      text: Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()),
      classes: 'govuk-!-margin-bottom-1',
    }),
    GovUKBody({ text: Item().path('description'), classes: 'govuk-!-margin-bottom-0' }),
  ],
}

const assessmentCell = {
  classes: 'govuk-!-width-one-quarter',
  blocks: [
    when(Item().path('assessmentVersionId').match(Condition.IsRequired()))
      .then(
        GovUKBody({
          text: Format(
            '<a class="button-as-link" href="%1" target="_blank">%2<span class="govuk-visually-hidden"> %3 %4</span></a>',
            createRoute([
              basePath,
              'view-historic',
              Item().path('assessmentVersionId'),
              Section.accommodation.sideNavHref,
            ]),
            contentFor('previous_versions_table_action_view'),
            contentFor('previous_versions_table_action_view_assessment_visually_hidden'),
            Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()),
          ),
        }),
      )
      .else(
        GovUKBody({
          text: contentFor('no_version'),
        }),
      ),
  ],
}

const planCell = {
  classes: 'govuk-!-width-one-quarter',
  blocks: [
    when(Item().path('planVersionId').match(Condition.IsRequired()))
      .then(
        GovUKBody({
          text: Format(
            '<a class="button-as-link" href="%1" target="_blank">%2<span class="govuk-visually-hidden"> %3 %4</span></a>',
            createRoute(
              [sentencePlanViewHistoricBasePath, Item().path('planVersionId')],
              [{ name: 'goalStatusTab', value: 'current' }],
            ),
            contentFor('previous_versions_table_action_view'),
            contentFor('previous_versions_table_action_view_plan_visually_hidden'),
            Item().path('date').pipe(StrengthsAndNeedsTransformers.FormatDate()),
          ),
        }),
      )
      .else(
        GovUKBody({
          text: contentFor('no_version'),
        }),
      ),
  ],
}

const statusCell = {
  classes: 'govuk-!-width-one-quarter',
  blocks: [
    GovUKTag({
      classes: 'previous-version-status',
      text: Item().path('assessmentVersionStatus').pipe(StrengthsAndNeedsTransformers.FormatVersionStatus()),
    }),
  ],
}

const tableRows = [dateCell, assessmentCell, planCell, statusCell]

const createVersionTable = (caption: ResolvableString, sessionKey: 'countersignedVersions' | 'previousVersions') =>
  GovUKTable({
    caption,
    captionClasses: versionTableCaptionClasses,
    classes: versionTableClasses,
    head: tableHeadColumns,
    rows: Session(sessionKey).each(Iterator.Map(tableRows)),
  })

export const countersignedVersionTable = createVersionTable(
  contentFor('countersigned_versions_table_caption'),
  'countersignedVersions',
)

export const previousVersionTable = createVersionTable(
  contentFor('previous_versions_table_caption'),
  'previousVersions',
)

export const backToTopLink = GovUKBody({
  text: Format(
    '<a class="govuk-link govuk-body govuk-!-margin-bottom-6" href="#main-content">%1</a>',
    contentFor('back_to_the_top_link'),
  ),
})
