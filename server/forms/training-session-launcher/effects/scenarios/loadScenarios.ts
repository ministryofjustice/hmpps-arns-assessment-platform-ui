import { getExcludedFields } from '../../flags/handlers'
import {
  applyRandomization,
  ScenarioValues,
  generateSeed,
  getRandomizeFields,
  resolveAllPresets,
  ResolvedScenario,
} from '../../scenarios'
import {
  DisplayNeed,
  DisplayScenario,
  SavedScenario,
  TrainingLauncherPreferences,
  TrainingSessionLauncherContext,
} from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

/**
 * Gender code to display label mapping
 * Standard NOMIS codes
 */
const GENDER_LABELS: Record<string, string> = {
  '0': 'Not Known',
  '1': 'Male',
  '2': 'Female',
  '9': 'Not Specified',
}

/**
 * Location code to display label mapping
 */
const LOCATION_LABELS: Record<string, string> = {
  COMMUNITY: 'Community',
  PRISON: 'Prison',
}

/**
 * Criminogenic need configuration for display transformation
 */
interface NeedConfig {
  name: string
  scoreKey: keyof ScenarioValues
  thresholdKey: keyof ScenarioValues
  harmKey: keyof ScenarioValues
  reoffendingKey: keyof ScenarioValues
  strengthsKey: keyof ScenarioValues
}

const NEEDS_CONFIG: NeedConfig[] = [
  {
    name: 'Accommodation',
    scoreKey: 'accOtherWeightedScore',
    thresholdKey: 'accThreshold',
    harmKey: 'accLinkedToHarm',
    reoffendingKey: 'accLinkedToReoffending',
    strengthsKey: 'accStrengths',
  },
  {
    name: 'Education, Training & Employability',
    scoreKey: 'eteOtherWeightedScore',
    thresholdKey: 'eteThreshold',
    harmKey: 'eteLinkedToHarm',
    reoffendingKey: 'eteLinkedToReoffending',
    strengthsKey: 'eteStrengths',
  },
  {
    name: 'Finance',
    scoreKey: 'financeLinkedToHarm', // No score field for finance
    thresholdKey: 'financeLinkedToHarm', // Using placeholder
    harmKey: 'financeLinkedToHarm',
    reoffendingKey: 'financeLinkedToReoffending',
    strengthsKey: 'financeStrengths',
  },
  {
    name: 'Drug Use',
    scoreKey: 'drugOtherWeightedScore',
    thresholdKey: 'drugThreshold',
    harmKey: 'drugLinkedToHarm',
    reoffendingKey: 'drugLinkedToReoffending',
    strengthsKey: 'drugStrengths',
  },
  {
    name: 'Alcohol Use',
    scoreKey: 'alcoholOtherWeightedScore',
    thresholdKey: 'alcoholThreshold',
    harmKey: 'alcoholLinkedToHarm',
    reoffendingKey: 'alcoholLinkedToReoffending',
    strengthsKey: 'alcoholStrengths',
  },
  {
    name: 'Health & Wellbeing',
    scoreKey: 'emoLinkedToHarm', // No score field
    thresholdKey: 'emoLinkedToHarm', // Using placeholder
    harmKey: 'emoLinkedToHarm',
    reoffendingKey: 'emoLinkedToReoffending',
    strengthsKey: 'emoStrengths',
  },
  {
    name: 'Personal Relationships & Community',
    scoreKey: 'relOtherWeightedScore',
    thresholdKey: 'relThreshold',
    harmKey: 'relLinkedToHarm',
    reoffendingKey: 'relLinkedToReoffending',
    strengthsKey: 'relStrengths',
  },
  {
    name: 'Thinking, Behaviour & Attitudes',
    scoreKey: 'thinkOtherWeightedScore',
    thresholdKey: 'thinkThreshold',
    harmKey: 'thinkLinkedToHarm',
    reoffendingKey: 'thinkLinkedToReoffending',
    strengthsKey: 'thinkStrengths',
  },
  {
    name: 'Lifestyle & Associates',
    scoreKey: 'lifestyleOtherWeightedScore',
    thresholdKey: 'lifestyleThreshold',
    harmKey: 'lifestyleLinkedToHarm',
    reoffendingKey: 'lifestyleLinkedToReoffending',
    strengthsKey: 'lifestyleStrengths',
  },
]

