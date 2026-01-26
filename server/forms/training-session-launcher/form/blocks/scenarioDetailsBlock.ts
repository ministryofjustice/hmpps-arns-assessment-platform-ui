import { Item, Iterator } from '@form-engine/form/builders'
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
    givenName: Item().path('givenName'),
    familyName: Item().path('familyName'),
    dateOfBirth: Item().path('dateOfBirth'),
    location: Item().path('location'),
    crn: Item().path('crn'),
    pnc: Item().path('pnc'),
    oasysAssessmentPk: Item().path('oasysAssessmentPk'),
  },
  slots: {
    flags: [
      CollectionBlock({
        collection: Item()
          .path('flags')
          .each(Iterator.Map(GovUKTag({ text: Item().value(), classes: 'govuk-tag--turquoise' }))),
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
