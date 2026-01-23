import config from '../../../config'
import { CreateHandoverLinkRequest } from '../../../interfaces/handover-api/request'
import { OasysCreateRequest } from '../../../interfaces/coordinator-api/oasysCreate'
import { TrainingScenarioFlag } from '../constants'
import { ScenarioFieldKey, getFieldsByGroup } from '../scenarioSchema'
import { TrainingSessionLauncherContext, TargetApplication } from '../types'
import { TrainingSessionLauncherEffectsDeps } from '../effects/types'

/**
 * Configuration for the session creation phase
 */
export interface FlagSessionConfig {
  /** Modify the coordinator API request before sending */
  modifyRequest?: (request: OasysCreateRequest) => OasysCreateRequest

  /** Run additional logic before session is created */
  beforeCreate?: (deps: TrainingSessionLauncherEffectsDeps, context: TrainingSessionLauncherContext) => Promise<void>

  /** Run additional logic after session is created */
  afterCreate?: (deps: TrainingSessionLauncherEffectsDeps, context: TrainingSessionLauncherContext) => Promise<void>
}

/**
 * Configuration for the handover link generation phase
 */
export interface FlagHandoverConfig {
  /** Constrain which services are available for this flag */
  availableServices?: TargetApplication[]

  /** Additional query params to append to the handover URL */
  urlParams?: Record<string, string>

  /** Modify the handover request before sending */
  modifyRequest?: (request: CreateHandoverLinkRequest) => CreateHandoverLinkRequest
}

/**
 * Flag handler configuration
 * Each flag can configure behavior for session creation and handover link generation
 */
export interface FlagHandler {
  /** Fields to exclude from randomization (they remain undefined) */
  excludeFields?: ScenarioFieldKey[]

  /** Session creation phase configuration */
  session?: FlagSessionConfig

  /** Handover link generation phase configuration */
  handover?: FlagHandoverConfig
}

/**
 * Registry mapping flags to their handlers
 */
const flagHandlers: Record<TrainingScenarioFlag, FlagHandler> = {
  SP_NATIONAL_ROLLOUT: {
    excludeFields: getFieldsByGroup('criminogenicNeeds'),
    session: {
      modifyRequest: request => ({
        ...request,
        assessmentType: 'SP',
      }),
    },
    handover: {
      availableServices: ['sentence-plan'],
    },
  },
}

/**
 * Resolved handover configuration after merging all flag configs
 */
export interface ResolvedHandoverConfig {
  availableServices: TargetApplication[]
  urlParams: Record<string, string>
  modifyRequest: (request: CreateHandoverLinkRequest) => CreateHandoverLinkRequest
}

/**
 * Get the default list of available services from config
 */
function getDefaultAvailableServices(): TargetApplication[] {
  return Object.keys(config.handoverTargets) as TargetApplication[]
}

/**
 * Resolve handover configuration by merging all flag configs
 * Later flags override earlier flags for simple properties
 * urlParams are merged, modifyRequest functions are chained
 */
export function resolveHandoverConfig(flags: TrainingScenarioFlag[]): ResolvedHandoverConfig {
  const defaults: ResolvedHandoverConfig = {
    availableServices: getDefaultAvailableServices(),
    urlParams: {},
    modifyRequest: req => req,
  }

  return flags.reduce((acc, flag) => {
    const handover = flagHandlers[flag]?.handover

    if (!handover) {
      return acc
    }

    return {
      availableServices: handover.availableServices ?? acc.availableServices,
      urlParams: { ...acc.urlParams, ...handover.urlParams },
      modifyRequest: handover.modifyRequest
        ? req => handover.modifyRequest!(acc.modifyRequest(req))
        : acc.modifyRequest,
    }
  }, defaults)
}

/**
 * Get all fields that should be excluded based on flags.
 * Excluded fields remain undefined (not fixed, not randomized).
 */
export function getExcludedFields(flags: TrainingScenarioFlag[]): Set<ScenarioFieldKey> {
  const excluded = new Set<ScenarioFieldKey>()

  for (const flag of flags) {
    const handler = flagHandlers[flag]

    if (handler?.excludeFields) {
      for (const field of handler.excludeFields) {
        excluded.add(field)
      }
    }
  }

  return excluded
}

/**
 * Apply all flag handlers to modify a create session request
 * Handlers are applied in the order flags appear in the array
 */
export function applyCreateSessionModifiers(
  flags: TrainingScenarioFlag[],
  request: OasysCreateRequest,
): OasysCreateRequest {
  return flags.reduce((req, flag) => {
    const handler = flagHandlers[flag]

    return handler?.session?.modifyRequest?.(req) ?? req
  }, request)
}

/**
 * Run all beforeCreate hooks for the given flags
 */
export async function runBeforeCreateSessionHooks(
  flags: TrainingScenarioFlag[],
  deps: TrainingSessionLauncherEffectsDeps,
  context: TrainingSessionLauncherContext,
): Promise<void> {
  for (const flag of flags) {
    const handler = flagHandlers[flag]

    if (handler?.session?.beforeCreate) {
      // eslint-disable-next-line no-await-in-loop -- Hooks must run sequentially
      await handler.session.beforeCreate(deps, context)
    }
  }
}

/**
 * Run all afterCreate hooks for the given flags
 */
export async function runAfterCreateSessionHooks(
  flags: TrainingScenarioFlag[],
  deps: TrainingSessionLauncherEffectsDeps,
  context: TrainingSessionLauncherContext,
): Promise<void> {
  for (const flag of flags) {
    const handler = flagHandlers[flag]

    if (handler?.session?.afterCreate) {
      // eslint-disable-next-line no-await-in-loop -- Hooks must run sequentially
      await handler.session.afterCreate(deps, context)
    }
  }
}
