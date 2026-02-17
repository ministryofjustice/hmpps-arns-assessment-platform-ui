import config from '../../../../config'
import { getExcludedFields, resolveHandoverConfig } from '../../flags/handlers'
import { applyRandomization, ScenarioValues, generateSeed, getRandomizeFields } from '../../scenarios'
import {
  TrainingSessionLauncherContext,
  TrainingLauncherPreferences,
  Session,
  DisplaySession,
  DisplayNeed,
  SavedScenario,
  DisplayScenario,
  ServiceOption,
} from '../../types'
import { TrainingSessionLauncherEffectsDeps } from '../types'

/**
 * Gender code to display label mapping
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
 * Format a date string from ISO format to UK display format
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
 * Check if a need has data
 */
function needHasData(values: ScenarioValues, needConfig: NeedConfig): boolean {
  return values[needConfig.harmKey] !== undefined ||
    values[needConfig.reoffendingKey] !== undefined ||
    values[needConfig.strengthsKey] !== undefined
}

/**
 * Transform scenario values to display needs array
 */
function transformToDisplayNeeds(values: ScenarioValues): DisplayNeed[] {
  return NEEDS_CONFIG.filter(needConfig => needHasData(values, needConfig)).map(needConfig => {
    const scoreValue = values[needConfig.scoreKey] as string | undefined
    const score = scoreValue !== undefined ? parseInt(scoreValue, 10) : null
    const threshold = values[needConfig.thresholdKey] as string | undefined
    const isHighScoring = threshold === 'YES'

    return {
      name: needConfig.name,
      score: Number.isNaN(score) ? null : score,
      isHighScoring,
      linkedToHarm: values[needConfig.harmKey] as DisplayNeed['linkedToHarm'],
      linkedToReoffending: values[needConfig.reoffendingKey] as DisplayNeed['linkedToReoffending'],
      strengths: values[needConfig.strengthsKey] as DisplayNeed['strengths'],
    }
  })
}

/**
 * Compute available services for a session based on its flags
 */
function computeAvailableServices(session: Session): ServiceOption[] {
  const handoverConfig = resolveHandoverConfig(session.flags)

  return handoverConfig.availableServices.map(service => ({
    value: service,
    text: config.handoverTargets[service].displayName,
  }))
}

/**
 * Transform a session to display format
 */
function transformToDisplaySession(session: Session): DisplaySession {
  const { values } = session

  return {
    ...session,
    scenarioName: session.name,
    displayNeeds: transformToDisplayNeeds(values),
    givenName: values.givenName || '',
    familyName: values.familyName || '',
    dateOfBirth: formatDateOfBirth(values.dateOfBirth),
    gender: GENDER_LABELS[values.gender] || values.gender || '',
    location: LOCATION_LABELS[values.location] || values.location || '',
    crn: values.crn || '',
    pnc: values.pnc || '',
    oasysAssessmentPk: values.oasysAssessmentPk || '',
    availableServices: computeAvailableServices(session),
  }
}

/**
 * Resolve a saved scenario by applying randomization and transform to display format
 */
function resolveSavedScenario(saved: SavedScenario): DisplayScenario {
  const seed = generateSeed()
  const excludedFields = getExcludedFields(saved.flags)
  const randomizeFields = getRandomizeFields(saved.fixedValues, excludedFields)
  const values = applyRandomization(saved.fixedValues, randomizeFields, seed)

  return {
    id: saved.id,
    name: saved.name,
    shortDescription: saved.shortDescription,
    description: saved.description,
    flags: saved.flags,
    randomizeFields,

    givenName: values.givenName || '',
    familyName: values.familyName || '',
    dateOfBirth: formatDateOfBirth(values.dateOfBirth),
    gender: GENDER_LABELS[values.gender] || values.gender || '',
    location: LOCATION_LABELS[values.location] || values.location || '',
    crn: values.crn || '',
    pnc: values.pnc || '',
    oasysAssessmentPk: values.oasysAssessmentPk || '',

    displayNeeds: transformToDisplayNeeds(values),
    rawScenario: {
      id: saved.id,
      name: saved.name,
      shortDescription: saved.shortDescription,
      description: saved.description,
      flags: saved.flags,
      randomizeFields,
      values,
      seed,
    },
  }
}

/**
 * Default empty preferences
 */
const DEFAULT_PREFERENCES: TrainingLauncherPreferences = {
  savedScenarios: [],
  sessions: [],
}

/**
 * Load training launcher preferences from Redis and set in context.
 *
 * Loads saved scenarios (resolving randomization) and sessions,
 * transforming both to display format with formatted values.
 */
export const loadPreferences =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const preferencesId = context.getState('preferencesId')

    if (!preferencesId) {
      throw new Error('Cannot load preferences: preferencesId is missing from state')
    }

    const allPreferences = await deps.preferencesStore.get<{ trainingLauncher?: TrainingLauncherPreferences }>(
      preferencesId,
    )

    const preferences = allPreferences?.trainingLauncher ?? DEFAULT_PREFERENCES

    context.setData('preferencesId', preferencesId)
    context.setData('savedScenarios', preferences.savedScenarios.map(resolveSavedScenario))
    context.setData('sessions', preferences.sessions.map(transformToDisplaySession).reverse())
  }
