import {
  and,
  Answer,
  block,
  Condition,
  Format,
  not,
  or,
  Request,
  Self,
  Transformer,
  validation,
} from '@ministryofjustice/hmpps-forge/core/authoring'
import {
  GovUKBody,
  GovUKButton,
  GovUKCharacterCount,
  GovUKLinkButton,
  GovUKRadioInput,
  GovUKSummaryList,
  GovUKTabs,
} from '@ministryofjustice/hmpps-forge/govuk-components'
import { HtmlBlock } from '@ministryofjustice/hmpps-forge/core/components'
import locale from '../../locale.json'
import { StrengthsAndNeedsTransformers } from '../../../../../../transformers'
import { SANGenerators } from '../../../../../../generators'
import {
  financeBankAccount,
  financeChanges,
  financeDebt,
  financeGambling,
  financeIncome,
  financeMoneyManagement,
  yesTypeOfDebt,
} from '../finance/fields'
import { StrengthsAndNeedsConditions } from '../../../../../../conditions'
import { CaseData } from '../../../../constants/formVersion'

const PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT = 1425

const contentWith =
  (content: Record<string, any>) =>
  (code: string, ...replacements: any[]) =>
    Request.Headers('accept-language').pipe(StrengthsAndNeedsTransformers.ContentFor(content, code, ...replacements))
const contentFor = contentWith(locale)

const createSummaryRow = (parent: string, items: any, option: string): HtmlBlock =>
  GovUKBody({
    text: SANGenerators.getTextFromListDefinition(items, option),
    visibleWhen: or(
      and(
        Answer(parent).match(StrengthsAndNeedsConditions.IsArray()),
        Answer(parent).match(Condition.Array.Contains(option)),
      ),
      and(
        Answer(parent).not.match(StrengthsAndNeedsConditions.IsArray()),
        Answer(parent).match(Condition.Equals(option)),
      ),
    ),
  })

const createSummaryRowFor = (parent: string, items: any) => (option: string) => createSummaryRow(parent, items, option)

const createSummaryDetailsRow = (field: string) =>
  GovUKBody({
    text: Answer(field),
    size: 's',
  })

const createSummaryRowForFinanceIncome = createSummaryRowFor('finance_income', financeIncome.items)
const createSummaryRowForFinanceMoneyManagement = createSummaryRowFor(
  'finance_money_management',
  financeMoneyManagement.items,
)
const createSummaryRowForFinanceGambling = createSummaryRowFor('finance_gambling', financeGambling.items)
const createSummaryRowForFinanceDebt = createSummaryRowFor('finance_debt', financeDebt.items)
const createSummaryRowForFinanceChanges = createSummaryRowFor('finance_changes', financeChanges.items)

