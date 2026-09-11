import { QuestionContent, SectionDefinition, SummaryRow } from '../../../../constants/questionContent'
import { Step } from '../../constants/page'
import { StepDefinition } from '../../locales'
import { accommodationFields } from '../accommodation/fields'
import { currentOffenceAndOffendingHistoryFields } from '../current-offence-and-offending-history/fields'
import { dateOfCurrentSupervisionFields } from '../date-of-current-supervision/fields'
import { interviewFields } from '../interview-question/fields'
import { offencesSinceSupervisionFields } from '../offences-since-supervision/fields'
import { sexualOffendingFields } from '../sexual-offending/fields'
import { employmentFields } from '../employment/fields'
import { drugMisuseFields } from '../drug-misuse/fields'
import { alcoholEverUsedFields } from '../alcohol-ever-used/fields'
import { alcoholFields } from '../alcohol/fields'
import { bingeDrinkingFields } from '../binge-drinking/fields'
import { drugUseFields } from '../drug-use/fields'
import { personalRelationshipsFields } from '../personal-relationships-and-community/fields'
import { thinkingAttitudesBehavioursFields } from '../thinking-attitudes-and-behaviours/fields'

export interface CheckYourAnswersSection {
  step: StepDefinition
  config?: SectionDefinition | SectionDefinition[]
}

export const checkYourAnswersSections: CheckYourAnswersSection[] = [
  { step: Step.current_offence_and_offending_history, config: currentOffenceAndOffendingHistoryFields },
  { step: Step.sexual_offending, config: sexualOffendingFields },
  { step: Step.date_of_current_supervision, config: dateOfCurrentSupervisionFields },
  { step: Step.offences_since_community_date, config: offencesSinceSupervisionFields },
  { step: Step.interview_question, config: interviewFields },
  { step: Step.accommodation, config: accommodationFields },
  { step: Step.employment, config: employmentFields },
  { step: Step.drug_misuse, config: [drugMisuseFields, drugUseFields] },
  { step: Step.alcohol_ever_used, config: [alcoholEverUsedFields, alcoholFields, bingeDrinkingFields] },
  { step: Step.personal_relationships_and_community, config: personalRelationshipsFields },
  { step: Step.thinking_attitudes_and_behaviours, config: thinkingAttitudesBehavioursFields },
]

export interface Answerable {
  content: QuestionContent
  displayModes?: { summaryRow?: SummaryRow }
}

const fieldsOf = (fields: SectionDefinition[keyof SectionDefinition] = {}): Answerable[] => Object.values(fields)

export const questionsOf = ({ config }: CheckYourAnswersSection): Answerable[] => {
  if (!config) return []
  const configs = Array.isArray(config) ? config : [config]
  return configs.flatMap(c => fieldsOf(c?.questions))
}
