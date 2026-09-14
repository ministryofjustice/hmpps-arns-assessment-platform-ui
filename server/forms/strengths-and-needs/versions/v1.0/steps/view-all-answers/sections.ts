import { QuestionContent, SectionDefinition, SummaryRow } from '../../../../constants/questionContent'
import { Section } from '../../constants/section'
import { accommodationSection } from '../../journeys/accommodation/section'
import { alcoholUseSection } from '../../journeys/alcohol-use/section'
import { drugUseSection } from '../../journeys/drug-use/section'
import { employmentEducationSection } from '../../journeys/employment-and-education/section'
import { financeSection } from '../../journeys/finance/section'
import { healthWellbeingSection } from '../../journeys/health-wellbeing/section'
import { personalRelationshipsCommunitySection } from '../../journeys/personal-relationships-and-community/section'
import { thinkingBehavioursAttitudesSection } from '../../journeys/thinking-behaviours-and-attitudes/section'
import { offenceAnalysisSection } from '../../journeys/offence-analysis/section'

type SectionDefinitionOf = (typeof Section)[keyof typeof Section]

export interface ViewAllAnswersSection {
  section: SectionDefinitionOf
  config?: SectionDefinition
}

export const viewAllAnswersSections: ViewAllAnswersSection[] = [
  { section: Section.accommodation, config: accommodationSection },
  { section: Section.employment_and_education, config: employmentEducationSection },
  { section: Section.finance, config: financeSection },
  { section: Section.drug_use, config: drugUseSection },
  { section: Section.alcohol_use, config: alcoholUseSection },
  { section: Section.health_and_wellbeing, config: healthWellbeingSection },
  { section: Section.personal_relationships_and_community, config: personalRelationshipsCommunitySection },
  { section: Section.thinking_behaviours_and_attitudes, config: thinkingBehavioursAttitudesSection },
  { section: Section.offence_analysis, config: offenceAnalysisSection },
]

export interface Answerable {
  content: QuestionContent
  displayModes?: { answerRow?: SummaryRow }
}

const fieldsOf = (fields: SectionDefinition[keyof SectionDefinition] = {}): Answerable[] => Object.values(fields)

export const questionsOf = ({ config }: ViewAllAnswersSection): Answerable[] => fieldsOf(config?.questions)
export const analysisOf = ({ config }: ViewAllAnswersSection): Answerable[] => fieldsOf(config?.practitionerAnalysis)
