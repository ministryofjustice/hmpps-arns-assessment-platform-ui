import { GovUKDetails, GovUKHeading, GovUKInsetText } from '@ministryofjustice/hmpps-forge/govuk-components'
import { and, Condition, Self, Transformer, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import { CaseData } from '../../../../../sentence-plan/versions/v1.0/constants'
import { contentFor } from './locales'
import {
  dateField,
  itemisedSummaryRow,
  question,
  QuestionFormat,
  radioField,
  textField,
  textSummaryRow,
} from '../../../../constants/questionContent'
import { Question } from './constants/question'
import { CommonOption } from '../../constants/commonOption'
import { commonContentFor } from '../../locales'
import { Field } from './constants/step'
import { Section } from '../../constants/section'
import { SexualOffendingLocale } from './locales/en-gb'
import { ContentFormatter } from '../../../../generators/htmlContentFormatters'

const formatter = new ContentFormatter<SexualOffendingLocale>(contentFor)

export const sexualOffendingInsetField = GovUKInsetText({
  text: contentFor('content.inset_top'),
})

export const currentAndRecentSexualOffendingHeadingField = GovUKHeading({
  text: contentFor('content.heading_one'),
  size: 'm',
})

const currentOffenceSexualRadioQuestion = question({
  content: {
    code: Question.current_offence_sexually_motivated,
    format: QuestionFormat.RADIO,
    text: contentFor('question.current_offence_sexually_motivated.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--s', inputClasses: 'govuk-radios--inline' }),
    summaryRow: itemisedSummaryRow({ changePath: Field.current_offence_sexually_motivated.path }),
  },
})

const dateOfMostRecentSexualOffenceQuestion = question({
  content: {
    code: Question.date_of_most_recent_sexual_offence,
    format: QuestionFormat.DATE,
    text: contentFor('question.date_of_most_recent_sexual_offence.text', CaseData.ForenamePossessive),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: dateField({
      legendClasses: 'govuk-fieldset__legend--s',
      customValidations: [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: commonContentFor('validation.this_is_a_required_field'),
        }),
        validation({
          condition: Self().match(Condition.Date.IsValid()),
          message: commonContentFor('validation.valid_date'),
        }),
      ],
    }),
  },
})

export const sectionBreakField = HtmlBlock({
  content: '<hr class="govuk-section-break govuk-section-break--l govuk-section-break--visible">',
})

export const directContactSexualOffendingHeadingField = GovUKHeading({
  text: contentFor('content.heading_two'),
  size: 'm',
})

const contactSanctionsQuestion = question({
  content: {
    code: Question.number_of_contact_sexual_sanctions,
    format: QuestionFormat.TEXT,
    text: contentFor('question.number_of_contact_sexual_sanctions.text', CaseData.ForenamePossessive),
    hint: contentFor('question.number_of_contact_sexual_sanctions.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      labelClasses: 'govuk-label--s',
      inputClasses: 'govuk-input--width-5',
      customValidations: [
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
          message: commonContentFor('validation.number.not_whole_number'),
        }),
        validation({
          condition: and(
            Self().match(Condition.IsRequired()),
            Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThanOrEqual(0)),
          ),
          message: commonContentFor('validation.number.greater_or_equal_zero'),
        }),
      ],
    }),
    summaryRow: textSummaryRow({
      changeHref: Field.number_of_contact_sexual_sanctions.path,
    }),
  },
})

export const contactSexualDetailsField = GovUKDetails({
  summaryText: contentFor('content.details_contact_adult.summaryText'),
  html: formatter.concat(
    formatter.p('content.details_contact_adult.p_1'),
    formatter.p('content.details_contact_adult.p_2'),
    formatter.bulletList(
      'content.details_contact_adult.li_1',
      'content.details_contact_adult.li_2',
      'content.details_contact_adult.li_3',
      'content.details_contact_adult.li_4',
      'content.details_contact_adult.li_5',
      'content.details_contact_adult.li_6',
      'content.details_contact_adult.li_7',
      'content.details_contact_adult.li_8',
      'content.details_contact_adult.li_9',
      'content.details_contact_adult.li_10',
    ),
    formatter.p('content.details_contact_adult.p_3'),
    formatter.bulletList('content.details_contact_adult.li_11', 'content.details_contact_adult.li_12'),
    formatter.p('content.details_contact_adult.p_4'),
    formatter.bulletList('content.details_contact_adult.li_13', 'content.details_contact_adult.li_14'),
  ),
})

