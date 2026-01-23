import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { YesNoNullOrNA } from '../../interfaces/handover-api/shared'
import { TrainingScenarioFlag } from './constants'
import { ScenarioFieldKey, ScenarioValues, ResolvedScenario } from './scenarios'

/**
 * Target applications for training sessions
 */
export type TargetApplication = 'strengths-and-needs' | 'sentence-plan'

/**
 * Display-friendly need data derived from API format
 */
export interface DisplayNeed {
  name: string
  score: number | null
  isHighScoring: boolean
  linkedToHarm: YesNoNullOrNA | undefined
  linkedToReoffending: YesNoNullOrNA | undefined
  strengths: YesNoNullOrNA | undefined
}

/**
 * Scenario with pre-processed display data for rendering
 */
export interface DisplayScenario {
  id: string
  name: string
  shortDescription: string
  description: string
  flags: TrainingScenarioFlag[]
  randomizeFields: ScenarioFieldKey[]

  // Subject details (display-formatted)
  givenName: string
  familyName: string
  dateOfBirth: string
  gender: string
  location: string
  crn: string
  pnc: string
  oasysAssessmentPk: string

  // For display
  displayNeeds: DisplayNeed[]

  // Raw scenario data for session creation
  rawScenario: ResolvedScenario
}

/**
 * Dynamic keys for field randomization state.
 * Maps each ScenarioFieldKey to `${key}_isRandomized: boolean`
 */
type RandomizedFieldFlags = {
  [K in ScenarioFieldKey as `${K}_isRandomized`]: boolean
}

/**
 * Data stored via context.setData() / context.getData()
 */
export interface TrainingSessionLauncherData extends RandomizedFieldFlags {
  // Index signature required by EffectFunctionContext constraint
  [key: string]: unknown

  // Core data
  csrfToken: string
  scenarios: DisplayScenario[]
  savedScenarios: DisplayScenario[]
  sessions: DisplaySession[]

  // Handover
  handoverLink?: string
  handoverApiFailure?: boolean

  // Customise page
  scenario: ScenarioValues
  flags: TrainingScenarioFlag[]
  originalScenarioName: string

  // Session creation
  generatedSessionId: string
}

/**
 * Answers via context.setAnswer() / context.getAnswer()
 * Uses schema field keys plus additional form-specific fields
 */
export interface TrainingSessionLauncherAnswers extends ScenarioValues, Record<string, unknown> {
  scenarioName: string
  targetApplication: TargetApplication
  flags: TrainingScenarioFlag[]
}

/**
 * A user-saved scenario preset stored in preferences.
 * Fields not in fixedValues will be randomized on load.
 */
export interface SavedScenario {
  id: string
  name: string
  shortDescription: string
  description: string
  createdAt: number
  updatedAt: number
  basedOnPresetId: string | null
  flags: TrainingScenarioFlag[]
  fixedValues: Partial<ScenarioValues>
}

/**
 * A training session stored in preferences
 */
export interface Session {
  id: string
  name: string
  createdAt: number
  handoverLink?: string
  targetApplication: TargetApplication
  flags: TrainingScenarioFlag[]
  values: ScenarioValues

  // Populated by coordinator API after session creation
  sanAssessmentId?: string
  sanAssessmentVersion?: number
  sentencePlanId?: string
  sentencePlanVersion?: number
}

/**
 * Service option for dropdown display
 */
export interface ServiceOption {
  value: TargetApplication
  text: string
}

/**
 * Display version of a session with formatted values
 */
export interface DisplaySession extends Session {
  scenarioName: string
  displayNeeds: DisplayNeed[]
  givenName: string
  familyName: string
  dateOfBirth: string
  gender: string
  location: string
  crn: string
  pnc: string
  oasysAssessmentPk: string
  availableServices: ServiceOption[]
}

/**
 * Training launcher data stored in Redis via PreferencesStore
 * Stored under the 'trainingLauncher' namespace in preferences
 */
export interface TrainingLauncherPreferences {
  savedScenarios: SavedScenario[]
  sessions: Session[]
}

/**
 * Session data stored in the user's web session
 */
export type TrainingSessionLauncherSession = Record<string, unknown>

/**
 * Request state via context.getState()
 */
export interface TrainingSessionLauncherState extends Record<string, unknown> {
  csrfToken: string
  preferencesId: string
}

/**
 * Typed context combining all four
 */
export type TrainingSessionLauncherContext = EffectFunctionContext<
  TrainingSessionLauncherData,
  TrainingSessionLauncherAnswers,
  TrainingSessionLauncherSession,
  TrainingSessionLauncherState
>
