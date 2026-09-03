import { ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import {
  and,
  Answer,
  Condition,
  not,
  PredicateExpr,
  Self,
  validation,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKBody, GovUKCharacterCount, GovUKDateInputFull } from '@ministryofjustice/hmpps-forge/govuk-components'
import { CommonOption } from './commonOption'
import { commonContentFor } from '../locales'
import { CharacterLimit } from '../../../constants/characterLimit'
import {
  definedPropsOf,
  FieldPlacement,
  hasAllDateParts,
  hasAnyDatePart,
  OptionedQuestionContent,
  optionsOf,
  ParentOption,
  QuestionContent,
  QuestionFormat,
  QuestionOption,
  requiredValidationOf,
  revealedAnswerBlocksOf,
  revealedQuestion,
  RevealedQuestion,
  revealedQuestionsOf,
  summaryItemsOf,
  SummaryRow,
  SummaryRowPlacement,
} from '../../../constants/questionContent'
import { StrengthsAndNeedsTransformers } from '../../../transformers'
import { getDisplayTextForItems } from '../../../i18n'
import { SANGenerators } from '../../../generators'
import { isEditMode } from '../guards'

const characterCountValidationsOf = (content: QuestionContent, maxLength: number) => [
  ...(requiredValidationOf(content) ?? []),
  validation({
    condition: Self().match(Condition.String.HasMaxLength(maxLength)),
    message: commonContentFor('validation.details_must_be_less_than', maxLength),
  }),
]

/**
 * Projects question content into a standalone character count. Required-ness
 * follows from whether the content carries a validation message. `label`
 * overrides the rendered label when the canonical question text is too long
 * for an inline field (e.g. "Give details (optional)" under a parent question).
 */
export const characterCountField =
  (placement: FieldPlacement & { maxLength: number; label?: ResolvableString }) => (content: QuestionContent) =>
    GovUKCharacterCount(
      definedPropsOf({
        code: content.code,
        label: placement.label ?? { text: content.text, classes: 'govuk-label--m' },
        hint: content.hint,
        maxLength: placement.maxLength,
        dependentWhen: placement.dependentWhen,
        visibleWhen: placement.visibleWhen,
        validWhen: characterCountValidationsOf(content, placement.maxLength),
      }),
    )

/**
 * Projects a revealed question into a character count shown under its parent
 * option. Required-ness follows from whether the content carries a validation
 * message.
 */
export const characterCountDetails =
  (options: { maxLength: number }) => (content: QuestionContent, parent: ParentOption) =>
    GovUKCharacterCount(
      definedPropsOf({
        code: content.code,
        label: content.text,
        hint: content.hint,
        maxLength: options.maxLength,
        dependentWhen: parent.selectedWhen,
        validWhen: characterCountValidationsOf(content, options.maxLength),
      }),
    )

/**
 * Creates actions for a summary row that are to be displayed when in edit mode
 */
export const createSummaryRowActions = (changeRef: ResolvableString) =>
  when(isEditMode)
    .then({ items: [{ href: changeRef, text: commonContentFor('change') }] })
    .else({})

/**
 * A required free-text reveal: "Give details", with the validation message
 * shown when the revealing option is selected but the details are left empty.
 */
export const requiredDetails = (content: {
  code: string
  validationMessage: ResolvableString
  hint?: ResolvableString
  maxLength?: number
}) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.TEXT,
      text: commonContentFor('required_details'),
      hint: content.hint,
      validationMessage: content.validationMessage,
    },
    displayModes: { field: characterCountDetails({ maxLength: content.maxLength ?? CharacterLimit.c2000 }) },
  })

/** An optional free-text reveal: "Give details (optional)". */
export const optionalDetails = (content: { code: string; hint?: ResolvableString; maxLength?: number }) =>
  revealedQuestion({
    content: {
      code: content.code,
      format: QuestionFormat.TEXT,
      text: commonContentFor('optional_details'),
      hint: content.hint,
    },
    displayModes: { field: characterCountDetails({ maxLength: content.maxLength ?? CharacterLimit.c2000 }) },
  })

/** The standard yes/no options, each optionally revealing a follow-up question. */
export const yesNo = (reveals: { yes?: RevealedQuestion; no?: RevealedQuestion } = {}): QuestionOption[] => [
  { value: CommonOption.yes, text: commonContentFor('option.YES'), reveals: reveals.yes },
  { value: CommonOption.no, text: commonContentFor('option.NO'), reveals: reveals.no },
]

