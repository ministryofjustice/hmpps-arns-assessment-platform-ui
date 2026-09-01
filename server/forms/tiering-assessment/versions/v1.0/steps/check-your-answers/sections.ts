import { QuestionContent, SectionDefinition, SummaryRow } from '../../../../constants/questionContent'
import { Section } from '../../constants/section'
import { accommodationSection } from '../accommodation/section'
import { currentOffenceAndOffendingHistorySection } from '../current-offence-and-offending-history/section'
import { dateOfCurrentSupervisionSection } from '../date-of-current-supervision/section'

type SectionDefinitionOf = (typeof Section)[keyof typeof Section]

export interface CheckYourAnswersSection {
  section: SectionDefinitionOf
  config?: SectionDefinition
}

export const checkYourAnswersSections: CheckYourAnswersSection[] = [
  { section: Section.current_offence_and_offending_history, config: currentOffenceAndOffendingHistorySection },
  { section: Section.date_of_current_supervision, config: dateOfCurrentSupervisionSection },
  { section: Section.accommodation, config: accommodationSection },
]

export interface Answerable {
  content: QuestionContent
  displayModes?: { answerRow?: SummaryRow }
}

const fieldsOf = (fields: SectionDefinition[keyof SectionDefinition] = {}): Answerable[] => Object.values(fields)

export const questionsOf = ({ config }: CheckYourAnswersSection): Answerable[] => fieldsOf(config?.questions)
