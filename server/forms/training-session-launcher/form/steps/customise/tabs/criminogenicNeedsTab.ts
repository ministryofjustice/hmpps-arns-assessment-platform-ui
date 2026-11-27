import { Data } from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKTextInput,
  GovUKRadioInput,
  GovUKDetails,
  GovUKCheckboxInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { RandomizableField } from '../../../../components'
import { needScoreValidation, randomisedState } from '../../../validation/customiseValidation'

/**
 * Configuration for each need area
 */
interface NeedConfig {
  title: string
  prefix: string
  hasScore: boolean
  maxScore?: number
}

/**
 * Creates the field blocks for a single criminogenic need area
 * Each field is wrapped with RandomizableField to allow toggling randomization
 */
function createNeedFields(config: NeedConfig): BlockDefinition[] {
  const { title, prefix, hasScore, maxScore } = config

  const linkedToHarmCode = `${prefix}LinkedToHarm`
  const linkedToReoffendingCode = `${prefix}LinkedToReoffending`
  const strengthsCode = `${prefix}Strengths`
  const thresholdCode = `${prefix}Threshold`
  const scoreCode = `${prefix}OtherWeightedScore`

  const fields: BlockDefinition[] = [
    RandomizableField({
      fieldKey: linkedToHarmCode,
      randomize: randomisedState(linkedToHarmCode),
      field: GovUKRadioInput({
        code: linkedToHarmCode,
        label: 'Linked to harm',
        classes: 'govuk-radios--inline govuk-radios--small',
        defaultValue: Data(`scenario.${linkedToHarmCode}`),
        items: [
          { value: 'YES', text: 'Yes' },
          { value: 'NO', text: 'No' },
        ],
      }),
    }),

    RandomizableField({
      fieldKey: linkedToReoffendingCode,
      randomize: randomisedState(linkedToReoffendingCode),
      field: GovUKRadioInput({
        code: linkedToReoffendingCode,
        label: 'Linked to reoffending',
        classes: 'govuk-radios--inline govuk-radios--small',
        defaultValue: Data(`scenario.${linkedToReoffendingCode}`),
        items: [
          { value: 'YES', text: 'Yes' },
          { value: 'NO', text: 'No' },
        ],
      }),
    }),

    RandomizableField({
      fieldKey: strengthsCode,
      randomize: randomisedState(strengthsCode),
      field: GovUKRadioInput({
        code: strengthsCode,
        label: 'Strengths',
        classes: 'govuk-radios--inline govuk-radios--small',
        defaultValue: Data(`scenario.${strengthsCode}`),
        items: [
          { value: 'YES', text: 'Yes' },
          { value: 'NO', text: 'No' },
        ],
      }),
    }),

    RandomizableField({
      fieldKey: thresholdCode,
      randomize: randomisedState(thresholdCode),
      field: GovUKRadioInput({
        code: thresholdCode,
        label: 'High scoring (threshold)',
        classes: 'govuk-radios--inline govuk-radios--small',
        defaultValue: Data(`scenario.${thresholdCode}`),
        items: [
          { value: 'YES', text: 'Yes' },
          { value: 'NO', text: 'No' },
        ],
      }),
    }),
  ]

  if (hasScore) {
    fields.push(
      RandomizableField({
        fieldKey: scoreCode,
        randomize: randomisedState(scoreCode),
        field: GovUKTextInput({
          code: scoreCode,
          label: 'Score',
          hint: maxScore ? `Enter a number from 0 to ${maxScore}` : undefined,
          inputType: 'number',
          classes: 'govuk-input--width-4',
          defaultValue: Data(`scenario.${scoreCode}`),
          validWhen: maxScore === undefined ? [] : needScoreValidation(scoreCode, title, maxScore),
        }),
      }),
    )
  }

  return fields
}

/**
 * Creates a collapsible details section for a need area
 */
function createNeedSection(config: NeedConfig): BlockDefinition {
  return GovUKDetails({
    summaryText: config.title,
    content: createNeedFields(config),
  })
}

/**
 * Criminogenic needs tab content
 * Contains 9 need areas with configurable scores and flags
 * Each field is wrapped with RandomizableField to allow toggling randomization
 */
export const criminogenicNeedsTabContent = [
  HtmlBlock({
    content: '<h2 class="govuk-heading-m">Criminogenic needs</h2>',
  }),

  HtmlBlock({
    content: `
      <p class="govuk-body">
        Set the criminogenic need scores and flags for this scenario.
        Open each need area to change its values.
        Select "Random" to get a new value each time a session is started.
      </p>
    `,
  }),

  GovUKCheckboxInput({
    code: 'useMockedCriminogenicNeeds',
    classes: 'govuk-checkboxes--small',
    defaultValue: Data('mockedCriminogenicNeedsSelection'),
    items: [
      {
        value: 'YES',
        text: 'Use mocked criminogenic needs',
        hint: 'The values below are returned in place of the ARNS API for this CRN. Only used with the SAN Private Beta flag, as Sentence Plan only shows criminogenic needs for Private Beta. Untick to use the data held by the real ARNS API in dev and test. When running locally, unticking gives the canned needs Wiremock returns for every CRN.',
      },
    ],
  }),

  // Accommodation (Section 3)
  createNeedSection({
    title: 'Accommodation',
    prefix: 'acc',
    hasScore: true,
    maxScore: 6,
  }),

  // Education/Training/Employability (Section 4)
  createNeedSection({
    title: 'Education, training and employability',
    prefix: 'ete',
    hasScore: true,
    maxScore: 4,
  }),

  // Finance (Section 5)
  createNeedSection({
    title: 'Finance',
    prefix: 'finance',
    hasScore: false,
  }),

  // Drug Use (Section 8)
  createNeedSection({
    title: 'Drug use',
    prefix: 'drug',
    hasScore: true,
    maxScore: 8,
  }),

  // Alcohol Use (Section 9)
  createNeedSection({
    title: 'Alcohol use',
    prefix: 'alcohol',
    hasScore: true,
    maxScore: 4,
  }),

  // Health and Wellbeing (Section 10)
  createNeedSection({
    title: 'Health and wellbeing',
    prefix: 'emo',
    hasScore: false,
  }),

  // Personal Relationships (Section 6)
  createNeedSection({
    title: 'Personal relationships and community',
    prefix: 'rel',
    hasScore: true,
    maxScore: 6,
  }),

  // Thinking/Behaviour/Attitudes (Section 11)
  createNeedSection({
    title: 'Thinking, behaviours and attitudes',
    prefix: 'think',
    hasScore: true,
    maxScore: 10,
  }),

  // Lifestyle and Associates (Section 7)
  createNeedSection({
    title: 'Lifestyle and associates',
    prefix: 'lifestyle',
    hasScore: true,
    maxScore: 6,
  }),
]
