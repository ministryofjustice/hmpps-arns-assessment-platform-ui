import { Data } from '@form-engine/form/builders'
import { BlockDefinition } from '@form-engine/form/types/structures.type'
import { HtmlBlock } from '@form-engine/registry/components'
import { GovUKTextInput, GovUKRadioInput, GovUKDetails } from '@form-engine-govuk-components/components'
import { RandomizableField } from '../../../../components'

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
  const { prefix, hasScore, maxScore } = config

  const linkedToHarmCode = `${prefix}LinkedToHarm`
  const linkedToReoffendingCode = `${prefix}LinkedToReoffending`
  const strengthsCode = `${prefix}Strengths`
  const thresholdCode = `${prefix}Threshold`
  const scoreCode = `${prefix}OtherWeightedScore`

  const fields: BlockDefinition[] = [
    RandomizableField({
      fieldKey: linkedToHarmCode,
      randomize: Data(`${linkedToHarmCode}_isRandomized`),
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
      randomize: Data(`${linkedToReoffendingCode}_isRandomized`),
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
      randomize: Data(`${strengthsCode}_isRandomized`),
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
      randomize: Data(`${thresholdCode}_isRandomized`),
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
        randomize: Data(`${scoreCode}_isRandomized`),
        field: GovUKTextInput({
          code: scoreCode,
          label: 'Score',
          hint: maxScore ? `0 to ${maxScore}` : undefined,
          inputType: 'number',
          classes: 'govuk-input--width-4',
          defaultValue: Data(`scenario.${scoreCode}`),
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
    content: '<h2 class="govuk-heading-m">Criminogenic Needs</h2>',
  }),

  HtmlBlock({
    content: `
      <p class="govuk-body">
        Configure the criminogenic needs scores and flags for this scenario.
        Click on each section to expand and edit the values.
        Check "Randomize" to generate a new value each time the scenario is loaded.
      </p>
    `,
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
    title: 'Employment & Education',
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
    title: 'Drug Use',
    prefix: 'drug',
    hasScore: true,
    maxScore: 8,
  }),

  // Alcohol Use (Section 9)
  createNeedSection({
    title: 'Alcohol Use',
    prefix: 'alcohol',
    hasScore: true,
    maxScore: 4,
  }),

  // Health and Wellbeing (Section 10)
  createNeedSection({
    title: 'Health & Wellbeing',
    prefix: 'emo',
    hasScore: false,
  }),

  // Personal Relationships (Section 6)
  createNeedSection({
    title: 'Relationships',
    prefix: 'rel',
    hasScore: true,
    maxScore: 6,
  }),

  // Thinking/Behaviour/Attitudes (Section 11)
  createNeedSection({
    title: 'Thinking & Behaviour',
    prefix: 'think',
    hasScore: true,
    maxScore: 10,
  }),

  // Lifestyle and Associates (Section 7)
  createNeedSection({
    title: 'Lifestyle',
    prefix: 'lifestyle',
    hasScore: true,
    maxScore: 6,
  }),
]
