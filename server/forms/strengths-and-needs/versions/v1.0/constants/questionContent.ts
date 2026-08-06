import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  not,
  or,
  PipelineExpr,
  PredicateExpr,
  Self,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKBody,
  GovUKCharacterCount,
  GovUKCheckboxInput,
  GovUKDateInputFull,
  GovUKRadioInput,
  GovUKSummaryList,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { StrengthsAndNeedsTransformers } from '../../../transformers'

import { CharacterLimit } from './characterLimit'
import { CommonOption } from './commonOption'
import { commonContentFor } from '../locales'
import { SANGenerators } from '../../../generators'
import { getDisplayTextForItems } from '../../../i18n'

/**
 * Content-first question authoring.
 *
 * A section declares each question's content (code, text, options, validation
 * message) exactly once, and pairs it with the display modes that project that
 * content into each surface it appears on — an editable field on its step, a
 * read-only row on the summary. Steps then compose projections; they never
 * restate content.
 *
 * The pieces, in the order a section uses them:
 *
 * - `question({ content, displayModes })` — a standalone question. Its
 *   `displayModes` hold the projected blocks, ready to drop into a step's
 *   `blocks` or a summary list's `rows`.
 * - `revealedQuestion({ content, displayModes })` — a question revealed by a
 *   parent option; attach it to that option's `reveals`. The parent's
 *   projection supplies the reveal wiring, so none is written by hand.
 * - `questionTemplate({ content, displayModes })` — one question asked once
 *   per parameter value (e.g. per drug); see its doc for the projections.
 * - The display mode functions (`radioField`, `itemisedSummaryRow`, ...) — the
 *   shared projections. Each takes the *placement* (where the question sits:
 *   gating, change link, legend style) and returns a function of content, so
 *   `question` can apply it.
 * - `requiredDetails` / `optionalDetails` / `yesNo` — the standard revealed
 *   free-text patterns, for options' `reveals`.
 * - `stableQuestionsOf(section)` — walks a section config and enumerates every
 *   question it can ask, for tests and tooling.
 *
 * @example
 * export const mySection = {
 *   fields: {
 *     likesTea: question({
 *       content: {
 *         code: Question.likes_tea,
 *         text: contentFor('question.likes_tea.text', CaseData.Forename),
 *         options: [
 *           {
 *             value: CommonOption.yes,
 *             text: commonContentFor('option.YES'),
 *             reveals: optionalDetails({ code: Question.likes_tea_details }),
 *           },
 *           { value: CommonOption.no, text: commonContentFor('option.NO') },
 *         ],
 *         validationMessage: contentFor('question.likes_tea.validation'),
 *       },
 *       displayModes: {
 *         field: radioField(),
 *         summaryRow: itemisedSummaryRow({ changePath: Step.my_step.path }),
 *       },
 *     }),
 *   },
 * }
 *
 * // In the step:  blocks: [mySection.fields.likesTea.displayModes.field, saveButton]
 * // In the summary:  rows: [mySection.fields.likesTea.displayModes.summaryRow]
 */

/**
 * Canonical content for a question: what it asks, how its answers are labelled,
 * and how invalid input is described. Declared once per question, then projected
 * into each rendering surface by a display mode.
 */
export interface QuestionContent {
  code: string
  text: ResolvableString
  // The object form renders the hint as HTML instead of escaped text.
  hint?: ResolvableString | { html: ResolvableString }
  validationMessage?: ResolvableString
}

export interface OptionedQuestionContent extends QuestionContent {
  options: QuestionOptionEntry[]
}

export interface QuestionOption {
  value: string
  text: ResolvableString
  // HTML rendering of the label; the field renders it instead of `text`, while
  // summaries keep using `text`, so declare both when the markup matters.
  html?: ResolvableString
  // Wording for the summary when the option label alone would lose meaning out
  // of context (e.g. a bare "Yes" under a differently-worded parent question).
  summaryText?: ResolvableString
  // The object form renders the hint as HTML instead of escaped text.
  hint?: ResolvableString | { html: ResolvableString }
  behaviour?: 'exclusive'
  // Prevents selecting the option without hiding it (e.g. ruled out by case data).
  disabled?: PredicateExpr
  visibleWhen?: PredicateExpr
  reveals?: RevealedQuestion | RevealedQuestion[]
}