/**
 * Format a date string from ISO format to UK display format
 * e.g., "1990-01-15" -> "15 January 1990"
 */
function formatDateOfBirth(isoDate: string | undefined): string {
  if (!isoDate) {
    return ''
  }

  const date = new Date(isoDate)

  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

/**
 * Check if a need has data (any of its fields are populated)
 */
function needHasData(values: ScenarioValues, config: NeedConfig): boolean {
  return values[config.harmKey] !== undefined ||
    values[config.reoffendingKey] !== undefined ||
    values[config.strengthsKey] !== undefined
}

/**
 * Transform scenario values to display needs array
 */
function transformToDisplayNeeds(values: ScenarioValues): DisplayNeed[] {
  return NEEDS_CONFIG.filter(config => needHasData(values, config)).map(config => {
    const scoreValue = values[config.scoreKey] as string | undefined
    const score = scoreValue !== undefined ? parseInt(scoreValue, 10) : null
    const threshold = values[config.thresholdKey] as string | undefined
    const isHighScoring = threshold === 'YES'

    return {
      name: config.name,
      score: Number.isNaN(score) ? null : score,
      isHighScoring,
      linkedToHarm: values[config.harmKey] as DisplayNeed['linkedToHarm'],
      linkedToReoffending: values[config.reoffendingKey] as DisplayNeed['linkedToReoffending'],
      strengths: values[config.strengthsKey] as DisplayNeed['strengths'],
    }
  })
}

/**
 * Transform a resolved scenario to display format
 */
function transformToDisplayScenario(scenario: ResolvedScenario): DisplayScenario {
  const { values } = scenario

  return {
    id: scenario.id,
    name: scenario.name,
    shortDescription: scenario.shortDescription,
    description: scenario.description,
    flags: scenario.flags,
    randomizeFields: scenario.randomizeFields,

    // Display-formatted subject details
    givenName: values.givenName || '',
    familyName: values.familyName || '',
    dateOfBirth: formatDateOfBirth(values.dateOfBirth),
    gender: GENDER_LABELS[values.gender] || values.gender || '',
    location: LOCATION_LABELS[values.location] || values.location || '',
    crn: values.crn || '',
    pnc: values.pnc || '',
    oasysAssessmentPk: values.oasysAssessmentPk || '',

    displayNeeds: transformToDisplayNeeds(values),
    rawScenario: scenario,
  }
}

/**
 * Resolve a saved scenario by applying randomization to get current values
 */
function resolveSavedScenario(saved: SavedScenario): ResolvedScenario {
  const seed = generateSeed()
  const excludedFields = getExcludedFields(saved.flags)
  const randomizeFields = getRandomizeFields(saved.fixedValues, excludedFields)

  return {
    id: saved.id,
    name: saved.name,
    shortDescription: saved.shortDescription,
    description: saved.description,
    flags: saved.flags,
    values: applyRandomization(saved.fixedValues, randomizeFields, seed),
    randomizeFields,
    seed,
  }
}

/**
 * Load training scenarios and set them in context data.
 *
 * Loads both built-in presets and user-saved scenarios from preferences,
 * resolving each by applying randomization to marked fields.
 */
export const loadScenarios =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    // Load built-in presets
    const builtInScenarios = resolveAllPresets(getExcludedFields)
    const builtInDisplay = builtInScenarios.map(transformToDisplayScenario)

    // Load saved scenarios from preferences
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot load scenarios: preferencesId is missing from state')
    }

    const allPreferences = await deps.preferencesStore.get<{ trainingLauncher?: TrainingLauncherPreferences }>(
      preferencesId,
    )

    const savedScenarios = allPreferences?.trainingLauncher?.savedScenarios ?? []
    const resolvedSaved = savedScenarios.map(resolveSavedScenario)
    const savedDisplay = resolvedSaved.map(transformToDisplayScenario)

    // Merge: built-in first, then saved scenarios
    const allScenarios = [...builtInDisplay, ...savedDisplay]

    context.setData('scenarios', allScenarios)
  }
