/**
 * Assessment Area from OASys data
 *
 * Represents a criminogenic need area with scoring and linked risks.
 */
export interface AssessmentArea {
  /** Unique identifier for the area (e.g., 'accommodation', 'drug-use') */
  slug: string

  /** Display name for the area */
  title: string

  /** Whether this area is linked to risk of serious harm */
  linkedToHarm: 'YES' | 'NO' | null

  /** Whether this area is linked to risk of reoffending */
  linkedToReoffending: 'YES' | 'NO' | null

  /** Details about the risk of serious harm link */
  riskOfSeriousHarmDetails: string

  /** Details about the risk of reoffending link */
  riskOfReoffendingDetails: string

  /** Motivation to make changes assessment */
  motivationToMakeChanges: string

  /** Whether this area has strengths or protective factors */
  linkedToStrengthsOrProtectiveFactors: 'YES' | 'NO' | null

  /** Details about strengths or protective factors */
  strengthsOrProtectiveFactorsDetails: string

  /** Raw criminogenic needs score (0-10 typically) */
  criminogenicNeedsScore: number | null

  /** Maximum possible score for this area */
  upperBound: number

  /** Threshold value for high/low scoring */
  thresholdValue: number

  /** Whether the OASys section is complete */
  isAssessmentSectionComplete: boolean

  /** Route to create a goal for this area */
  goalRoute: string
}

/**
 * Assessment information grouped by risk scoring
 */
export interface FormattedAssessmentInfo {
  /** When the assessment was last updated (ISO date string) */
  versionUpdatedAt: string | null

  /** Whether the full assessment is complete */
  isAssessmentComplete: boolean

  /** Assessment areas grouped by scoring */
  areas: {
    /** Areas with criminogenic needs score above threshold */
    highScoring: AssessmentArea[]

    /** Areas with criminogenic needs score at or below threshold */
    lowScoring: AssessmentArea[]

    /** Areas without a criminogenic needs score (e.g., Finances, Health) */
    other: AssessmentArea[]

    /** Areas that haven't been completed in OASys */
    incompleteAreas: AssessmentArea[]
  }
}

/**
 * Mock assessment data for development
 *
 * This data simulates what would be returned from the OASys API.
 * To be replaced with real API integration.
 */
