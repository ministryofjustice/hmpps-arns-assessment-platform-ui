import { Answer, Condition, Self, validation } from '@ministryofjustice/hmpps-forge/core/authoring'
import { GovUKCharacterCount, GovUKSelectInput, GovUKTextInput } from '@ministryofjustice/hmpps-forge/govuk-components'
import {
  checkboxField,
  ParentOption,
  question,
  QuestionContent,
  QuestionFormat,
  radioDetails,
  radioField,
  revealedQuestion,
} from '../../../../constants/questionContent'
import {
  characterCountField,
  itemisedSummaryRow,
  optionalDetails,
  requiredDetails,
  textSummaryRow,
  yesNo,
} from '../../constants/questionContent'
import { CaseData } from '../../constants/formVersion'
import { CommonOption } from '../../constants/commonOption'
import { Section } from '../../constants/section'
import { Question } from './constants/question'
import { Option } from './constants/option'
import { Step } from './constants/step'
import { collectionName } from './constants/constants'
import { commonContentFor } from '../../locales'
import { contentFor } from './locales'

// --- Index Offence Description ---

const indexOffenceDescription = question({
  content: {
    code: Question.offence_analysis_description_of_offence,
    format: QuestionFormat.TEXT,
    text: contentFor('question.offence_analysis_description_of_offence.text'),
    validationMessage: commonContentFor('validation.enter_details'),
  },
  displayModes: {
    field: characterCountField({ maxLength: 4000 }),
    summaryRow: textSummaryRow({ changeHref: Step.offence_analysis.path }),
  },
})

// --- Offence Elements ---

// The revealed detail for "weapon" is a plain (optional) text input, not the
// standard character-count reveal, so it's written by hand.
const weaponDetailsRevealed = revealedQuestion({
  content: {
    code: Question.offence_weapon_details,
    format: QuestionFormat.TEXT,
    text: contentFor('question.offence_weapon_details.text'),
  },
  displayModes: {
    field: (content, parent) =>
      GovUKTextInput({
        code: content.code,
        label: { text: content.text },
        dependentWhen: parent.selectedWhen,
        validWhen: [
          validation({
            condition: Self().match(Condition.String.HasMaxLength(2000)),
            message: contentFor('question.offence_weapon_details.validation'),
          }),
        ],
      }),
  },
})