const contactChildSanctionsQuestion = question({
  content: {
    code: Question.number_of_contact_child_sexual_sanctions,
    format: QuestionFormat.TEXT,
    text: contentFor('question.number_of_contact_child_sexual_sanctions.text', CaseData.ForenamePossessive),
    hint: contentFor('question.number_of_contact_child_sexual_sanctions.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      labelClasses: 'govuk-label--s',
      inputClasses: 'govuk-input--width-5',
      customValidations: [
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
          message: commonContentFor('validation.number.not_whole_number'),
        }),
        validation({
          condition: and(
            Self().match(Condition.IsRequired()),
            Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThanOrEqual(0)),
          ),
          message: commonContentFor('validation.number.greater_or_equal_zero'),
        }),
      ],
    }),
    summaryRow: textSummaryRow({
      changeHref: Field.number_of_contact_child_sexual_sanctions.path,
    }),
  },
})

export const contactChildSexualDetailsField = GovUKDetails({
  summaryText: contentFor('content.details_contact_child.summaryText'),
  html: formatter.concat(
    formatter.p('content.details_contact_child.p_1'),
    formatter.bulletList(
      'content.details_contact_child.li_1',
      'content.details_contact_child.li_2',
      'content.details_contact_child.li_3',
      'content.details_contact_child.li_4',
      'content.details_contact_child.li_5',
      'content.details_contact_child.li_6',
      'content.details_contact_child.li_7',
      'content.details_contact_child.li_8',
      'content.details_contact_child.li_9',
      'content.details_contact_child.li_10',
      'content.details_contact_child.li_11',
      'content.details_contact_child.li_12',
      'content.details_contact_child.li_13',
      'content.details_contact_child.li_14',
      'content.details_contact_child.li_15',
    ),
    formatter.p('content.details_contact_child.p_2'),
    formatter.bulletList('content.details_contact_child.li_16', 'content.details_contact_child.li_17'),
    formatter.p('content.details_contact_child.p_3'),
  ),
})

const victimStrangerQuestion = question({
  content: {
    code: Question.victim_stranger,
    format: QuestionFormat.RADIO,
    text: contentFor('question.victim_stranger.text', CaseData.ForenamePossessive),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
      },
    ],
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: radioField({ legendClasses: 'govuk-fieldset__legend--s', inputClasses: 'govuk-radios--inline' }),
    summaryRow: itemisedSummaryRow({ changePath: Field.victim_stranger.path }),
  },
})

export const victimStrangerDetailsField = GovUKDetails({
  summaryText: contentFor('content.details_victim_stranger.summaryText'),
  html: formatter.concat(
    formatter.p(
      'content.details_victim_stranger.p_1_1',
      formatter.bold('content.details_victim_stranger.span'),
      'content.details_victim_stranger.p_1_2',
    ),
    formatter.boldP('content.details_victim_stranger.p_2'),
    formatter.p('content.details_victim_stranger.p_3'),
    formatter.boldP('content.details_victim_stranger.p_4'),
    formatter.p('content.details_victim_stranger.p_5'),
    formatter.bulletList('content.details_victim_stranger.li_1', 'content.details_victim_stranger.li_2'),
    formatter.p('content.details_victim_stranger.p_6'),
    formatter.bulletList(
      'content.details_victim_stranger.li_3',
      'content.details_victim_stranger.li_4',
      'content.details_victim_stranger.li_5',
    ),
  ),
})

export const imagesAndIndirectContactHeadingField = GovUKHeading({
  text: contentFor('content.heading_three'),
  size: 'm',
})

const indecentImagesOfChildrenQuestion = question({
  content: {
    code: Question.indecent_child_images,
    format: QuestionFormat.TEXT,
    text: contentFor('question.indecent_child_images.text', CaseData.ForenamePossessive),
    hint: contentFor('question.indecent_child_images.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      labelClasses: 'govuk-label--s',
      inputClasses: 'govuk-input--width-5',
      customValidations: [
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
          message: commonContentFor('validation.number.not_whole_number'),
        }),
        validation({
          condition: and(
            Self().match(Condition.IsRequired()),
            Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThanOrEqual(0)),
          ),
          message: commonContentFor('validation.number.greater_or_equal_zero'),
        }),
      ],
    }),
    summaryRow: textSummaryRow({
      changeHref: Field.indecent_child_images.path,
    }),
  },
})

