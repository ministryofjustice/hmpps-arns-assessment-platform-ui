import { QuestionContent, SectionDefinition, SummaryRow } from '../../constants/questionContent'
import { Section } from '../../constants/section'
import { accommodationSection } from '../accommodation/section'

type SectionDefinitionOf = (typeof Section)[keyof typeof Section]

export interface CheckYourAnswersSection {
  section: SectionDefinitionOf
  config?: SectionDefinition
}

export const checkYourAnswersSections: CheckYourAnswersSection[] = [
  { section: Section.accommodation, config: accommodationSection },
]

export interface Answerable {
  content: QuestionContent
  displayModes?: { answerRow?: SummaryRow }
}

const fieldsOf = (fields: SectionDefinition[keyof SectionDefinition] = {}): Answerable[] => Object.values(fields)

export const questionsOf = ({ config }: CheckYourAnswersSection): Answerable[] => fieldsOf(config?.questions)