const offenceElements = question({
  content: {
    code: Question.offence_analysis_elements,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.offence_analysis_elements.text'),
    hint: contentFor('question.offence_analysis_elements.hint'),
    options: [
      { value: Option.arson, text: contentFor('question.offence_analysis_elements.option.ARSON') },
      {
        value: Option.domestic_abuse,
        text: contentFor('question.offence_analysis_elements.option.DOMESTIC_ABUSE'),
      },
      {
        value: Option.excessive_violence_sadistic,
        text: contentFor('question.offence_analysis_elements.option.EXCESSIVE_VIOLENCE_SADISTIC'),
      },
      {
        value: Option.hatred_identifiable_groups,
        text: contentFor('question.offence_analysis_elements.option.HATRED_IDENTIFIABLE_GROUPS'),
      },
      {
        value: Option.physical_damage_property,
        text: contentFor('question.offence_analysis_elements.option.PHYSICAL_DAMAGE_PROPERTY'),
      },
      {
        value: Option.sexual_element,
        text: contentFor('question.offence_analysis_elements.option.SEXUAL_ELEMENT'),
      },
      {
        value: Option.victim_targeted,
        text: contentFor('question.offence_analysis_elements.option.VICTIM_TARGETED'),
        reveals: requiredDetails({
          code: Question.offence_victim_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
      {
        value: Option.violence_threat_coercion,
        text: contentFor('question.offence_analysis_elements.option.VIOLENCE_THREAT_COERCION'),
      },
      {
        value: Option.weapon,
        text: contentFor('question.offence_analysis_elements.option.WEAPON'),
        reveals: weaponDetailsRevealed,
      },
      { divider: 'or' },
      {
        value: Option.none,
        text: commonContentFor('option.NONE'),
        behaviour: 'exclusive' as const,
      },
    ],
    validationMessage: contentFor('question.offence_analysis_elements.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis.path }),
  },
})

// --- Why Offence Happened ---

const whyOffenceHappened = question({
  content: {
    code: Question.offence_analysis_why_offence_happened,
    format: QuestionFormat.TEXT,
    text: contentFor('question.offence_analysis_why_offence_happened.text'),
    validationMessage: commonContentFor('validation.enter_details'),
  },
  displayModes: {
    field: characterCountField({ maxLength: 4000 }),
    summaryRow: textSummaryRow({ changeHref: Step.offence_analysis.path }),
  },
})

// --- Motivations ---

const motivations = question({
  content: {
    code: Question.offence_analysis_motivations,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.offence_analysis_motivations.text'),
    hint: contentFor('question.offence_analysis_motivations.hint'),
    options: [
      {
        value: Option.addictions_perceived_needs,
        text: contentFor('question.offence_analysis_motivations.option.ADDICTIONS_PERCEIVED_NEEDS'),
      },
      {
        value: Option.pressurised_led_by_others,
        text: contentFor('question.offence_analysis_motivations.option.PRESSURISED_LED_BY_OTHERS'),
      },
      {
        value: Option.emotional_state_christy,
        text: contentFor('question.offence_analysis_motivations.option.EMOTIONAL_STATE_CHRISTY'),
      },
      {
        value: Option.financial_motivation,
        text: contentFor('question.offence_analysis_motivations.option.FINANCIAL_MOTIVATION'),
      },
      {
        value: Option.hatred_identifiable_groups,
        text: contentFor('question.offence_analysis_motivations.option.HATRED_IDENTIFIABLE_GROUPS'),
      },
      {
        value: Option.seeking_exerting_power,
        text: contentFor('question.offence_analysis_motivations.option.SEEKING_EXERTING_POWER'),
      },
      {
        value: Option.sexual_motivation,
        text: contentFor('question.offence_analysis_motivations.option.SEXUAL_MOTIVATION'),
      },
      { value: Option.thrill_seeking, text: contentFor('question.offence_analysis_motivations.option.THRILL_SEEKING') },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_motivations_other_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 200,
        }),
      },
    ],
    validationMessage: contentFor('question.offence_analysis_motivations.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis.path }),
  },
})

// --- Offence Committed Against ---

// Mismatched on purpose, preserved from the original: the field allows up to
// 2000 characters but validation only accepts up to 200 (message still says
// 2000). Pre-existing behaviour, not changed here.
const offenceCommitedAgainstOtherDetailsRevealed = revealedQuestion({
  content: {
    code: Question.offence_analysis_commited_against_other_details,
    format: QuestionFormat.TEXT,
    text: commonContentFor('required_details'),
  },
  displayModes: {
    field: (content, parent) =>
      GovUKCharacterCount({
        code: content.code,
        label: content.text,
        maxLength: 2000,
        dependentWhen: parent.selectedWhen,
        validWhen: [
          validation({
            condition: Self().match(Condition.IsRequired()),
            message: commonContentFor('validation.enter_details'),
          }),
          validation({
            condition: Self().match(Condition.String.HasMaxLength(200)),
            message: commonContentFor('validation.details_must_be_less_than', 2000),
          }),
        ],
      }),
  },
})

const offenceCommitedAgainst = question({
  content: {
    code: Question.offence_analysis_commited_against,
    format: QuestionFormat.CHECKBOX,
    text: contentFor('question.offence_analysis_commited_against.text'),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      {
        value: Option.one_or_more_people,
        text: contentFor('question.offence_analysis_commited_against.option.ONE_OR_MORE_PEOPLE'),
      },
      {
        value: CommonOption.other,
        text: commonContentFor('option.OTHER'),
        hint: contentFor('question.offence_analysis_commited_against.option.OTHER.hint'),
        reveals: offenceCommitedAgainstOtherDetailsRevealed,
      },
    ],
    validationMessage: contentFor('question.offence_analysis_commited_against.validation'),
  },
  displayModes: {
    field: checkboxField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis.path }),
  },
})