export interface QuestionOptionDivider {
  divider: ResolvableString
}

export type QuestionOptionEntry = QuestionOption | QuestionOptionDivider

export const isQuestionOption = (entry: QuestionOptionEntry): entry is QuestionOption => !('divider' in entry)

/** Where a revealed question sits: the option that reveals it, on which parent. */
export interface ParentOption {
  parentCode: string
  optionValue: string

  /**
   * True when this option is selected. The parent's projection computes it,
   * because the expression depends on the parent's kind — equality for a radio,
   * array membership for a checkbox.
   */
  selectedWhen: PredicateExpr
}

/**
 * A question conditionally revealed by one of its parent's options. Its display
 * modes are applied by the parent's projection, which supplies the parent
 * context — so `dependentWhen` wiring is derived from position rather than
 * hand-written.
 */
export interface RevealedQuestion {
  content: QuestionContent
  displayModes: {
    // Method syntax deliberately: its bivariant parameters accept the narrowed
    // content lambdas produced by defineRevealedQuestion.
    field(content: QuestionContent, parent: ParentOption): BlockDefinition
  }
}

export type SummaryRow = GovUKSummaryList['rows'][number]

/** Placement of a field within its surrounding step, orthogonal to its content. */
interface FieldPlacement {
  dependentWhen?: PredicateExpr
  visibleWhen?: PredicateExpr
}

interface SummaryRowPlacement {
  changeHref: string
  visibleWhen?: PredicateExpr
}

// The forge serialiser rejects explicit `undefined` values, so optional
// projection props must be omitted entirely rather than set to undefined.
const definedPropsOf = <TProps extends object>(props: TProps): TProps =>
  Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as TProps

const optionsOf = (content: OptionedQuestionContent): QuestionOption[] => content.options.filter(isQuestionOption)

const revealedQuestionsOf = (option: QuestionOption): RevealedQuestion[] =>
  option.reveals ? [option.reveals].flat() : []

const revealedBlocksOf = (option: QuestionOption, parent: Omit<ParentOption, 'optionValue'>) => {
  const blocks = revealedQuestionsOf(option).map(revealed =>
    revealed.displayModes.field(revealed.content, { ...parent, optionValue: option.value }),
  )

  return blocks.length ? blocks : undefined
}

const optionHintOf = (hint: QuestionOption['hint']) => {
  if (!hint) {
    return undefined
  }

  return typeof hint === 'object' && 'html' in hint ? hint : { text: hint }
}

const itemsOf = (content: OptionedQuestionContent, selectedWhen: (option: QuestionOption) => PredicateExpr) =>
  content.options.map(entry =>
    isQuestionOption(entry)
      ? definedPropsOf({
          value: entry.value,
          text: entry.text,
          html: entry.html,
          hint: optionHintOf(entry.hint),
          behaviour: entry.behaviour,
          disabled: entry.disabled,
          visibleWhen: entry.visibleWhen,
          block: revealedBlocksOf(entry, { parentCode: content.code, selectedWhen: selectedWhen(entry) }),
        })
      : entry,
  )

/** Exported for bespoke template projections that hand-write their own component props. */
export const requiredValidationOf = (content: { validationMessage?: ResolvableString }) =>
  content.validationMessage
    ? [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: content.validationMessage,
        }),
      ]
    : undefined

const characterCountValidationsOf = (content: QuestionContent, maxLength: number) => [
  ...(requiredValidationOf(content) ?? []),
  validation({
    condition: Self().match(Condition.String.HasMaxLength(maxLength)),
    message: commonContentFor('validation.details_must_be_less_than', maxLength),
  }),
]

