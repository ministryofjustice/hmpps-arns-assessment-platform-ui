/**
 * Configuration for each criminogenic need assessment area
 * Maps between different naming conventions used across the system
 */
export interface AssessmentAreaConfig {
  /** Display title for the area */
  title: string
  /** Key used in CriminogenicNeedsData */
  crimNeedsKey: string
  /** Key prefix used in sanOasysEquivalent field names */
  assessmentKey: string
  /** URL segment for goal routing */
  goalRoute: string
  /** Upper threshold for high-scoring classification (null = no scoring) */
  upperBound: number | null
}

/**
 * Assessment area configurations matching the 8 criminogenic need areas
 * Order matches the display order in the UI
 */
export const assessmentAreaConfigs: AssessmentAreaConfig[] = [
  {
    title: 'Accommodation',
    crimNeedsKey: 'accommodation',
    assessmentKey: 'accommodation',
    goalRoute: 'accommodation',
    upperBound: 6,
  },
  {
    title: 'Employment and education',
    crimNeedsKey: 'educationTrainingEmployability',
    assessmentKey: 'employment_education',
    goalRoute: 'employment-and-education',
    upperBound: 4,
  },
  {
    title: 'Finances',
    crimNeedsKey: 'finance',
    assessmentKey: 'finance',
    goalRoute: 'finances',
    upperBound: null, // No scoring for this area
  },
  {
    title: 'Drug use',
    crimNeedsKey: 'drugMisuse',
    assessmentKey: 'drug_use',
    goalRoute: 'drug-use',
    upperBound: 8,
  },
  {
    title: 'Alcohol use',
    crimNeedsKey: 'alcoholMisuse',
    assessmentKey: 'alcohol_use',
    goalRoute: 'alcohol-use',
    upperBound: 4,
  },
  {
    title: 'Health and wellbeing',
    crimNeedsKey: 'healthAndWellbeing',
    assessmentKey: 'health_wellbeing',
    goalRoute: 'health-and-wellbeing',
    upperBound: null, // No scoring for this area
  },
  {
    title: 'Personal relationships and community',
    crimNeedsKey: 'personalRelationshipsAndCommunity',
    assessmentKey: 'personal_relationships_community',
    goalRoute: 'personal-relationships-and-community',
    upperBound: 6,
  },
  {
    title: 'Thinking, behaviours and attitudes',
    crimNeedsKey: 'thinkingBehaviourAndAttitudes',
    assessmentKey: 'thinking_behaviours_attitudes',
    goalRoute: 'thinking-behaviours-and-attitudes',
    upperBound: 10,
  },
]