export const financeSummary = GovUKSummaryList({
  rows: [
    {
      key: { text: Format('Where does %1 currently get their money from?', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceIncome('CARERS_ALLOWANCE'),
          createSummaryRowForFinanceIncome('DISABILITY_BENEFITS'),
          createSummaryRowForFinanceIncome('EMPLOYMENT'),
          createSummaryRowForFinanceIncome('FAMILY_OR_FRIENDS'),
          [
            { option: 'YES', text: 'Yes, over reliant on friends and family for money' },
            { option: 'NO', text: 'No, not over reliant on friends and family for money' },
            { option: 'UNKNOWN', text: 'Unknown if they’re over reliant on friends and family for money' },
          ].map(({ option, text }) =>
            GovUKBody({
              text,
              visibleWhen: and(
                Answer('finance_income_family_or_friends_details').match(Condition.IsRequired()),
                Answer('finance_income_family_or_friends_details').match(Condition.Equals(option)),
              ),
              size: 's',
            }),
          ),
          createSummaryRowForFinanceIncome('PENSION'),
          createSummaryRowForFinanceIncome('STUDENT_LOAN'),
          createSummaryRowForFinanceIncome('UNDECLARED'),
          createSummaryRowForFinanceIncome('WORK_RELATED_BENEFITS'),
          createSummaryRowForFinanceIncome('OTHER'),
          createSummaryDetailsRow('finance_income_other_details'),
          createSummaryRowForFinanceIncome('UNKNOWN'),
          createSummaryRowForFinanceIncome('NO_MONEY'),
          createSummaryDetailsRow('finance_income_no_money_details'),
        ].flat(),
      },
      actions: {
        items: [{ href: 'finance', text: 'Change' }],
      },
    },
    {
      key: { text: Format('Does %1 have their own bank account?', CaseData.Forename) },
      value: {
        blocks: ['YES', 'NO', 'UNKNOWN'].map(option =>
          createSummaryRow('finance_bank_account', financeBankAccount.items, option),
        ),
      },
      actions: {
        items: [{ href: 'finance', text: 'Change' }],
      },
    },
    {
      key: { text: Format('How good is %1 at managing their money?', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceMoneyManagement('GOOD'),
          createSummaryDetailsRow('finance_money_management_good_details'),
          createSummaryRowForFinanceMoneyManagement('FAIRLY_GOOD'),
          createSummaryDetailsRow('finance_money_management_fairly_good_details'),
          createSummaryRowForFinanceMoneyManagement('FAIRLY_BAD'),
          createSummaryDetailsRow('finance_money_management_fairly_bad_details'),
          createSummaryRowForFinanceMoneyManagement('BAD'),
          createSummaryDetailsRow('finance_money_management_bad_details'),
        ],
      },
      actions: {
        items: [{ href: 'finance', text: 'Change' }],
      },
    },
    {
      key: { text: Format('Is %1 affected by gambling?', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceGambling('YES_THEIR_GAMBLING'),
          createSummaryDetailsRow('finance_gambling_yes_their_gambling_details'),
          createSummaryRowForFinanceGambling('YES_SOMEONE_ELSES_GAMBLING'),
          createSummaryDetailsRow('finance_gambling_yes_someone_elses_gambling_details'),
          createSummaryRowForFinanceGambling('NO'),
          createSummaryRowForFinanceGambling('UNKNOWN'),
          createSummaryDetailsRow('finance_gambling_unknown_details'),
        ],
      },
      actions: {
        items: [{ href: 'finance', text: 'Change' }],
      },
    },
    {
      key: { text: Format('Is %1 affected by debt?', CaseData.Forename) },
      value: {
        blocks: [
          createSummaryRowForFinanceDebt('YES_THEIR_DEBT'),
          ['DEBT_TO_OTHERS', 'FORMAL_DEBT']
            .map(option => [
              createSummaryRow('yes_their_debt_type', yesTypeOfDebt.items, option),
              createSummaryDetailsRow(`yes_their_debt_type_${option.toLowerCase()}_details`),
            ]).flat(),
          createSummaryRowForFinanceDebt('YES_SOMEONE_ELSES_DEBT'),
          ['DEBT_TO_OTHERS', 'FORMAL_DEBT']
            .map(option => [
              createSummaryRow('yes_someone_elses_debt_type', yesTypeOfDebt.items, option),
              createSummaryDetailsRow(`yes_someone_elses_debt_type_${option.toLowerCase()}_details`),
            ]).flat(),
          createSummaryRowForFinanceDebt('NO'),
          createSummaryRowForFinanceDebt('UNKNOWN'),
          createSummaryDetailsRow('finance_debt_unknown_details'),
        ].flat(),
      },
      actions: {
        items: [{ href: 'finance', text: 'Change' }],
      },
    },
    {
      key: { text: Format('Does %1 want to make changes to their finance?', CaseData.Forename) },
      value: {
        blocks: [
          [
            'HAS_MADE_CHANGES',
            'IS_MAKING_CHANGES',
            'WANTS_TO_MAKE_CHANGES_KNOWS_HOW_TO',
            'WANTS_TO_MAKE_CHANGES_NEEDS_HELP',
            'THINKING_ABOUT_MAKING_CHANGES',
            'DOES_NOT_WANT_TO_MAKE_CHANGES',
            'DOES_NOT_WANT_TO_ANSWER',
          ]
            .map(option => [
              createSummaryRowForFinanceChanges(option),
              createSummaryDetailsRow(`finance_changes_${option.toLowerCase()}_details`),
            ]).flat(),
          createSummaryRowForFinanceChanges('NOT_PRESENT'),
          createSummaryRowForFinanceChanges('NOT_APPLICABLE'),
        ].flat(),
      },
      actions: {
        items: [{ href: 'finance', text: 'Change' }],
      },
    },
  ],
})

const goToPractitionerAnalysis = GovUKLinkButton({
  text: 'Go to practitioner analysis',
  href: 'finance-summary#practitioner-analysis',
  classes: 'govuk-button--secondary',
})

const strengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: 'strengths_protective_factors_details',
  label: contentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer('strengths_protective_factors').match(Condition.IsRequired()),
    Answer('strengths_protective_factors').match(Condition.Equals('YES')),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Give details on strengths or protective factors related to their finance',
    }),
  ],
})

const noStrengthsProtectiveFactorsDetails = GovUKCharacterCount({
  code: 'no_strengths_protective_factors_details',
  label: contentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer('strengths_protective_factors').match(Condition.Equals('NO')),
})

export const strengthsOrProtectiveFactors = GovUKRadioInput({
  code: 'strengths_protective_factors',
  fieldset: {
    legend: {
      text: contentFor('practitioner_analysis.strengths_protective_factors.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  hint: 'Include any strategies, people or support networks that helped.',
  items: [
    { value: 'YES', text: contentFor('options.YES'), block: strengthsProtectiveFactorsDetails },
    { value: 'NO', text: contentFor('options.NO'), block: noStrengthsProtectiveFactorsDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if there are any strengths or protective factors',
    }),
  ],
})

const seriousHarmDetails = GovUKCharacterCount({
  code: 'serious_harm_details',
  label: contentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer('finance_linked_to_serious_harm').match(Condition.IsRequired()),
    Answer('finance_linked_to_serious_harm').match(Condition.Equals('YES')),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Give details on the risk of serious harm',
    }),
  ],
})

const noSeriousHarmDetails = GovUKCharacterCount({
  code: 'no_serious_harm_details',
  label: contentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer('finance_linked_to_serious_harm').match(Condition.Equals('NO')),
})

export const linkedToSeriousHarm = GovUKRadioInput({
  code: 'finance_linked_to_serious_harm',
  fieldset: {
    legend: {
      text: contentFor('practitioner_analysis.finance_linked_to_serious_harm.text', CaseData.ForenamePossessive),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: contentFor('options.YES'), block: seriousHarmDetails },
    { value: 'NO', text: contentFor('options.NO'), block: noSeriousHarmDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if linked to risk of serious harm',
    }),
  ],
})

const riskOfReoffendingDetails = GovUKCharacterCount({
  code: 'risk_of_reoffending_details',
  label: contentFor('required_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: and(
    Answer('finance_linked_to_reoffending').match(Condition.IsRequired()),
    Answer('finance_linked_to_reoffending').match(Condition.Equals('YES')),
  ),
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Give details on the risk of reoffending',
    }),
  ],
})

const noRiskOfReoffendingDetails = GovUKCharacterCount({
  code: 'no_risk_of_reoffending_details',
  label: contentFor('optional_details'),
  maxLength: PRACTITIONER_ANALYSIS_DETAILS_CHARACTER_LIMIT,
  dependentWhen: Answer('finance_linked_to_reoffending').match(Condition.Equals('NO')),
})

export const linkedToReoffending = GovUKRadioInput({
  code: 'finance_linked_to_reoffending',
  fieldset: {
    legend: {
      text: contentFor('practitioner_analysis.finance_linked_to_reoffending.text').pipe(
        Transformer.String.Replace('%1', CaseData.ForenamePossessive),
      ),
      classes: 'govuk-fieldset__legend--m',
    },
  },
  items: [
    { value: 'YES', text: contentFor('options.YES'), block: riskOfReoffendingDetails },
    { value: 'NO', text: contentFor('options.NO'), block: noRiskOfReoffendingDetails },
  ],
  validWhen: [
    validation({
      condition: not(Self().not.match(Condition.IsRequired())),
      message: 'Select if linked to risk of reoffending',
    }),
  ],
})

const markAsCompleteButton = block<GovUKButton>({
  variant: 'govukButton',
  text: 'Mark as complete',
  name: 'action',
  value: 'save',
})

export const summaryTab = GovUKTabs({
  id: 'summaries',
  items: [
    {
      id: 'summary',
      label: 'Summary',
      panel: { blocks: [financeSummary, goToPractitionerAnalysis] },
    },
    {
      id: 'practitioner-analysis',
      label: 'Practitioner analysis',
      panel: {
        blocks: [strengthsOrProtectiveFactors, linkedToSeriousHarm, linkedToReoffending, markAsCompleteButton],
      },
    },
  ],
})
