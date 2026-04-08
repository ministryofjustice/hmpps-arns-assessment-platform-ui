import { Item, Iterator } from '@form-engine/form/builders'
import { Transformer } from '@form-engine/registry/transformers'
import { CollectionBlock, HtmlBlock, TemplateWrapper } from '@form-engine/registry/components'
import { GovUKTag } from '@form-engine-govuk-components/components'
import { CriminogenicNeedsList } from '../../components'

export const scenarioDetailsBlock = TemplateWrapper({
  template: `
    <div class="scenario-picker__details-grid">
      <section class="scenario-picker__section">
        <h3 class="govuk-heading-s">Person</h3>
        <dl class="scenario-picker__inline-summary">
          <div class="scenario-picker__inline-summary-item">
            <dt>Name</dt>
            <dd>{{givenName}} {{familyName}}</dd>
          </div>
        </dl>
        <dl class="scenario-picker__inline-summary">
          <div class="scenario-picker__inline-summary-item">
            <dt>Date of birth</dt>
            <dd>{{dateOfBirth}}</dd>
          </div>
        </dl>
        <dl class="scenario-picker__inline-summary">
          <div class="scenario-picker__inline-summary-item">
            <dt>Location</dt>
            <dd>{{location}}</dd>
          </div>
        </dl>
        <dl class="scenario-picker__inline-summary">
          <div class="scenario-picker__inline-summary-item">
            <dt>CRN</dt>
            <dd>{{crn}}</dd>
          </div>
          <div class="scenario-picker__inline-summary-item">
            <dt>PNC</dt>
            <dd>{{pnc}}</dd>
          </div>
          <div class="scenario-picker__inline-summary-item">
            <dt>OASys</dt>
            <dd>{{oasysAssessmentPk}}</dd>
          </div>
          <div class="scenario-picker__inline-summary-item">
            <dt>Sentence Plan Version</dt>
            <dd>{{sentencePlanVersion}}</dd>
          </div>
        </dl>

        <h3 class="govuk-heading-s">Flags</h3>
        {{slot:flags}}
      </section>
      <section class="scenario-picker__section">
        <h3 class="govuk-heading-s">Criminogenic Needs</h3>
        {{slot:needs}}
      </section>
    </div>
  `,
  values: {
    givenName: Item().path('givenName').pipe(Transformer.String.EscapeHtml()),
    familyName: Item().path('familyName').pipe(Transformer.String.EscapeHtml()),
    dateOfBirth: Item().path('dateOfBirth').pipe(Transformer.String.EscapeHtml()),
    location: Item().path('location').pipe(Transformer.String.EscapeHtml()),
    crn: Item().path('crn').pipe(Transformer.String.EscapeHtml()),
    pnc: Item().path('pnc').pipe(Transformer.String.EscapeHtml()),
    oasysAssessmentPk: Item().path('oasysAssessmentPk').pipe(Transformer.String.EscapeHtml()),
    sentencePlanVersion: Item().path('sentencePlanVersion').pipe(Transformer.String.EscapeHtml()),
  },
  slots: {
    flags: [
      CollectionBlock({
        collection: Item()
          .path('flags')
          .each(Iterator.Map(GovUKTag({ text: Item().value(), classes: 'govuk-tag--teal' }))),
        fallback: [HtmlBlock({ content: '<p class="govuk-body-s govuk-!-margin-bottom-0">No flags set</p>' })],
      }),
    ],
    needs: [
      CriminogenicNeedsList({
        needs: Item().path('displayNeeds'),
      }),
    ],
  },
})
