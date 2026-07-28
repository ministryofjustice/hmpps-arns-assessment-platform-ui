import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'
import { CommonOption } from '../../../constants/commonOption'

export const english = {
  step: {
    [Step.offence_analysis.code]: 'Offence analysis',
    [Step.offence_analysis_summary.code]: 'Offence analysis summary',
    [Step.offence_analysis_victim.code]: 'Offence analysis victim',
    [Step.offence_analysis_analysis.code]: 'Offence analysis',
  },
  question: {
    [Question.offence_analysis_index_offence_description]: {
      text: 'Enter a brief description of the current index offence(s)',
      validation: 'Enter a brief description of the current index offence(s)',
    },
    [Question.offence_analysis_offence_elements]: {
      text: 'Did the current index offence(s) have any of the following elements?',
      hint: 'Select all that apply.',
      option: {
        [Option.arson]: 'Arson',
        [Option.domestic_abuse]: 'Domestic abuse',
        [Option.excessive_violence_sadistic]: 'Excessive violence or sadistic violence',
        [Option.hatred_identifiable_groups]: 'Hatred of identifiable groups',
        [Option.physical_damage_property]: 'Physical damage to property',
        [Option.sexual_element]: 'Sexual element',
        [Option.victim_targeted]: 'Victim targeted',
        [Option.violence_threat_coercion]: 'Violence, or threat of violence or coercion',
        [Option.weapon]: 'Weapon',
        [Option.none]: 'None',
      },
      validation: 'Select if the offence(s) had any of the elements',
    },
    [Question.offence_analysis_weapon_details]: {
      text: 'What was the weapon? (optional)',
      validation: 'Weapon details must be 2000 characters or less',
    },
    [Question.offence_analysis_why_offence_happened]: {
      text: 'Why did the current index offence(s) happen?',
      validation: 'Enter why the current index offence(s) happened',
    },
    [Question.offence_analysis_motivations]: {
      text: 'Did the current index offence(s) involve any of the following motivations?',
      hint: 'Select all that apply.',
      option: {
        [Option.addictions_perceived_needs]: 'Addictions or perceived needs',
        [Option.pressurised_led_by_others]: 'Being pressurised or led into offending by others',
        [Option.emotional_state_christy]: 'Emotional state of Christy',
        [Option.financial_motivation]: 'Financial motivation',
        [Option.hatred_identifiable_groups]: 'Hatred of identifiable groups',
        [Option.seeking_exerting_power]: 'Seeking or exerting power',
        [Option.sexual_motivation]: 'Sexual motivation',
        [Option.thrill_seeking]: 'Thrill seeking',
      },
      validation: 'Select if the offence(s) involved any of the following motivations',
    },
    [Question.offence_analysis_commited_against]: {
      text: 'Who was the offence committed against?',
      option: {
        [Option.one_or_more_people]: 'One or more people',
        [CommonOption.other]: {
          hint: 'For example, a business or the wider community.',
        },
      },
      validation: 'Select who the victim is',
    },
    [Question.offence_analysis_victim_type]: {
      text: 'Who is the victim?',
      option: {
        [Option.stranger]: 'A stranger',
        [Option.criminal_justice_staff]: 'Criminal justice staff',
        [Option.parent_or_step_parent]: '%1 parent or step-parent',
        [Option.partner]: '%1 partner',
        [Option.ex_partner]: '%1 ex-partner',
        [Option.child_or_step_child]: '%1 child or step-child',
        [Option.other_family_member]: 'Other family member',
      },
      validation: 'Select who the victim is',
    },
    [Question.offence_analysis_victim_age]: {
      text: "What is the victim's approximate age?",
      option: {
        [Option.age_0_to_4]: '0 to 4 years',
        [Option.age_5_to_11]: '5 to 11 years',
        [Option.age_12_to_15]: '12 to 15 years',
        [Option.age_16_to_17]: '16 to 17 years',
        [Option.age_18_to_20]: '18 to 20 years',
        [Option.age_21_to_25]: '21 to 25 years',
        [Option.age_26_to_49]: '26 to 49 years',
        [Option.age_50_to_64]: '50 to 64 years',
        [Option.age_65_and_over]: '65 years and over',
        [Option.age_unknown]: 'Unknown',
      },
      validation: "Select approximate age",
    },
    [Question.offence_analysis_victim_sex]: {
      text: "What is the victim's sex?",
      option: {
        [Option.male]: 'Male',
        [Option.female]: 'Female',
        [Option.intersex]: 'Intersex',
        [Option.sex_unknown]: 'Unknown',
      },
      validation: "Select sex",
    },
    [Question.offence_analysis_victim_ethnicity]: {
      text: "What is the victim's ethnicity?",
      option_label: "Select the victim's ethnicity",
      option: {
        [Option.white_english_welsh_scottish_northern_irish_or_british]: 'White - English, Welsh, Scottish, Northern Irish or British',
        [Option.white_irish]: 'White - Irish',
        [Option.white_gypsy_or_irish_traveller]: 'White - Gypsy or Irish Traveller',
        [Option.white_roma]: 'White - Roma',
        [Option.white_any_other_white_background]: 'White - Any other white background',
        [Option.mixed_white_and_black_caribbean]: 'Mixed - White and Black Caribbean',
        [Option.mixed_white_and_black_african]: 'Mixed - White and Black African',
        [Option.mixed_white_and_asian]: 'Mixed - White and Asian',
        [Option.mixed_any_other_mixed_or_multiple_ethnic_background_background]: 'Mixed - Any other mixed or multiple ethnic background',
        [Option.asian_or_asian_british_indian]: 'Asian or Asian British - Indian',
        [Option.asian_or_asian_british_pakistani]: 'Asian or Asian British - Pakistani',
        [Option.asian_or_asian_british_bangladeshi]: 'Asian or Asian British - Bangladeshi',
        [Option.asian_or_asian_british_chinese]: 'Asian or Asian British - Chinese',
        [Option.asian_or_asian_british_any_other_asian_background]: 'Asian or Asian British - Any other Asian background',
        [Option.black_or_black_british_caribbean]: 'Black or Black British - Caribbean',
        [Option.black_or_black_british_african]: 'Black or Black British - African',
        [Option.black_or_black_british_any_other_black_background]: 'Black or Black British - Any other Black background',
        [Option.arab]: 'Arab',
        [Option.any_other_ethnic_group]: 'Any other ethnic group',
      },
      validation: "Select the victim's ethnicity",
    },
    [Question.offence_analysis_strengths_protective_factors]: {
      text: 'Are there any strengths or protective factors?',
      option: {
        yes: 'Yes',
        no: 'No',
      },
      validation: 'Select whether there are strengths or protective factors',
    },
    [Question.offence_analysis_strengths_protective_factors_yes_details]: {
      text: 'Describe the strengths or protective factors',
    },
    [Question.offence_analysis_strengths_protective_factors_no_details]: {
      text: 'Explain why there are no strengths or protective factors',
    },
    [Question.offence_analysis_risk_of_serious_harm]: {
      text: 'Is there a risk of serious harm?',
      option: {
        yes: 'Yes',
        no: 'No',
      },
      validation: 'Select whether there is a risk of serious harm',
    },
    [Question.offence_analysis_risk_of_serious_harm_yes_details]: {
      text: 'Describe the risk of serious harm',
    },
    [Question.offence_analysis_risk_of_serious_harm_no_details]: {
      text: 'Explain why there is no risk of serious harm',
    },
    [Question.offence_analysis_risk_of_reoffending]: {
      text: 'Is there a risk of reoffending?',
      option: {
        yes: 'Yes',
        no: 'No',
      },
      validation: 'Select whether there is a risk of reoffending',
    },
    [Question.offence_analysis_risk_of_reoffending_yes_details]: {
      text: 'Describe the risk of reoffending',
    },
    [Question.offence_analysis_risk_of_reoffending_no_details]: {
      text: 'Explain why there is no risk of reoffending',
    },
  },
  are_you_sure_you_want_to_delete: 'Are you sure you want to delete the victim details?',
  victim_card_title: '%1 victim',
}

export type OffenceAnalysisLocale = typeof english
