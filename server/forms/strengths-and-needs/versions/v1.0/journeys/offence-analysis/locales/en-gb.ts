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
    [Question.offence_analysis_description_of_offence]: {
      text: 'Enter a brief description of the current index offence(s)',
      validation: 'Enter a brief description of the current index offence(s)',
    },
    [Question.offence_analysis_elements]: {
      text: 'Did the current index offence(s) have any of the following elements?',
      hint: 'Select all that apply.',
      option: {
        [Option.arson]: 'Arson',
        [Option.domestic_abuse]: 'Domestic abuse',
        [Option.excessive_or_sadistic_violence]: 'Excessive violence or sadistic violence',
        [Option.hatred_of_identifiable_groups]: 'Hatred of identifiable groups',
        [Option.physical_damage_to_property]: 'Physical damage to property',
        [Option.sexual_element]: 'Sexual element',
        [Option.victim_targeted]: 'Victim targeted',
        [Option.violence_or_coercion]: 'Violence, or threat of violence or coercion',
        [Option.weapon]: 'Weapon',
      },
      validation: 'Select if the offence(s) had any of the elements',
    },
    [Question.offence_weapon_details]: {
      text: 'What was the weapon? (optional)',
      validation: 'Weapon details must be 2000 characters or less',
    },
    [Question.offence_analysis_reason]: {
      text: 'Why did the current index offence(s) happen?',
      validation: 'Enter why the current index offence(s) happened',
    },
    [Question.offence_analysis_motivations]: {
      text: 'Did the current index offence(s) involve any of the following motivations?',
      hint: 'Select all that apply.',
      option: {
        [Option.addictions_or_perceived_needs]: 'Addictions or perceived needs',
        [Option.pressurised_by_others]: 'Being pressurised or led into offending by others',
        [Option.emotional_state]: 'Emotional state of %1',
        [Option.financial_motivation]: 'Financial motivation',
        [Option.hatred_of_identifiable_groups]: 'Hatred of identifiable groups',
        [Option.seeking_or_exerting_power]: 'Seeking or exerting power',
        [Option.sexual_motivation]: 'Sexual motivation',
        [Option.thrill_seeking]: 'Thrill seeking',
      },
      validation: 'Select if the offence(s) involved any of the following motivations',
    },
    [Question.offence_analysis_who_was_the_victim]: {
      text: 'Who was the offence committed against?',
      option: {
        [Option.one_or_more_person]: 'One or more people',
        [CommonOption.other]: {
          hint: 'For example, a business or the wider community.',
        },
      },
      validation: 'Select who the offence was committed against',
    },
    [Question.offence_analysis_victim_relationship]: {
      text: 'Who is the victim?',
      option: {
        [Option.stranger]: 'A stranger',
        [Option.criminal_justice_staff]: 'Criminal justice staff',
        [Option.pop_parent_or_step_parent]: '%1 parent or step-parent',
        [Option.pop_partner]: '%1 partner',
        [Option.pop_ex_partner]: '%1 ex-partner',
        [Option.pop_child_or_step_child]: '%1 child or step-child',
        [Option.other_family_member]: 'Other family member',
      },
      validation: 'Select who the victim is',
    },
    [Question.offence_analysis_victim_age]: {
      text: "What is the victim's approximate age?",
      option: {
        [Option.age_0_to_4_years]: '0 to 4 years',
        [Option.age_5_to_11_years]: '5 to 11 years',
        [Option.age_12_to_15_years]: '12 to 15 years',
        [Option.age_16_to_17_years]: '16 to 17 years',
        [Option.age_18_to_20_years]: '18 to 20 years',
        [Option.age_21_to_25_years]: '21 to 25 years',
        [Option.age_26_to_49_years]: '26 to 49 years',
        [Option.age_50_to_64_years]: '50 to 64 years',
        [Option.age_65_and_over]: '65 years and over',
      },
      validation: 'Select approximate age',
    },
    [Question.offence_analysis_victim_sex]: {
      text: "What is the victim's sex?",
      option: {
        [Option.male]: 'Male',
        [Option.female]: 'Female',
        [Option.intersex]: 'Intersex',
      },
      validation: 'Select sex',
    },
    [Question.offence_analysis_victim_race]: {
      text: "What is the victim's ethnicity?",
      option_label: "Select the victim's ethnicity",
      option: {
        [Option.white_english_welsh_scottish_northern_irish_or_british]:
          'White - English, Welsh, Scottish, Northern Irish or British',
        [Option.white_irish]: 'White - Irish',
        [Option.white_gypsy_or_irish_traveller]: 'White - Gypsy or Irish Traveller',
        [Option.white_roma]: 'White - Roma',
        [Option.white_any_other_white_background]: 'White - Any other white background',
        [Option.mixed_white_and_black_caribbean]: 'Mixed - White and Black Caribbean',
        [Option.mixed_white_and_black_african]: 'Mixed - White and Black African',
        [Option.mixed_white_and_asian]: 'Mixed - White and Asian',
        [Option.mixed_any_other_mixed_or_multiple_ethnic_background_background]:
          'Mixed - Any other mixed or multiple ethnic background',
        [Option.asian_or_asian_british_indian]: 'Asian or Asian British - Indian',
        [Option.asian_or_asian_british_pakistani]: 'Asian or Asian British - Pakistani',
        [Option.asian_or_asian_british_bangladeshi]: 'Asian or Asian British - Bangladeshi',
        [Option.asian_or_asian_british_chinese]: 'Asian or Asian British - Chinese',
        [Option.asian_or_asian_british_any_other_asian_background]:
          'Asian or Asian British - Any other Asian background',
        [Option.black_or_black_british_caribbean]: 'Black or Black British - Caribbean',
        [Option.black_or_black_british_african]: 'Black or Black British - African',
        [Option.black_or_black_british_any_other_black_background]:
          'Black or Black British - Any other Black background',
        [Option.arab]: 'Arab',
        [Option.any_other_ethnic_group]: 'Any other ethnic group',
      },
      validation: "Select the victim's ethnicity",
    },
    [Question.offence_analysis_how_many_involved]: {
      text: 'How many other people were involved with committing the current index offence(s)?',
      option: {
        [Option.one]: '1',
        [Option.two]: '2',
        [Option.three]: '3',
        [Option.four]: '4',
        [Option.five]: '5',
        [Option.six_to_ten]: '6 to 10',
        [Option.eleven_to_fifteen]: '11 to 15',
        [Option.more_than_fifteen]: 'More than 15',
      },
      validation: 'Select how many other people were involved in the offence',
    },
    [Question.offence_analysis_impact_on_victims]: {
      text: 'Does %1 recognise the impact on the victims or wider community?',
      validation:
        'Select if they recognise the impact on the victim or consequences for others and the wider community',
    },
    [Question.offence_analysis_leader]: {
      text: 'Was %1 the leader of the current index offence(s)?',
      validation: 'Select if they were the leader',
    },
    [Question.offence_analysis_accept_responsibility]: {
      text: 'Does %1 accept responsibility for the current index offence(s)?',
      validation: 'Select if they accept responsibility for the current offence(s)',
    },
    [Question.offence_analysis_escalation]: {
      text: 'Is there an escalation in seriousness from previous offending?',
      validation: 'Select if the current offence(s) are an escalation in seriousness from previous offending',
    },
    [Question.offence_analysis_perpetrator_of_domestic_abuse]: {
      text: 'Is there evidence that %1 has ever been a perpetrator of domestic abuse?',
      validation: 'Select if there is any evidence that they have ever been perpetrator of domestic abuse',
    },
    [Question.offence_analysis_perpetrator_of_domestic_abuse_type]: {
      text: 'Who was this committed against?',
    },
    [Question.offence_analysis_victim_of_domestic_abuse]: {
      text: 'Is there evidence that %1 has ever been a victim of domestic abuse?',
      validation: 'Select if there is evidence that they have ever been victim of domestic abuse',
    },
    [Question.offence_analysis_victim_of_domestic_abuse_type]: {
      text: 'Who was this committed by?',
    },
    [Question.offence_analysis_patterns_of_offending]: {
      text: 'What are the patterns of offending?',
      hint: 'Analyse whether the current index offence(s) is (or are) part of a wider pattern of offending and identify any established or emerging themes. You do not need to list all previous convictions.',
    },
    [Question.offence_analysis_risk]: {
      text: 'Are the current or previous offences linked to risk of serious harm, risks to the individual or other risks?',
      validation: 'Select if the offence is linked to risk of serious harm, risks to the individual or other risks',
    },
  },
  option: {
    [Option.family_member]: 'Family member',
    [Option.intimate_partner]: 'Intimate partner',
    [Option.family_member_and_intimate_partner]: 'Family member and intimate partner',
  },
  are_you_sure_you_want_to_delete: 'Are you sure you want to delete the victim details?',
  victim_card_title: '%1 victim',
  validation: {
    select_an_option: 'Select an option',
    add_one_or_more_victims: 'Add one or more victims',
  },
  fallback: {
    there_are_no_victims: 'There are no victims.',
  },
}

export type OffenceAnalysisLocale = typeof english