// A date that may be left empty, but once any part is entered must be a
// complete, valid, future date. Each incomplete part gets its own message
// anchored to its field.
const optionalFutureDateValidations = () => [
  validation({
    condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('day')))),
    message: commonContentFor('validation.valid_date_day'),
    details: { field: 'day' },
  }),
  validation({
    condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('month')))),
    message: commonContentFor('validation.valid_date_month'),
    details: { field: 'month' },
  }),
  validation({
    condition: not(and(hasAnyDatePart(), Self().not.match(Condition.Object.PropertyHasValue('year')))),
    message: commonContentFor('validation.valid_date_year'),
    details: { field: 'year' },
  }),
  validation({
    condition: not(hasAllDateParts()),
    message: commonContentFor('validation.valid_date'),
  }),
  validation({
    condition: not(
      and(
        Self().match(Condition.IsRequired()),
        Self().not.match(Condition.Object.IsObject()),
        Self().not.match(Condition.Date.IsValid()),
      ),
    ),
    message: commonContentFor('validation.valid_date'),
  }),
  validation({
    condition: not(
      and(
        Self().match(Condition.IsRequired()),
        Self().not.match(Condition.Object.IsObject()),
        Self().match(Condition.Date.IsValid()),
        Self().not.match(Condition.Date.IsFutureDate()),
      ),
    ),
    message: commonContentFor('validation.future_date'),
  }),
]

/**
 * Projects a revealed question into a full date input shown under its parent
 * option. The date is optional, but a started date must be complete, valid,
 * and in the future; the answer is stored as an ISO date string.
 */
export const optionalFutureDateDetails = () => (content: QuestionContent, parent: ParentOption) =>
  GovUKDateInputFull({
    code: content.code,
    fieldset: {
      legend: { text: content.text },
    },
    dependentWhen: parent.selectedWhen,
    formatters: [StrengthsAndNeedsTransformers.ToISO()],
    validWhen: optionalFutureDateValidations(),
  })

/**
 * Projects question content into a read-only summary row: the stored answer
 * mapped back to its option label, followed by the answers to any revealed
 * questions the options carry, each shown only while its option is selected.
 */
export const summaryRow =
  (placement: SummaryRowPlacement) =>
  (content: OptionedQuestionContent): SummaryRow =>
    definedPropsOf({
      key: { html: content.text },
      visibleWhen: placement.visibleWhen,
      value: {
        blocks: [
          GovUKBody({
            text: SANGenerators.getTextFromListDefinition(content.options, Answer(content.code)),
          }),
          ...optionsOf(content).flatMap(option =>
            revealedQuestionsOf(option).map(revealed =>
              GovUKBody({
                text: Answer(revealed.content.code),
                size: 's',
                visibleWhen: Answer(content.code).match(Condition.Equals(option.value)),
              }),
            ),
          ),
        ],
      },
      actions: createSummaryRowActions(placement.changeHref),
    })

/**
 * Read-only summary row in the itemised style: every option label rendered
 * as its own conditionally-visible body (single- and multi-select alike),
 * followed by the answers to the questions the options reveal — option
 * labels again for optioned reveals (recursively, for reveals of reveals),
 * the verbatim answer otherwise. The change link anchors to the question on
 * its step, and can carry the question text as visually hidden context.
 */
export const itemisedSummaryRow =
  (placement: { changePath: string; visibleWhen?: PredicateExpr; changeVisuallyHiddenText?: boolean }) =>
  (content: OptionedQuestionContent): SummaryRow =>
    definedPropsOf({
      key: { text: content.text },
      visibleWhen: placement.visibleWhen,
      value: {
        blocks: [
          ...getDisplayTextForItems(content.code, summaryItemsOf(content.options)),
          ...revealedAnswerBlocksOf(content),
        ],
      },
      actions: when(isEditMode)
        .then({
          items: [
            definedPropsOf({
              href: `${placement.changePath}#${content.code}`,
              text: commonContentFor('change'),
              visuallyHiddenText: placement.changeVisuallyHiddenText ? content.text : undefined,
            }),
          ],
        })
        .else({}),
    })

/**
 * Read-only summary row for a multi-select question: one line per selected
 * option, using each option's own label.
 */
export const checkboxSummaryRow =
  (placement: SummaryRowPlacement) =>
  (content: OptionedQuestionContent): SummaryRow =>
    definedPropsOf({
      key: { html: content.text },
      visibleWhen: placement.visibleWhen,
      value: {
        blocks: optionsOf(content).map(option =>
          GovUKBody({
            text: option.text,
            visibleWhen: and(
              Answer(content.code).match(Condition.IsRequired()),
              Answer(content.code).match(Condition.Array.Contains(option.value)),
            ),
          }),
        ),
      },
      actions: createSummaryRowActions(placement.changeHref),
    })

/** Read-only summary row for a free-text question: the answer, verbatim. */
export const textSummaryRow =
  (placement: SummaryRowPlacement) =>
  (content: QuestionContent): SummaryRow =>
    definedPropsOf({
      key: { html: content.text },
      visibleWhen: placement.visibleWhen,
      value: {
        blocks: [GovUKBody({ text: Answer(content.code) })],
      },
      actions: createSummaryRowActions(placement.changeHref),
    })