// --- Involved Parties ---

const offenceAnalysisWhoWasTheOffenceCommittedAgainst = question({
  content: {
    code: Question.offence_analysis_who_was_the_victim,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_commited_against.text'),
    hint: commonContentFor('select_all_that_apply'),
    options: [
      { value: Option.none, text: contentFor('option.NONE') },
      { value: Option.one, text: contentFor('question.offence_analysis_who_was_the_victim.option.ONE') },
      { value: Option.two, text: contentFor('question.offence_analysis_who_was_the_victim.option.TWO') },
      { value: Option.three, text: contentFor('question.offence_analysis_who_was_the_victim.option.THREE') },
      { value: Option.four, text: contentFor('question.offence_analysis_who_was_the_victim.option.FOUR') },
      { value: Option.five, text: contentFor('question.offence_analysis_who_was_the_victim.option.FIVE') },
      {
        value: Option.six_to_ten,
        text: contentFor('question.offence_analysis_who_was_the_victim.option.SIX_TO_10'),
      },
      {
        value: Option.eleven_to_fifteen,
        text: contentFor('question.offence_analysis_who_was_the_victim.option.ELEVEN_TO_15'),
      },
      {
        value: Option.more_than_fifteen,
        text: contentFor('question.offence_analysis_who_was_the_victim.option.MORE_THAN_15'),
      },
    ],
    validationMessage: contentFor('question.offence_analysis_who_was_the_victim.validation'),
  },
  displayModes: {
    field: radioField({
      dependentWhen: Answer(Question.offence_analysis_commited_against).match(
        Condition.Array.Contains(CommonOption.other),
      ),
    }),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_involved_parties.path }),
  },
})

// --- Impact: Leader of current index offence group ---