export const mockAssessmentData: FormattedAssessmentInfo = {
  versionUpdatedAt: '2024-12-15T10:30:00Z',
  isAssessmentComplete: false,
  areas: {
    highScoring: [
      {
        slug: 'accommodation',
        title: 'Accommodation',
        linkedToHarm: 'YES',
        linkedToReoffending: 'YES',
        riskOfSeriousHarmDetails: 'Unstable housing increases risk of associating with negative peers',
        riskOfReoffendingDetails: 'Lack of stable accommodation linked to previous reoffending',
        motivationToMakeChanges: 'Some motivation identified',
        linkedToStrengthsOrProtectiveFactors: 'NO',
        strengthsOrProtectiveFactorsDetails: '',
        criminogenicNeedsScore: 7,
        upperBound: 10,
        thresholdValue: 5,
        isAssessmentSectionComplete: true,
        goalRoute: '/goal/new/add-goal/accommodation',
      },
      {
        slug: 'drug-use',
        title: 'Drug use',
        linkedToHarm: 'YES',
        linkedToReoffending: 'YES',
        riskOfSeriousHarmDetails: 'Drug use linked to aggressive behaviour',
        riskOfReoffendingDetails: 'Drug dependency is a significant factor in offending behaviour',
        motivationToMakeChanges: 'Contemplative',
        linkedToStrengthsOrProtectiveFactors: 'NO',
        strengthsOrProtectiveFactorsDetails: '',
        criminogenicNeedsScore: 8,
        upperBound: 10,
        thresholdValue: 5,
        isAssessmentSectionComplete: true,
        goalRoute: '/goal/new/add-goal/drug-use',
      },
    ],
    lowScoring: [
      {
        slug: 'employment-and-education',
        title: 'Employment and education',
        linkedToHarm: 'NO',
        linkedToReoffending: 'YES',
        riskOfSeriousHarmDetails: '',
        riskOfReoffendingDetails: 'Lack of employment linked to financial pressures',
        motivationToMakeChanges: 'Good motivation',
        linkedToStrengthsOrProtectiveFactors: 'YES',
        strengthsOrProtectiveFactorsDetails: 'Has vocational qualifications that could aid employment',
        criminogenicNeedsScore: 3,
        upperBound: 10,
        thresholdValue: 5,
        isAssessmentSectionComplete: true,
        goalRoute: '/goal/new/add-goal/employment-and-education',
      },
      {
        slug: 'personal-relationships-and-community',
        title: 'Personal relationships and community',
        linkedToHarm: 'NO',
        linkedToReoffending: 'NO',
        riskOfSeriousHarmDetails: '',
        riskOfReoffendingDetails: '',
        motivationToMakeChanges: 'Good motivation',
        linkedToStrengthsOrProtectiveFactors: 'YES',
        strengthsOrProtectiveFactorsDetails: 'Strong family support network',
        criminogenicNeedsScore: 2,
        upperBound: 10,
        thresholdValue: 5,
        isAssessmentSectionComplete: true,
        goalRoute: '/goal/new/add-goal/personal-relationships-and-community',
      },
    ],
    other: [
      {
        slug: 'finances',
        title: 'Finances',
        linkedToHarm: 'NO',
        linkedToReoffending: 'YES',
        riskOfSeriousHarmDetails: '',
        riskOfReoffendingDetails: 'Financial difficulties have contributed to offending',
        motivationToMakeChanges: 'Some motivation',
        linkedToStrengthsOrProtectiveFactors: 'NO',
        strengthsOrProtectiveFactorsDetails: '',
        criminogenicNeedsScore: null,
        upperBound: 0,
        thresholdValue: 0,
        isAssessmentSectionComplete: true,
        goalRoute: '/goal/new/add-goal/finances',
      },
      {
        slug: 'health-and-wellbeing',
        title: 'Health and wellbeing',
        linkedToHarm: 'NO',
        linkedToReoffending: 'NO',
        riskOfSeriousHarmDetails: '',
        riskOfReoffendingDetails: '',
        motivationToMakeChanges: 'Good motivation',
        linkedToStrengthsOrProtectiveFactors: 'YES',
        strengthsOrProtectiveFactorsDetails: 'Engaging with mental health services',
        criminogenicNeedsScore: null,
        upperBound: 0,
        thresholdValue: 0,
        isAssessmentSectionComplete: true,
        goalRoute: '/goal/new/add-goal/health-and-wellbeing',
      },
    ],
    incompleteAreas: [
      {
        slug: 'alcohol-use',
        title: 'Alcohol use',
        linkedToHarm: null,
        linkedToReoffending: null,
        riskOfSeriousHarmDetails: '',
        riskOfReoffendingDetails: '',
        motivationToMakeChanges: '',
        linkedToStrengthsOrProtectiveFactors: null,
        strengthsOrProtectiveFactorsDetails: '',
        criminogenicNeedsScore: null,
        upperBound: 10,
        thresholdValue: 5,
        isAssessmentSectionComplete: false,
        goalRoute: '/goal/new/add-goal/alcohol-use',
      },
      {
        slug: 'thinking-behaviours-and-attitudes',
        title: 'Thinking, behaviours and attitudes',
        linkedToHarm: null,
        linkedToReoffending: null,
        riskOfSeriousHarmDetails: '',
        riskOfReoffendingDetails: '',
        motivationToMakeChanges: '',
        linkedToStrengthsOrProtectiveFactors: null,
        strengthsOrProtectiveFactorsDetails: '',
        criminogenicNeedsScore: null,
        upperBound: 10,
        thresholdValue: 5,
        isAssessmentSectionComplete: false,
        goalRoute: '/goal/new/add-goal/thinking-behaviours-and-attitudes',
      },
    ],
  },
}