/**
 * The display mode functions: shared projections from question content to
 * forge blocks. Every mode is curried the same way: call it with the *placement* — everything about where
 * the question sits rather than what it asks (gating conditions, change link
 * target, legend style, length limits) — and it returns a function of content
 * for `defineQuestion`/`defineRevealedQuestion` to apply.
 *
 * `*Field` modes are editable inputs for a step; `*Details` modes are inputs
 * revealed under a parent option (they receive the parent context and derive
 * their own gating from it); `*SummaryRow` modes are read-only summary rows.
 *
 * Gating note: `dependentWhen` is what forge uses to skip validation and clear
 * answers for questions that don't currently apply — `visibleWhen` only hides.
 * A field hidden by a condition should normally carry the same expression in
 * both.
 *
 * When no mode fits (wiring that reaches outside the parent option, unusual
 * markup), write the component props by hand in a bespoke mode lambda — see
 * `drugsInjectedMonths` in the drug-use section — and reuse
 * `requiredValidationOf` for the standard required-answer validation.
 */
/**
 * Projects question content into an editable radio group. Options carrying
 * revealed questions have them projected into their conditional reveal block.
 */
export const radioField =
  (placement: FieldPlacement & { legendClasses?: string } = {}) =>
  (content: OptionedQuestionContent) =>
    GovUKRadioInput(
      definedPropsOf({
        code: content.code,
        fieldset: {
          legend: {
            text: content.text,
            classes: placement.legendClasses ?? 'govuk-fieldset__legend--m',
          },
        },
        hint: content.hint,
        items: itemsOf(content, option => Answer(content.code).match(Condition.Equals(option.value))),
        dependentWhen: placement.dependentWhen,
        visibleWhen: placement.visibleWhen,
        validWhen: requiredValidationOf(content),
      }),
    )

/**
 * Projects a revealed question into a radio group shown under its parent
 * option. The legend class is the caller's because a revealed radio usually
 * sits under an option label that already states the question — pass
 * `govuk-visually-hidden` rather than a heading style, or nothing when the
 * plain legend is wanted.
 */
export const radioDetails =
  (options: { legendClasses?: string } = {}) =>
  (content: OptionedQuestionContent, parent: ParentOption) =>
    GovUKRadioInput(
      definedPropsOf({
        code: content.code,
        fieldset: {
          legend: definedPropsOf({
            text: content.text,
            classes: options.legendClasses,
          }),
        },
        items: itemsOf(content, option => Answer(content.code).match(Condition.Equals(option.value))),
        dependentWhen: parent.selectedWhen,
        validWhen: requiredValidationOf(content),
      }),
    )

/**
 * Projects question content into an editable checkbox group (multi-select).
 * Same shape as `radioField`, except "this option is selected" is array
 * membership rather than equality.
 */
export const checkboxField =
  (placement: FieldPlacement & { legendClasses?: string } = {}) =>
  (content: OptionedQuestionContent) =>
    GovUKCheckboxInput(
      definedPropsOf({
        code: content.code,
        multiple: true,
        fieldset: {
          legend: {
            text: content.text,
            classes: placement.legendClasses ?? 'govuk-fieldset__legend--m',
          },
        },
        hint: content.hint,
        items: itemsOf(content, option =>
          and(
            Answer(content.code).match(Condition.IsRequired()),
            Answer(content.code).match(Condition.Array.Contains(option.value)),
          ),
        ),
        dependentWhen: placement.dependentWhen,
        visibleWhen: placement.visibleWhen,
        validWhen: requiredValidationOf(content),
      }),
    )

/**
 * Projects a revealed question into a checkbox group shown under its parent
 * option. Rendered without a legend by default — the parent option's label
 * states the question, so the content's text exists for the question
 * inventory rather than the page. Pass `legendClasses` (usually
 * `govuk-visually-hidden`) to render the text as a legend after all.
 */