const offenceAnalysisLeader = question({
  content: {
    code: Question.offence_analysis_leader,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_leader.text', CaseData.Forename),
    options: yesNo({
      // Mismatched on purpose, preserved from the original: the field allows
      // up to 2000 characters but validation checks up to 4000.
      yes: revealedQuestion({
        content: {
          code: Question.offence_analysis_leader_details,
          format: QuestionFormat.TEXT,
          text: commonContentFor('required_details'),
        },
        displayModes: {
          field: (content, parent) =>
            GovUKCharacterCount({
              code: content.code,
              label: content.text,
              maxLength: 2000,
              dependentWhen: parent.selectedWhen,
              validWhen: [
                validation({
                  condition: Self().match(Condition.String.HasMaxLength(4000)),
                  message: commonContentFor('validation.details_must_be_less_than', 4000),
                }),
                validation({
                  condition: Self().match(Condition.IsRequired()),
                  message: commonContentFor('validation.enter_details'),
                }),
              ],
            }),
        },
      }),
      no: revealedQuestion({
        content: {
          code: Question.no_offence_analysis_leader_details,
          format: QuestionFormat.TEXT,
          text: commonContentFor('optional_details'),
        },
        displayModes: {
          field: (content, parent) =>
            GovUKCharacterCount({
              code: content.code,
              label: content.text,
              maxLength: 2000,
              dependentWhen: parent.selectedWhen,
              validWhen: [
                validation({
                  condition: Self().match(Condition.String.HasMaxLength(4000)),
                  message: commonContentFor('validation.details_must_be_less_than', 4000),
                }),
              ],
            }),
        },
      }),
    }),
    validationMessage: contentFor('question.offence_analysis_leader.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Recognition of impact group ---

const offenceImpactOnVictims = question({
  content: {
    code: Question.offence_analysis_impact_on_victims,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_impact_on_victims.text', CaseData.Forename),
    options: yesNo({
      yes: optionalDetails({
        code: Question.offence_analysis_impact_on_victims_details,
        maxLength: 2000,
      }),
      no: optionalDetails({
        code: Question.no_offence_analysis_impact_on_victims_details,
        maxLength: 2000,
      }),
    }),
    validationMessage: contentFor('question.offence_analysis_impact_on_victims.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Responsibility for offence group ---

const offenceAnalysisAcceptResponsibility = question({
  content: {
    code: Question.offence_analysis_accept_responsibility,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_accept_responsibility.text', CaseData.Forename),
    options: yesNo({
      yes: optionalDetails({
        code: Question.offence_analysis_accept_responsibility_details,
        maxLength: 2000,
      }),
      no: optionalDetails({
        code: Question.no_offence_analysis_accept_responsibility_details,
        maxLength: 2000,
      }),
    }),
    validationMessage: contentFor('question.offence_analysis_accept_responsibility.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Escalation in seriousness group ---

const offenceAnalysisEscalation = question({
  content: {
    code: Question.offence_analysis_escalation,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_escalation.text'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: optionalDetails({ code: Question.offence_analysis_escalation_details, maxLength: 2000 }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        reveals: optionalDetails({ code: Question.no_offence_analysis_escalation_details, maxLength: 2000 }),
      },
      { value: CommonOption.not_applicable, text: commonContentFor('option.NOT_APPLICABLE') },
    ],
    validationMessage: contentFor('question.offence_analysis_escalation.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Perpetrator of domestic abuse group ---

const offenceAnalysisPerpetratorOfDomesticAbuseTypeRevealed = revealedQuestion({
  content: {
    code: Question.offence_analysis_perpetrator_of_domestic_abuse_type,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse_type.text'),
    options: [
      {
        value: Option.family_member,
        text: contentFor('option.FAMILY_MEMBER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_perpetrator_of_domestic_abuse_type_family_member_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
      {
        value: Option.intimate_partner,
        text: contentFor('option.INTIMATE_PARTNER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_perpetrator_of_domestic_abuse_type_intimate_partner_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
      {
        value: Option.family_member_and_intimate_partner,
        text: contentFor('option.FAMILY_MEMBER_AND_INTIMATE_PARTNER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_perpetrator_of_domestic_abuse_type_family_member_and_partner_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
    ],
    validationMessage: contentFor('validation.select_an_option'),
  },
  displayModes: { field: radioDetails() },
})

const offenceAnalysisPerpetratorOfDomesticAbuse = question({
  content: {
    code: Question.offence_analysis_perpetrator_of_domestic_abuse,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: offenceAnalysisPerpetratorOfDomesticAbuseTypeRevealed,
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.offence_analysis_perpetrator_of_domestic_abuse.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Victim of domestic abuse group ---

const offenceAnalysisVictimOfDomesticAbuseTypeRevealed = revealedQuestion({
  content: {
    code: Question.offence_analysis_victim_of_domestic_abuse_type,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_victim_of_domestic_abuse_type.text'),
    options: [
      {
        value: Option.family_member,
        text: contentFor('option.FAMILY_MEMBER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_victim_of_domestic_abuse_type_family_member_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
      {
        value: Option.intimate_partner,
        text: contentFor('option.INTIMATE_PARTNER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_victim_of_domestic_abuse_type_intimate_partner_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
      {
        value: Option.family_member_and_intimate_partner,
        text: contentFor('option.FAMILY_MEMBER_AND_INTIMATE_PARTNER'),
        reveals: requiredDetails({
          code: Question.offence_analysis_victim_of_domestic_abuse_type_family_member_and_partner_details,
          validationMessage: commonContentFor('validation.enter_details'),
          maxLength: 2000,
        }),
      },
    ],
    validationMessage: contentFor('validation.select_an_option'),
  },
  displayModes: { field: radioDetails() },
})

const offenceAnalysisVictimOfDomesticAbuse = question({
  content: {
    code: Question.offence_analysis_victim_of_domestic_abuse,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_victim_of_domestic_abuse.text', CaseData.Forename),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: offenceAnalysisVictimOfDomesticAbuseTypeRevealed,
      },
      { value: CommonOption.no, text: commonContentFor('option.NO') },
    ],
    validationMessage: contentFor('question.offence_analysis_victim_of_domestic_abuse.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Patterns of offending group ---

const patternsOfOffending = question({
  content: {
    code: Question.offence_analysis_patterns_of_offending,
    format: QuestionFormat.TEXT,
    text: contentFor('question.offence_analysis_patterns_of_offending.text'),
    hint: contentFor('question.offence_analysis_patterns_of_offending.hint'),
    validationMessage: commonContentFor('validation.enter_details'),
  },
  displayModes: {
    field: characterCountField({ maxLength: 4000 }),
    summaryRow: textSummaryRow({ changeHref: Step.offence_analysis_impact.path }),
  },
})

// --- Impact: Previous offences group ---

// Mismatched on purpose, preserved from the original: the field allows up to
// 2000 characters but validation checks up to 4000. Both branches are
// required, including "no" (the original labels it "required_details" too).
const offenceAnalysisRiskDetailsField = (content: QuestionContent, parent: ParentOption) =>
  GovUKCharacterCount({
    code: content.code,
    label: content.text,
    maxLength: 2000,
    dependentWhen: parent.selectedWhen,
    validWhen: [
      validation({
        condition: Self().match(Condition.String.HasMaxLength(4000)),
        message: commonContentFor('validation.details_must_be_less_than', 4000),
      }),
      validation({
        condition: Self().match(Condition.IsRequired()),
        message: commonContentFor('validation.enter_details'),
      }),
    ],
  })

const offenceAnalysisRisk = question({
  content: {
    code: Question.offence_analysis_risk,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_risk.text'),
    options: [
      {
        value: CommonOption.yes,
        text: commonContentFor('option.YES'),
        reveals: revealedQuestion({
          content: {
            code: Question.offence_analysis_risk_details,
            format: QuestionFormat.TEXT,
            text: commonContentFor('required_details'),
          },
          displayModes: { field: offenceAnalysisRiskDetailsField },
        }),
      },
      {
        value: CommonOption.no,
        text: commonContentFor('option.NO'),
        reveals: revealedQuestion({
          content: {
            code: Question.no_offence_analysis_risk_details,
            format: QuestionFormat.TEXT,
            text: commonContentFor('required_details'),
          },
          displayModes: { field: offenceAnalysisRiskDetailsField },
        }),
      },
    ],
    validationMessage: contentFor('question.offence_analysis_risk.validation'),
  },
  displayModes: {
    field: radioField(),
    summaryRow: itemisedSummaryRow({ changePath: Step.offence_analysis_impact.path }),
  },
})

// --- Victims (one item per victim; repeatable collection) ---

const victimType = question({
  content: {
    code: Question.offence_analysis_victim_type,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_victim_type.text'),
    options: [
      { value: Option.stranger, text: contentFor('question.offence_analysis_victim_type.option.STRANGER') },
      {
        value: Option.criminal_justice_staff,
        text: contentFor('question.offence_analysis_victim_type.option.CRIMINAL_JUSTICE_STAFF'),
      },
      {
        value: Option.parent_or_step_parent,
        text: contentFor(
          'question.offence_analysis_victim_type.option.PARENT_OR_STEP_PARENT',
          CaseData.ForenamePossessive,
        ),
      },
      {
        value: Option.partner,
        text: contentFor('question.offence_analysis_victim_type.option.PARTNER', CaseData.ForenamePossessive),
      },
      {
        value: Option.ex_partner,
        text: contentFor('question.offence_analysis_victim_type.option.EX_PARTNER', CaseData.ForenamePossessive),
      },
      {
        value: Option.child_or_step_child,
        text: contentFor(
          'question.offence_analysis_victim_type.option.CHILD_OR_STEP_CHILD',
          CaseData.ForenamePossessive,
        ),
      },
      {
        value: Option.other_family_member,
        text: contentFor('question.offence_analysis_victim_type.option.OTHER_FAMILY_MEMBER'),
      },
      { value: CommonOption.other, text: commonContentFor('option.OTHER') },
    ],
    validationMessage: contentFor('question.offence_analysis_victim_type.validation'),
  },
  displayModes: { field: radioField() },
})

const victimAge = question({
  content: {
    code: Question.offence_analysis_victim_age,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_victim_age.text'),
    options: [
      { value: Option.age_0_to_4, text: contentFor('question.offence_analysis_victim_age.option.AGE_0_TO_4') },
      { value: Option.age_5_to_11, text: contentFor('question.offence_analysis_victim_age.option.AGE_5_TO_11') },
      { value: Option.age_12_to_15, text: contentFor('question.offence_analysis_victim_age.option.AGE_12_TO_15') },
      { value: Option.age_16_to_17, text: contentFor('question.offence_analysis_victim_age.option.AGE_16_TO_17') },
      { value: Option.age_18_to_20, text: contentFor('question.offence_analysis_victim_age.option.AGE_18_TO_20') },
      { value: Option.age_21_to_25, text: contentFor('question.offence_analysis_victim_age.option.AGE_21_TO_25') },
      { value: Option.age_26_to_49, text: contentFor('question.offence_analysis_victim_age.option.AGE_26_TO_49') },
      { value: Option.age_50_to_64, text: contentFor('question.offence_analysis_victim_age.option.AGE_50_TO_64') },
      {
        value: Option.age_65_and_over,
        text: contentFor('question.offence_analysis_victim_age.option.AGE_65_AND_OVER'),
      },
      { value: Option.age_unknown, text: contentFor('question.offence_analysis_victim_age.option.AGE_UNKNOWN') },
    ],
    validationMessage: contentFor('question.offence_analysis_victim_age.validation'),
  },
  displayModes: { field: radioField() },
})

const victimSex = question({
  content: {
    code: Question.offence_analysis_victim_sex,
    format: QuestionFormat.RADIO,
    text: contentFor('question.offence_analysis_victim_sex.text'),
    options: [
      { value: Option.male, text: contentFor('question.offence_analysis_victim_sex.option.MALE') },
      { value: Option.female, text: contentFor('question.offence_analysis_victim_sex.option.FEMALE') },
      { value: Option.intersex, text: contentFor('question.offence_analysis_victim_sex.option.INTERSEX') },
      { value: Option.sex_unknown, text: contentFor('question.offence_analysis_victim_sex.option.SEX_UNKNOWN') },
    ],
    validationMessage: contentFor('question.offence_analysis_victim_sex.validation'),
  },
  displayModes: { field: radioField() },
})

// The select's item list carries two empty-value placeholder entries — a
// pre-existing duplicate (one translated and disabled/selected, one a plain
// hardcoded fallback) preserved verbatim from the original. `content.options`
// below dedupes them to one for FormConfig's sake; the rendered `field`
// keeps the original list exactly so the page is unchanged.
const victimEthnicitySelectItems = [
  {
    value: '',
    text: contentFor('question.offence_analysis_victim_ethnicity.option_label'),
    disabled: true,
    selected: true,
  },
  { text: 'Select the victim’s ethnicity', value: '' },
  {
    text: contentFor(
      'question.offence_analysis_victim_ethnicity.option.WHITE_ENGLISH_WELSH_SCOTTISH_NORTHERN_IRISH_OR_BRITISH',
    ),
    value: Option.white_english_welsh_scottish_northern_irish_or_british,
  },
  { text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_IRISH'), value: Option.white_irish },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_GYPSY_OR_IRISH_TRAVELLER'),
    value: Option.white_gypsy_or_irish_traveller,
  },
  { text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_ROMA'), value: Option.white_roma },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.WHITE_ANY_OTHER_WHITE_BACKGROUND'),
    value: Option.white_any_other_white_background,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_WHITE_AND_BLACK_CARIBBEAN'),
    value: Option.mixed_white_and_black_caribbean,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_WHITE_AND_BLACK_AFRICAN'),
    value: Option.mixed_white_and_black_african,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.MIXED_WHITE_AND_ASIAN'),
    value: Option.mixed_white_and_asian,
  },
  {
    text: contentFor(
      'question.offence_analysis_victim_ethnicity.option.MIXED_ANY_OTHER_MIXED_OR_MULTIPLE_ETHNIC_BACKGROUND_BACKGROUND',
    ),
    value: Option.mixed_any_other_mixed_or_multiple_ethnic_background_background,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_INDIAN'),
    value: Option.asian_or_asian_british_indian,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_PAKISTANI'),
    value: Option.asian_or_asian_british_pakistani,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_BANGLADESHI'),
    value: Option.asian_or_asian_british_bangladeshi,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_CHINESE'),
    value: Option.asian_or_asian_british_chinese,
  },
  {
    text: contentFor(
      'question.offence_analysis_victim_ethnicity.option.ASIAN_OR_ASIAN_BRITISH_ANY_OTHER_ASIAN_BACKGROUND',
    ),
    value: Option.asian_or_asian_british_any_other_asian_background,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.BLACK_OR_BLACK_BRITISH_CARIBBEAN'),
    value: Option.black_or_black_british_caribbean,
  },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.BLACK_OR_BLACK_BRITISH_AFRICAN'),
    value: Option.black_or_black_british_african,
  },
  {
    text: contentFor(
      'question.offence_analysis_victim_ethnicity.option.BLACK_OR_BLACK_BRITISH_ANY_OTHER_BLACK_BACKGROUND',
    ),
    value: Option.black_or_black_british_any_other_black_background,
  },
  { text: contentFor('question.offence_analysis_victim_ethnicity.option.ARAB'), value: Option.arab },
  {
    text: contentFor('question.offence_analysis_victim_ethnicity.option.ANY_OTHER_ETHNIC_GROUP'),
    value: Option.any_other_ethnic_group,
  },
  { text: commonContentFor('option.UNKNOWN'), value: CommonOption.unknown },
]

const victimEthnicity = question({
  content: {
    code: Question.offence_analysis_victim_ethnicity,
    format: QuestionFormat.SELECT,
    text: contentFor('question.offence_analysis_victim_ethnicity.text'),
    validationMessage: contentFor('question.offence_analysis_victim_ethnicity.validation'),
    // Deduped for FormConfig — see the comment on `victimEthnicitySelectItems` above.
    options: victimEthnicitySelectItems
      .filter((item, index, all) => item.value !== '' || all.findIndex(other => other.value === '') === index)
      .map(({ value, text }) => ({ value, text })),
  },
  displayModes: {
    field: content =>
      GovUKSelectInput({
        code: content.code,
        label: { text: content.text, classes: 'govuk-label--m' },
        items: victimEthnicitySelectItems,
        validWhen: [
          validation({
            condition: Self().match(Condition.IsRequired()),
            message: content.validationMessage,
          }),
        ],
      }),
  },
})

// Exported separately (as well as via `collections` below) so the victim
// add/edit steps can reference each field directly.
export const victimQuestions = { victimType, victimAge, victimSex, victimEthnicity }

export const offenceAnalysisSection = {
  code: Section.offence_analysis.code,
  questions: {
    indexOffenceDescription,
    offenceElements,
    whyOffenceHappened,
    motivations,
    offenceCommitedAgainst,
    offenceAnalysisWhoWasTheOffenceCommittedAgainst,
    offenceAnalysisLeader,
    offenceImpactOnVictims,
    offenceAnalysisAcceptResponsibility,
    offenceAnalysisEscalation,
    offenceAnalysisPerpetratorOfDomesticAbuse,
    offenceAnalysisVictimOfDomesticAbuse,
    patternsOfOffending,
    offenceAnalysisRisk,
  },
  // No practitioner-analysis step exists for offence analysis yet (unlike
  // every other section) — the question codes for it already exist in
  // ./constants/question.ts and ./locales, but nothing renders them.
  practitionerAnalysis: {},
  collections: [
    {
      code: collectionName,
      questions: victimQuestions,
    },
  ],
}
