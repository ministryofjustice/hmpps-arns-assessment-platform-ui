import { validation, Self, Answer, Data, Format, Literal, Iterator, Item, not, and } from '@form-engine/form/builders'
import {
  GovUKRadioInput,
  GovUKCheckboxInput,
  GovUKCharacterCount,
  GovUKDetails,
  GovUKInsetText,
} from '@form-engine-govuk-components/components'
import { CollectionBlock, TemplateWrapper } from '@form-engine/registry/components'
import { Condition } from '@form-engine/registry/conditions'
import { Transformer } from '@form-engine/registry/transformers'
import { CaseData } from '../../../../constants'

// --- Conditions ---

export const anyDrugUsedInLastSix = Data('drugsUsedInLastSix').match(Condition.IsRequired())
export const anyDrugUsedMoreThanSix = Data('drugsUsedMoreThanSix').match(Condition.IsRequired())

// --- Used in the last 6 months ---

const drugValueLower = Item().path('value').pipe(Transformer.String.ToLowerCase())

export const usedInLastSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">Used in the last 6 months</h2>{{slot:content}}',
  slots: {
    content: [
      GovUKDetails({
        summaryText: 'How to record frequency',
        html: `
          <p class="govuk-body"><strong>Daily:</strong> uses every day or most days.</p>
          <p class="govuk-body"><strong>Weekly:</strong> uses once or more a week but not daily (for example, every Friday and Saturday night).</p>
          <p class="govuk-body"><strong>Monthly:</strong> uses once or more a month but not every week.</p>
          <p class="govuk-body govuk-!-margin-bottom-0"><strong>Occasionally:</strong> uses less than once a month.</p>
        `,
      }),
      CollectionBlock({
        collection: Data('drugsUsedInLastSix').each(
          Iterator.Map(
            TemplateWrapper({
              template: '<h2 class="govuk-heading-m">{{heading}}</h2>{{slot:fields}}',
              values: { heading: Item().path('text').pipe(Transformer.String.EscapeHtml()) },
              slots: {
                fields: [
                  GovUKRadioInput({
                    code: Format('how_often_used_%1', drugValueLower),
                    classes: 'govuk-radios--inline',
                    fieldset: {
                      legend: {
                        text: Format('How often is %1 using this drug?', CaseData.Forename),
                      },
                    },
                    items: [
                      { value: 'DAILY', text: 'Daily' },
                      { value: 'WEEKLY', text: 'Weekly' },
                      { value: 'MONTHLY', text: 'Monthly' },
                      { value: 'OCCASIONALLY', text: 'Occasionally' },
                    ],
                    validate: [
                      validation({
                        when: Self().not.match(Condition.IsRequired()),
                        message: "Select how often they're using this drug",
                      }),
                    ],
                  }),
                  GovUKCharacterCount({
                    code: Format('how_often_used_%1_details', drugValueLower),
                    label: 'Give details (optional)',
                    maxLength: 2000,
                  }),
                ],
              },
            }),
          ),
        ),
      }),
    ],
  },
  hidden: not(anyDrugUsedInLastSix),
})

// --- Section divider ---

export const sectionDivider = TemplateWrapper({
  template: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
  hidden: not(and(anyDrugUsedInLastSix, anyDrugUsedMoreThanSix)),
})

// --- Not used in the last 6 months ---

export const usedMoreThanSixMonthsSection = TemplateWrapper({
  template: '<h2 class="govuk-heading-l">Not used in the last 6 months</h2>{{slot:content}}',
  slots: {
    content: [
      GovUKInsetText({
        text: Format(
          '%1 used %2 more than 6 months ago.',
          CaseData.Forename,
          Data('drugsUsedMoreThanSix')
            .each(Iterator.Map(Item().path('text').pipe(Transformer.String.ToLowerCase())))
            .pipe(Transformer.Array.Join(', ')),
        ),
      }),
      GovUKCharacterCount({
        code: 'drug_use_more_than_six_months_details',
        label: {
          text: Format('Give details about %1 use of these drugs', CaseData.ForenamePossessive),
          classes: 'govuk-label--m',
        },
        hint: 'For example, how often they used these drugs, when they stopped using, and if their use was an issue.',
        maxLength: 2000,
        dependent: anyDrugUsedMoreThanSix,
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter details about their use of these drugs',
          }),
        ],
      }),
    ],
  },
  hidden: not(anyDrugUsedMoreThanSix),
})

// --- Injected drugs ---

const anyInjectableSelectedDrugs = Data('injectableSelectedDrugs').match(Condition.IsRequired())

export const injectedDrugsField = GovUKCheckboxInput({
  code: 'injected_drugs',
  multiple: true,
  fieldset: {
    legend: {
      text: Format('Which drugs has %1 injected?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Select all that apply.',
  items: Literal([{ value: 'NONE', text: 'None', behaviour: 'exclusive' as const }, { divider: 'or' }]).pipe(
    Transformer.Array.Concat(Data('injectableSelectedDrugs')),
  ),
  dependent: anyInjectableSelectedDrugs,
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select which drugs they've injected, or select 'None'",
    }),
  ],
})

// --- Receiving treatment ---

export const receivingTreatmentField = GovUKRadioInput({
  code: 'receiving_treatment',
  fieldset: {
    legend: {
      text: Format('Is %1 receiving treatment for their drug use?', CaseData.Forename),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    {
      value: 'YES',
      text: 'Yes',
      block: GovUKCharacterCount({
        code: 'receiving_treatment_yes_details',
        label: 'Give details',
        maxLength: 2000,
        validate: [
          validation({
            when: Self().not.match(Condition.IsRequired()),
            message: 'Enter details about the treatment they are receiving',
          }),
        ],
        dependent: Answer('receiving_treatment').match(Condition.Equals('YES')),
      }),
    },
    {
      value: 'NO',
      text: 'No',
      block: GovUKCharacterCount({
        code: 'receiving_treatment_no_details',
        label: 'Give details (optional)',
        maxLength: 2000,
      }),
    },
  ],
  validate: [
    validation({
      when: Self().not.match(Condition.IsRequired()),
      message: "Select if they're receiving treatment for their drug use",
    }),
  ],
})