export const checkboxDetails =
  (options: { legendClasses?: string } = {}) =>
  (content: OptionedQuestionContent, parent: ParentOption) =>
    GovUKCheckboxInput(
      definedPropsOf({
        code: content.code,
        multiple: true,
        fieldset: options.legendClasses
          ? { legend: { text: content.text, classes: options.legendClasses } }
          : undefined,
        hint: content.hint,
        items: itemsOf(content, option =>
          and(
            Answer(content.code).match(Condition.IsRequired()),
            Answer(content.code).match(Condition.Array.Contains(option.value)),
          ),
        ),
        dependentWhen: parent.selectedWhen,
        validWhen: requiredValidationOf(content),
      }),
    )

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
      actions: {
        items: [{ href: placement.changeHref, text: commonContentFor('change') }],
      },
    })

// Option entries as the summary should label them: `summaryText` where declared.
const summaryItemsOf = (options: QuestionOptionEntry[]) =>
  options.map(entry => (isQuestionOption(entry) && entry.summaryText ? { ...entry, text: entry.summaryText } : entry))

// The answers beneath a question on the summary, recursively: option labels
// for optioned reveals (then whatever those options reveal in turn), the
// verbatim answer otherwise.
const revealedAnswerBlocksOf = (content: OptionedQuestionContent): BlockDefinition[] =>
  optionsOf(content).flatMap(option =>
    revealedQuestionsOf(option).flatMap(revealed =>
      isOptioned(revealed.content)
        ? [
            ...getDisplayTextForItems(revealed.content.code, summaryItemsOf(revealed.content.options), { size: 's' }),
            ...revealedAnswerBlocksOf(revealed.content),
          ]
        : [
            GovUKBody({
              text: Answer(revealed.content.code),
              size: 's',
              visibleWhen: Answer(revealed.content.code).match(Condition.IsRequired()),
            }),
          ],
    ),
  )

const hasAnyDatePart = () =>
  and(
    Self().match(Condition.Object.IsObject()),
    or(
      Self().match(Condition.Object.PropertyHasValue('day')),
      Self().match(Condition.Object.PropertyHasValue('month')),
      Self().match(Condition.Object.PropertyHasValue('year')),
    ),
  )

const hasAllDateParts = () =>
  and(
    Self().match(Condition.Object.IsObject()),
    Self().match(Condition.Object.PropertyHasValue('day')),
    Self().match(Condition.Object.PropertyHasValue('month')),
    Self().match(Condition.Object.PropertyHasValue('year')),
  )

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
      actions: {
        items: [
          definedPropsOf({
            href: `${placement.changePath}#${content.code}`,
            text: commonContentFor('change'),
            visuallyHiddenText: placement.changeVisuallyHiddenText ? content.text : undefined,
          }),
        ],
      },
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
      actions: {
        items: [{ href: placement.changeHref, text: commonContentFor('change') }],
      },
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
      actions: {
        items: [{ href: placement.changeHref, text: commonContentFor('change') }],
      },
    })

/**
 * Declares a question revealed by a parent option. Unlike `question` it
 * does not apply the display modes — a revealed question's modes need the
 * parent context, which only exists when the parent's own projection runs — so
 * its job is typechecking the node at the call site. Generic over the content
 * so bespoke mode lambdas see the exact content literal, custom properties
 * included.
 *
 * @example
 * {
 *   value: CommonOption.yes,
 *   text: commonContentFor('option.YES'),
 *   reveals: revealedQuestion({
 *     content: {
 *       code: Question.my_question_yes_details,
 *       text: commonContentFor('required_details'),
 *       validationMessage: contentFor('question.my_question_yes_details.validation'),
 *     },
 *     displayModes: { field: characterCountDetails({ maxLength: CharacterLimit.c2000 }) },
 *   }),
 * }
 */
export const revealedQuestion = <TContent extends QuestionContent>(definition: {
  content: TContent
  displayModes: { field: (content: TContent, parent: ParentOption) => BlockDefinition }
}): RevealedQuestion & { content: TContent } => definition

