import { HtmlBlock, ResolvableBoolean } from '@ministryofjustice/hmpps-forge/core/components'

export const practitionerAnalysisNotRequired = (visibleWhen: ResolvableBoolean) =>
  HtmlBlock({
    content: `<p class="govuk-body">Practitioner analysis not required</p>`,
    visibleWhen,
  })
