import {
  and,
  Answer,
  ChainableExpr,
  Condition,
  or,
  PredicateExpr,
  Self,
  validation,
  ValidationExpr,
  when,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import { BlockDefinition, ResolvableString } from '@ministryofjustice/hmpps-forge/core/components'
import {
  GovUKBody,
  GovUKCheckboxInput,
  GovUKDateInputFull,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTextInput,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { getDisplayTextForItems, getDisplayTextForSpecificItem } from '../i18n'
import { SANGenerators } from '../generators'
import { commonContentFor } from '../versions/v1.0/locales'
import { checkYourAnswersQuery } from '../versions/v1.0/common'
import { StrengthsAndNeedsTransformers } from '../transformers/transformers'
import { isEditMode } from '../guards'

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
 *   questions: {
 *     likesTea: question({
 *       content: {
 *         code: Question.likes_tea,
 *         format: QuestionFormat.RADIO,
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
 * // In the step:  blocks: [mySection.questions.likesTea.displayModes.field, saveButton]
 * // In the summary:  rows: [mySection.questions.likesTea.displayModes.summaryRow]
 */

export enum QuestionFormat {
  RADIO = 'RADIO',
  CHECKBOX = 'CHECKBOX',
  TEXT = 'TEXT',
  DATE = 'DATE',
}

/**
 * Canonical content for a question: what it asks, how its answers are labelled,
 * and how invalid input is described. Declared once per question, then projected
 * into each rendering surface by a display mode.
 */

// Tiering-assessment added isPageHeading
export interface QuestionContent {
  code: string
  idPrefix?: string
  // The input kind the question renders as.
  format: QuestionFormat
  text: ResolvableString
  // The object form renders the hint as HTML instead of escaped text.
  hint?: ResolvableString | { html: ResolvableString }
  validationMessage?: ResolvableString
  isPageHeading?: boolean
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
 * handwritten.
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
export interface FieldPlacement {
  dependentWhen?: PredicateExpr
  visibleWhen?: PredicateExpr
}

export interface SummaryRowPlacement {
  changeHref: string
  visibleWhen?: PredicateExpr
}

// The forge serialiser rejects explicit `undefined` values, so optional
// projection props must be omitted entirely rather than set to undefined.
export const definedPropsOf = <TProps extends object>(props: TProps): TProps =>
  Object.fromEntries(Object.entries(props).filter(([, value]) => value !== undefined)) as TProps

export const optionsOf = (content: OptionedQuestionContent): QuestionOption[] =>
  content.options.filter(isQuestionOption)

export const revealedQuestionsOf = (option: QuestionOption): RevealedQuestion[] =>
  option.reveals ? [option.reveals].flat() : []

export const revealedBlocksOf = (option: QuestionOption, parent: Omit<ParentOption, 'optionValue'>) => {
  const blocks = revealedQuestionsOf(option).map(revealed =>
    revealed.displayModes.field(revealed.content, { ...parent, optionValue: option.value }),
  )

  return blocks.length ? blocks : undefined
}

export const optionHintOf = (hint: QuestionOption['hint']) => {
  if (!hint) {
    return undefined
  }

  return typeof hint === 'object' && 'html' in hint ? hint : { text: hint }
}

export const itemsOf = (content: OptionedQuestionContent, selectedWhen: (option: QuestionOption) => PredicateExpr) =>
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
/** Updated by tiering-assessment */
export const requiredValidationOf = (
  validationMessage?: ResolvableString,
  customValidations?: ValidationExpr[],
): ValidationExpr[] | undefined => {
  const isRequiredValidation = validationMessage
    ? [
        validation({
          condition: Self().match(Condition.IsRequired()),
          message: validationMessage,
        }),
      ]
    : []

  const allValidations = [...isRequiredValidation, ...(customValidations ?? [])]

  return allValidations.length > 0 ? allValidations : undefined
}

export const createSummaryRowActions = (changeRef: ResolvableString) =>
  when(checkYourAnswersQuery)
    .then({ items: [{ href: changeRef, text: commonContentFor('change') }] })
    .else({})

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

// This is created for tiering-assessment
export const textField =
  (
    placement: FieldPlacement & {
      label?: ResolvableString
      labelClasses?: ResolvableString
      inputClasses?: ResolvableString
      customValidations?: ValidationExpr[]
    } = {},
  ) =>
  (content: QuestionContent) =>
    GovUKTextInput(
      definedPropsOf({
        code: content.code,
        label: {
          text: content.text,
          classes: placement.labelClasses ?? 'govuk-label--m',
        },
        hint: content.hint,
        classes: placement.inputClasses,
        dependentWhen: placement.dependentWhen,
        visibleWhen: placement.visibleWhen,
        validWhen: requiredValidationOf(content.validationMessage, placement.customValidations),
      }),
    )

// Independent dateField This is created for tiering-assessment
export const dateField =
  (placement: FieldPlacement & { legendClasses?: ResolvableString; customValidations?: ValidationExpr[] } = {}) =>
  (content: QuestionContent) =>
    GovUKDateInputFull({
      code: content.code,
      fieldset: {
        legend: {
          text: content.text,
          classes: placement.legendClasses ?? 'govuk-fieldset__legend--m',
          isPageHeading: content.isPageHeading ?? false,
        },
      },
      formatters: [StrengthsAndNeedsTransformers.ToISO()],
      validWhen: placement.customValidations,
    })

export const revealedDateField =
  (placement: FieldPlacement & { legendClasses?: ResolvableString; customValidations?: ValidationExpr[] } = {}) =>
  (content: QuestionContent, parent: ParentOption) =>
    GovUKDateInputFull({
      code: content.code,
      fieldset: {
        legend: {
          text: content.text,
          classes: placement.legendClasses ?? 'govuk-fieldset__legend--m',
          isPageHeading: content.isPageHeading ?? false,
        },
      },
      dependentWhen: parent?.selectedWhen,
      formatters: [StrengthsAndNeedsTransformers.ToISO()],
      validWhen: placement.customValidations,
    })

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
  (placement: FieldPlacement & { legendClasses?: string; inputClasses?: string } = {}) =>
  (content: OptionedQuestionContent) =>
    GovUKRadioInput(
      definedPropsOf({
        code: content.code,
        idPrefix: content.idPrefix,
        fieldset: {
          legend: {
            text: content.text,
            classes: placement.legendClasses ?? 'govuk-fieldset__legend--m',
          },
        },
        classes: placement.inputClasses,
        hint: content.hint,
        items: itemsOf(content, option => Answer(content.code).match(Condition.Equals(option.value))),
        dependentWhen: placement.dependentWhen,
        visibleWhen: placement.visibleWhen,
        validWhen: requiredValidationOf(content.validationMessage),
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
        idPrefix: content.idPrefix,
        fieldset: {
          legend: definedPropsOf({
            text: content.text,
            classes: options.legendClasses,
          }),
        },
        items: itemsOf(content, option => Answer(content.code).match(Condition.Equals(option.value))),
        dependentWhen: parent.selectedWhen,
        validWhen: requiredValidationOf(content.validationMessage),
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
        validWhen: requiredValidationOf(content.validationMessage),
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
        validWhen: requiredValidationOf(content.validationMessage),
      }),
    )

// Option entries as the summary should label them: `summaryText` where declared.
export const summaryItemsOf = (options: QuestionOptionEntry[]) =>
  options.map(entry => (isQuestionOption(entry) && entry.summaryText ? { ...entry, text: entry.summaryText } : entry))

// The answer as a summary should read it. Currently just formatting dates.
const answerTextOf = (content: QuestionContent) => {
  if (content.format === QuestionFormat.DATE) {
    return SANGenerators.getFormatterDateFromIso(Answer(content.code))
  }

  return Answer(content.code)
}

const isAnswered = (content: QuestionContent) => Answer(content.code).match(Condition.IsRequired())

// True once the question has been answered
const answeredWithin = (content: QuestionContent) => or(questionsWithin(content).map(isAnswered))

// A question's answer, and the answers to everything its options revealed.
const answerBlocksOf = (content: QuestionContent, size?: 's'): BlockDefinition[] => {
  if (!isOptioned(content)) {
    return [
      GovUKBody({
        text: answerTextOf(content),
        visibleWhen: answeredWithin(content),
        ...(size && { size }),
      }),
    ]
  }

  return optionsOf(content).flatMap(option => [
    ...getDisplayTextForSpecificItem(content.code, summaryItemsOf(content.options), option.value, { size }),
    ...revealedQuestionsOf(option).flatMap(revealed => answerBlocksOf(revealed.content, 's')),
  ])
}

// The answers beneath a question on the summary, recursively: option labels
// for optioned reveals (then whatever those options reveal in turn), the
// verbatim answer otherwise.
export const revealedAnswerBlocksOf = (content: OptionedQuestionContent): BlockDefinition[] =>
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

export const hasAnyDatePart = () =>
  and(
    Self().match(Condition.Object.IsObject()),
    or(
      Self().match(Condition.Object.PropertyHasValue('day')),
      Self().match(Condition.Object.PropertyHasValue('month')),
      Self().match(Condition.Object.PropertyHasValue('year')),
    ),
  )

export const hasAllDateParts = () =>
  and(
    Self().match(Condition.Object.IsObject()),
    Self().match(Condition.Object.PropertyHasValue('day')),
    Self().match(Condition.Object.PropertyHasValue('month')),
    Self().match(Condition.Object.PropertyHasValue('year')),
  )

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
 *       format: QuestionFormat.TEXT,
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
 *   content: {
 *     code: Question.my_question,
 *     format: QuestionFormat.RADIO,
 *     text: contentFor('question.my_question.text'),
 *     options: [...],
 *   },
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
  // The input kind every instance of the template renders as.
  format: QuestionFormat

  /**
   * Expression twin of `code` for templates rendered over a runtime collection,
   * where the parameter is a collection item rather than a literal value.
   */
  codeOver?: (instanceParam: ChainableExpr) => ResolvableString
  text: (instanceParam: string | ChainableExpr) => ResolvableString
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
  // The input kind the question renders as.
  format: QuestionFormat
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
 *     format: QuestionFormat.RADIO,
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
  const projectionContentOf = (instanceParam: ChainableExpr): TemplateProjectionContent => {
    const { codeOver } = template

    if (!codeOver) {
      throw new Error('Question template has no collection code')
    }

    return {
      code: codeOver(instanceParam),
      format: template.format,
      text: template.text(instanceParam),
      hint: template.hint,
      options: template.options ?? [],
      validationMessage: template.validationMessage,
    }
  }

  const contentOf = (instanceValue: string): OptionedQuestionContent => ({
    code: template.code(instanceValue),
    format: template.format,
    text: template.text(instanceValue),
    hint: template.hint,
    options: template.options ?? [],
    validationMessage: template.validationMessage,
  })

  return {
    codeOf: template.code,
    options: template.options ?? [],
    // Content for one instance without requiring a `field` display mode —
    // for templates only ever rendered via `over()`, used to register their
    // per-instance codes as stable questions (e.g. for `stableQuestionsOf`).
    contentOf,
    instance: (instanceValue: string): RevealedQuestion => {
      const { field } = displayModes

      if (!field) {
        throw new Error(`Question template '${template.code(instanceValue)}' has no field display mode`)
      }

      return { content: contentOf(instanceValue), displayModes: { field } }
    },
    over: (instanceParam: ChainableExpr): BlockDefinition => {
      const { collectionField } = displayModes

      if (!collectionField) {
        throw new Error('Question template has no collection field projection')
      }

      return collectionField(projectionContentOf(instanceParam))
    },
    summaryRowOver: (instanceParam: ChainableExpr): SummaryRow => {
      const { collectionSummaryRow } = displayModes

      if (!collectionSummaryRow) {
        throw new Error('Question template has no collection summary row projection')
      }

      return collectionSummaryRow(projectionContentOf(instanceParam))
    },
  }
}

type SectionFields = Record<string, { content: QuestionContent }>

export interface SectionDefinition {
  code: string
  questions: SectionFields
}

export const questionsWithin = (content: QuestionContent): QuestionContent[] => withRevealedQuestions(content)

export const answerRow = (content: QuestionContent): SummaryRow => ({
  key: { html: content.text },
  visibleWhen: answeredWithin(content),
  value: { blocks: answerBlocksOf(content) },
})

export const isOptioned = (content: QuestionContent): content is OptionedQuestionContent => 'options' in content

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
  [...Object.values(section.questions)].flatMap(field => withRevealedQuestions(field.content))

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