/**
 * Applies each display mode to the question's content. This is what stands in
 * for the self-reference a plain `{ content, displayModes }` literal would need:
 * modes are authored as functions of content, and content flows in here.
 *
 * Mode names are the section's own vocabulary — whatever keys are passed come
 * back on `displayModes` holding the projected blocks (by convention: `field`
 * for the editable input, `summaryRow` for the read-only row).
 *
 * @example
 * const myQuestion = question({
 *   content: { code: Question.my_question, text: contentFor('question.my_question.text'), options: [...] },
 *   displayModes: {
 *     field: radioField({ dependentWhen: applies, visibleWhen: applies }),
 *     summaryRow: itemisedSummaryRow({ changePath: Step.my_step.path, visibleWhen: applies }),
 *   },
 * })
 * myQuestion.displayModes.field // GovUKRadioInput block, ready for a step's `blocks`
 */
export const question = <
  TContent extends QuestionContent,
  TModes extends Record<string, (content: TContent) => unknown>,
>(definition: {
  content: TContent
  displayModes: TModes
}) => ({
  content: definition.content,
  displayModes: Object.fromEntries(
    Object.entries(definition.displayModes).map(([modeName, project]) => [modeName, project(definition.content)]),
  ) as { [TMode in keyof TModes]: ReturnType<TModes[TMode]> },
})

/**
 * Canonical content for a question template: one question asked once per
 * parameter value (e.g. once per drug). Instance codes are computed from the
 * parameter, but the parameter universe is static, so every instance remains a
 * stable, statically-known question rather than runtime data.
 */
export interface QuestionTemplateContent {
  code: (instanceValue: string) => string

  /**
   * Expression twin of `code` for templates rendered over a runtime collection,
   * where the parameter is a collection item rather than a literal value.
   */
  codeOver?: (instanceParam: ChainableExpr<PipelineExpr>) => ResolvableString
  text: (instanceParam: string | ChainableExpr<PipelineExpr>) => ResolvableString
  hint?: ResolvableString
  options?: QuestionOptionEntry[]
  validationMessage?: ResolvableString
}

/**
 * Instance content handed to a template's collection projection: same shape as
 * question content except the code is an expression built from the collection
 * item.
 */
export interface TemplateProjectionContent {
  code: ResolvableString
  text: ResolvableString
  hint?: ResolvableString
  options: QuestionOptionEntry[]
  validationMessage?: ResolvableString
}

/**
 * Declares a question template — the single authoring point for every
 * instance. `instance(value)` produces the concrete question for one parameter
 * value in the shape a parent option's `reveals` expects; `over(expr)` and
 * `summaryRowOver(expr)` project the template across a runtime collection item
 * via the `collectionField` and `collectionSummaryRow` modes. All throwing on
 * a missing mode is deliberate: calling a projection the template does not
 * declare is an authoring bug.
 *
 * Declare `code` for `instance()` and its expression twin `codeOver` for the
 * collection projections; a template only needs the ones its projections use.
 *
 * @example
 * const drugLastUsed = questionTemplate({
 *   content: {
 *     code: drugValue => fieldCodeString(Question.drug_last_used, drugValue),
 *     codeOver: drugValue => Format(Question.drug_last_used_value, drugValue),
 *     text: drugValue => contentFor('question.drug_last_used.text', drugValueToText(drugValue)),
 *     options: [...],
 *     validationMessage: contentFor('question.drug_last_used.validation'),
 *   },
 *   displayModes: { field: radioDetails({ legendClasses: 'govuk-visually-hidden' }) },
 * })
 *
 * // As a reveal on a static option:
 * { value: Option.cannabis, text: contentFor('option.CANNABIS'), reveals: drugLastUsed.instance(Option.cannabis) }
 *
 * // Rendered per item of a runtime collection (expects the item expression
 * // in whatever case the code pattern needs — lowercase it at the call site):
 * fields: [drugLastUsed.over(Item().path('value').pipe(Transformer.String.ToLowerCase()))]
 */
