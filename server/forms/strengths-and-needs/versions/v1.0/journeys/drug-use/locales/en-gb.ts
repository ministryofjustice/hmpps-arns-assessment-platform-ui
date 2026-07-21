import { Locale } from '../../../../../i18n'
import { Question } from '../constants/question'
import { Step } from '../constants/step'
import { Option } from '../constants/option'

export const english = {
  step: {
    [Step.drug_use.code]: 'Drug use',
    [Step.drug_use_summary.code]: 'Drug use summary',
    [Step.drug_use_analysis.code]: 'Drug use analysis',
  },
  question: {
    [Question.drug_use]: {
      text: 'Has %1 ever misused drugs?',
      hint: 'This includes illegal and prescription drugs.',
      validation: "Select if they've ever misused drugs",
    },
    [Question.drug_last_used]: {
      text: 'When did they last use %1?',
      hint: 'This includes illegal and prescription drugs.',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Select when they last used this drug',
    },
    [Question.other_drug_name]: {
      text: "Enter which other drug they've misused",
      hint: 'Add drug name',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: 'Drug name must be 200 characters or less',
    },
    [Question.select_misused_drugs]: {
      text: 'Which drugs has %1 misused?',
      hint: 'Select all that apply.',
      option: {
        [Option.last_six]: 'Used in the last 6 months',
        [Option.more_than_six]: 'Used more than 6 months ago',
      },
      validation: "Select which drugs they've misused",
    },
    [Question.how_often_used]: {
      text: 'How often is %1 using this drug?',
      code: 'how_often_used_%1',
      summaryText: 'How to record frequency',
      summaryHtml:
        '<p class="govuk-body"><strong>Daily:</strong> uses every day or most days.</p>' +
        '<p class="govuk-body"><strong>Weekly:</strong> uses once or more a week but not daily (for example, every Friday and Saturday night).</p>' +
        '<p class="govuk-body"><strong>Monthly:</strong> uses once or more a month but not every week.</p>' +
        '<p class="govuk-body govuk-!-margin-bottom-0"><strong>Occasionally:</strong> uses less than once a month.</p>',
      option: {
        [Option.daily]: 'Daily',
        [Option.weekly]: 'Weekly',
        [Option.monthly]: 'Monthly',
        [Option.occasionally]: 'Occasionally',
      },
      validation: "Select how often they're using this drug",
    },
    [Question.drug_use_more_than_six_months_details]: {
      text: 'Give details about %1 use of these drugs',
      hint: 'For example, how often they used these drugs, when they stopped using, and if their use was an issue.',
      validation: 'Enter details about their use of these drugs',
    },
    [Question.drugs_injected]: {
      text: 'Which drugs has %1 injected?',
      hint: 'For example, how often they used these drugs, when they stopped using, and if their use was an issue.',
      validation: "Select which drugs they've injected, or select 'None'",
    },
    [Question.drugs_injected_months]: {
      code: 'drugs_injected_%1',
      text: 'When has Hassan injected this drug?',
      hint: 'For example, how often they used these drugs, when they stopped using, and if their use was an issue.',
      validation: "Select which drugs they've injected, or select 'None'",

    },
    [Question.receiving_treatment]: {
      text: 'Is %1 receiving treatment for their drug use?',
      hint: 'For example, how often they used these drugs, when they stopped using, and if their use was an issue.',
      validation: "Select if they're receiving treatment for their drug use",
    },
    [Question.receiving_treatment_yes_details]: {
      validation: 'Enter details about the treatment they are receiving',
    },
    [Question.drugs_reasons_for_use]: {
      text: {
        default: 'Why did %1 use drugs?',
        usedLastSixMonths: 'Why does %1 use drugs?',
      },
      hint: 'Consider why they started using, their history, and any triggers. Select all that apply.',
      option: {
        [Option.cultural_or_religious]: 'Cultural or religious practice',
        [Option.curiosity_or_experimentation]: 'Curiosity or experimentation',
        [Option.enhance_performance]: 'Enhance performance',
        [Option.escapism_or_avoidance]: 'Escapism or avoidance',
        [Option.managing_emotional_issues]: 'Manage stress or emotional issues',
        [Option.peer_pressure]: 'Peer pressure or social influence',
        [Option.recreation_or_pleasure]: 'Recreation or pleasure',
        [Option.self_medication]: 'Self-medication',
      },
      validation: {
        default: 'Select why they use drugs',
        usedLastSixMonths: 'Select why they used drugs',
      },
    },
    [Question.drugs_reasons_for_use_details]: {
      text: 'Details on why %1 uses drugs',
    },
    [Question.drugs_affected_their_life]: {
      text: "How has %1's drug use affected their life?",
      option: {
        [Option.behaviour]: {
          text: 'Behaviour',
          hint: 'Includes unemployment, disruption on education or lack of productivity.',
        },
        [Option.community]: {
          text: 'Community',
          hint: 'Includes limited opportunities or judgement from others.',
        },
        [Option.finances]: {
          text: 'Finances',
          hint: 'Includes having no money.',
        },
        [Option.links_to_offending]: {
          text: 'Links to offending',
        },
        [Option.health]: {
          text: 'Physical or mental health',
          hint: 'Includes overdose.',
        },
        [Option.relationships]: {
          text: 'Relationships',
          hint: 'Includes isolation or neglecting responsibilities.',
        },
      },
      validation: 'Select how their drug use has affected their life',
    },
    [Question.drugs_affected_their_life_details]: {
      text: 'Details on how %1 drug use has affected their life',
    },
    [Question.drugs_anything_helped_stop_or_reduce_use]: {
      text: 'Has anything helped %1 stop or reduce their drug use? (optional)',
      hint: 'Note any treatment or lifestyle changes that have helped them.',
    },
    [Question.drugs_what_could_help_not_use_drugs_in_future]: {
      text: 'What could help %1 not use drugs in the future? (optional)',
    },
    [Question.drug_use_changes]: {
      text: 'Does %1 want to make changes to their drug use?',
      validation: 'Select if they want to make changes to their drug use',
    },
    [Question.drugs_practitioner_analysis_motivated_to_stop]: {
      text: 'Does %1 seem motivated to stop or reduce their drug use?',
      option: {
        [Option.no_motivation]: 'Does not show motivation to stop or reduce',
        [Option.partial_motivation]: 'Shows some motivation to stop or reduce',
        [Option.full_motivation]: 'Motivated to stop or reduce',
      },
      validation: 'Select if they seem motivated to stop or reduce their drug use',
    },
    [Question.drug_use_practitioner_analysis_strengths_or_protective_factors]: {
      text: 'Are there any strengths or protective factors related to drug use?',
      validation: 'Select if there are any strengths or protective factors related to drug use',
    },
    [Question.drug_use_practitioner_analysis_risk_of_serious_harm]: {
      text: 'Is %1 drug use linked to risk of serious harm?',
      validation: 'Select if drug use is linked to risk of serious harm',
    },
    [Question.drug_use_practitioner_analysis_risk_of_reoffending]: {
      text: 'Is %1 drug use linked to risk of reoffending?',
      validation: 'Select if drug use is linked to risk of reoffending',
    },
  },
  text: {
    lastUsed: { text: 'Last used' },
    howOften: { text: 'How often' },
    injected: { text: 'Injected' },
    more_information: 'More information',
  },
  option: {
    [Option.amphetamines]: 'Amphetamines (including speed, methamphetamine)',
    [Option.benzodiazepines]: 'Benzodiazepines (including diazepam, temazepam)',
    [Option.cannabis]: 'Cannabis',
    [Option.cocaine]: 'Cocaine',
    [Option.crack]: 'Crack cocaine',
    [Option.ecstasy]: 'Ecstasy (MDMA)',
    [Option.hallucinogenics]: 'Hallucinogens',
    [Option.heroin]: 'Heroin',
    [Option.methadone_not_prescribed]: 'Methadone (not prescribed)',
    [Option.misused_prescribed_drugs]: 'Prescribed drugs',
    [Option.other_opiates]: 'Other opiates',
    [Option.solvents]: 'Solvents (including gases and glues)',
    [Option.steroids]: 'Steroids',
    [Option.spice]: 'Synthetic cannabinoids (spice)',
    [Option.last_six]: 'Used in the last 6 months',
    [Option.in_the_last_six]: 'In the last 6 months',
    [Option.more_than_six]: 'More than 6 months ago',
    [Option.used_more_than_six]: 'Used more than 6 months ago',
  },
  heading: {
    not_used_in_last_six_months: 'Not used in the last 6 months',
  },
} as const

export type AccommodationLocale = Locale<typeof english>