export const indecentImagesOfChildrenDetailsField = GovUKDetails({
  summaryText: contentFor('content.details_indecent_images.summaryText'),
  html: formatter.concat(
    formatter.boldP('content.details_indecent_images.p_1'),
    formatter.p('content.details_indecent_images.p_2'),
    formatter.bulletList(
      'content.details_indecent_images.li_1',
      'content.details_indecent_images.li_2',
      'content.details_indecent_images.li_3',
    ),
    formatter.boldP('content.details_indecent_images.p_3'),
    formatter.p('content.details_indecent_images.P_4'),
    formatter.bulletList(
      'content.details_indecent_images.li_4',
      'content.details_indecent_images.li_5',
      'content.details_indecent_images.li_6',
      'content.details_indecent_images.li_7',
      'content.details_indecent_images.li_8',
    ),
    formatter.p('content.details_indecent_images.p_5'),
    formatter.p('content.details_indecent_images.p_6'),
  ),
})

const nonContactQuestion = question({
  content: {
    code: Question.non_contact,
    format: QuestionFormat.TEXT,
    text: contentFor('question.non_contact.text', CaseData.ForenamePossessive),
    hint: contentFor('question.non_contact.hint'),
    validationMessage: commonContentFor('validation.this_is_a_required_field'),
  },
  displayModes: {
    field: textField({
      labelClasses: 'govuk-label--s',
      inputClasses: 'govuk-input--width-5',
      customValidations: [
        validation({
          condition: Self().match(Condition.String.MatchesRegex('^-?\\d+$')),
          message: commonContentFor('validation.number.not_whole_number'),
        }),
        validation({
          condition: and(
            Self().match(Condition.IsRequired()),
            Self().pipe(Transformer.String.ToInt()).match(Condition.Number.GreaterThanOrEqual(0)),
          ),
          message: commonContentFor('validation.number.greater_or_equal_zero'),
        }),
      ],
    }),
    summaryRow: textSummaryRow({
      changeHref: Field.non_contact.path,
    }),
  },
})

export const nonContactDetailsField = GovUKDetails({
  summaryText: contentFor('content.details_non_contact.summaryText'),
  html: formatter.concat(
    formatter.p(
      'content.details_non_contact.p_1_1',
      formatter.bold('content.details_non_contact.span'),
      'content.details_non_contact.p_1_2',
    ),
    formatter.bulletList(
      'content.details_non_contact.li_1',
      'content.details_non_contact.li_2',
      'content.details_non_contact.li_3',
    ),
    formatter.p('content.details_non_contact.p_2'),
    formatter.bulletList(
      'content.details_non_contact.li_4',
      'content.details_non_contact.li_5',
      'content.details_non_contact.li_6',
      'content.details_non_contact.li_7',
      'content.details_non_contact.li_8',
      'content.details_non_contact.li_9',
      'content.details_non_contact.li_10',
      'content.details_non_contact.li_11',
      'content.details_non_contact.li_12',
      'content.details_non_contact.li_13',
      'content.details_non_contact.li_14',
    ),
    formatter.p('content.details_non_contact.p_3'),
    formatter.bulletList('content.details_non_contact.li_15', 'content.details_non_contact.li_16'),
    formatter.p('content.details_non_contact.p_4'),
    formatter.bulletList(
      'content.details_non_contact.li_17',
      'content.details_non_contact.li_18',
      'content.details_non_contact.li_19',
    ),
  ),
})

export const sexualOffendingFields = {
  code: Section.sexual_offending.code,
  questions: {
    currentOffenceSexualRadioQuestion,
    dateOfMostRecentSexualOffenceQuestion,
    contactSanctionsQuestion,
    contactChildSanctionsQuestion,
    victimStrangerQuestion,
    indecentImagesOfChildrenQuestion,
    nonContactQuestion,
  },
}