export const questionTemplate = (definition: {
  content: QuestionTemplateContent
  displayModes: {
    field?(content: OptionedQuestionContent, parent: ParentOption): BlockDefinition
    collectionField?(content: TemplateProjectionContent): BlockDefinition
    collectionSummaryRow?(content: TemplateProjectionContent): SummaryRow
  }
}) => {
  const { content: template, displayModes } = definition
  const projectionContentOf = (instanceParam: ChainableExpr<PipelineExpr>): TemplateProjectionContent => {
    const { codeOver } = template

    if (!codeOver) {
      throw new Error('Question template has no collection code')
    }

    return {
      code: codeOver(instanceParam),
      text: template.text(instanceParam),
      hint: template.hint,
      options: template.options ?? [],
      validationMessage: template.validationMessage,
    }
  }

  return {
    codeOf: template.code,
    options: template.options ?? [],
    instance: (instanceValue: string): RevealedQuestion => {
      const { field } = displayModes

      if (!field) {
        throw new Error(`Question template '${template.code(instanceValue)}' has no field display mode`)
      }

      const content: OptionedQuestionContent = {
        code: template.code(instanceValue),
        text: template.text(instanceValue),
        hint: template.hint,
        options: template.options ?? [],
        validationMessage: template.validationMessage,
      }

      return { content, displayModes: { field } }
    },
    over: (instanceParam: ChainableExpr<PipelineExpr>): BlockDefinition => {
      const { collectionField } = displayModes

      if (!collectionField) {
        throw new Error('Question template has no collection field projection')
      }

      return collectionField(projectionContentOf(instanceParam))
    },
    summaryRowOver: (instanceParam: ChainableExpr<PipelineExpr>): SummaryRow => {
      const { collectionSummaryRow } = displayModes

      if (!collectionSummaryRow) {
        throw new Error('Question template has no collection summary row projection')
      }

      return collectionSummaryRow(projectionContentOf(instanceParam))
    },
  }
}

export interface SectionDefinition {
  fields: Record<string, { content: QuestionContent }>
}

const isOptioned = (content: QuestionContent): content is OptionedQuestionContent => 'options' in content

const withRevealedQuestions = (content: QuestionContent): QuestionContent[] => [
  content,
  ...(isOptioned(content)
    ? optionsOf(content).flatMap(option =>
        revealedQuestionsOf(option).flatMap(revealed => withRevealedQuestions(revealed.content)),
      )
    : []),
]

/**
 * Every question a section can ask, in authored order — each field followed by
 * the questions its options reveal, recursively. Content-first authoring makes
 * the section config a complete, statically walkable inventory of its stable
 * question codes; only data-parameterized questions (codes built from runtime
 * collections) live outside it.
 */
export const stableQuestionsOf = (section: SectionDefinition): QuestionContent[] =>
  Object.values(section.fields).flatMap(field => withRevealedQuestions(field.content))

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
      text: commonContentFor('required_details'),
      hint: content.hint,
      validationMessage: content.validationMessage,
    },
    displayModes: { field: characterCountDetails({ maxLength: content.maxLength ?? CharacterLimit.c2000 }) },
  })

/** An optional free-text reveal: "Give details (optional)". */
export const optionalDetails = (content: { code: string; hint?: ResolvableString; maxLength?: number }) =>
  revealedQuestion({
    content: { code: content.code, text: commonContentFor('optional_details'), hint: content.hint },
    displayModes: { field: characterCountDetails({ maxLength: content.maxLength ?? CharacterLimit.c2000 }) },
  })

/** The standard yes/no options, each optionally revealing a follow-up question. */
export const yesNo = (reveals: { yes?: RevealedQuestion; no?: RevealedQuestion } = {}): QuestionOption[] => [
  { value: CommonOption.yes, text: commonContentFor('option.YES'), reveals: reveals.yes },
  { value: CommonOption.no, text: commonContentFor('option.NO'), reveals: reveals.no },
]
