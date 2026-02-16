/* eslint-disable no-console */
import { JourneyDefinition, StepDefinition } from '@form-engine/form/types/structures.type'
import { FunctionRegistryObject } from '@form-engine/registry/types/functions.type'

// =============================================================================
// Types
// =============================================================================

type DeepPartial<T> = T extends object ? { [P in keyof T]?: DeepPartial<T[P]> } : T

type OverrideMode = 'replace' | 'append' | 'prepend'

interface ArrayOverride<T> {
  mode: OverrideMode
  items: T[]
}

type PropertyOverride<T> = T | ArrayOverride<T extends (infer U)[] ? U : never>

/**
 * Override configuration for a step.
 * All properties are optional - only specify what you want to change.
 */
export interface StepOverride {
  path?: string
  title?: string
  isEntryPoint?: boolean
  backlink?: string
  view?: DeepPartial<StepDefinition['view']>
  data?: Record<string, unknown>
  metadata?: Record<string, unknown>
  blocks?: PropertyOverride<StepDefinition['blocks']>
  onAccess?: PropertyOverride<StepDefinition['onAccess']>
  onAction?: PropertyOverride<StepDefinition['onAction']>
  onSubmission?: PropertyOverride<StepDefinition['onSubmission']>
}

/**
 * Override configuration for a journey.
 * All properties are optional - only specify what you want to change.
 */
export interface JourneyOverride {
  path?: string
  code?: string
  title?: string
  description?: string
  entryPath?: string
  view?: DeepPartial<JourneyDefinition['view']>
  data?: Record<string, unknown>
  metadata?: Record<string, unknown>
  onAccess?: PropertyOverride<JourneyDefinition['onAccess']>
}

/**
 * Configuration for creating a journey variant.
 */
export interface VariantConfig {
  /**
   * Journey overrides keyed by path.
   * Use empty string '' for root journey (required), or path for nested journeys.
   *
   * The root journey override ('') must include `code` and `path` at minimum.
   *
   * @example
   * {
   *   '': { code: 'my-variant', path: '/my-variant', title: 'My Variant' },
   *   '/goal/:uuid': { title: 'Manage Goals' },
   *   '/goal/:uuid/sub-journey': { title: 'Nested Override' },
   * }
   */
  journeyOverrides: Record<string, JourneyOverride>

  /**
   * Step overrides keyed by path.
   * Path format: "journey-code/step-path" or just "step-path" for root steps.
   *
   * @example
   * {
   *   'goal-management/add-steps': { title: 'Add actions' },
   *   'plan-overview/plan': { blocks: newBlocks },
   * }
   */
  stepOverrides?: Record<string, StepOverride>

  /**
   * New steps to add.
   * Path format indicates where to insert: "journey-code/new-step-path"
   *
   * @example
   * {
   *   'goal-management/review-goal': reviewGoalStep,
   * }
   */
  stepAdditions?: Record<string, StepDefinition>

  /**
   * Step paths to remove from the journey.
   *
   * @example ['plan-history/view-historic']
   */
  stepRemovals?: string[]

  /**
   * New child journeys to add.
   * Keys are parent journey paths (empty string '' for root).
   *
   * @example
   * {
   *   '': newRootChildJourney,            // Adds to root's children
   *   'goal-management': newSubJourney,   // Adds to goal-management's children
   *   'parent/child': deepNestedJourney,  // Adds to parent/child's children
   * }
   */
  journeyAdditions?: Record<string, JourneyDefinition>

  /**
   * Journey paths to remove.
   * Supports nested paths like "parent-journey/nested-journey".
   *
   * @example ['plan-history', 'goal-management/sub-journey']
   */
  journeyRemovals?: string[]

  /**
   * Replace entire journeys with new ones.
   * Keys are journey paths, values are replacement journey definitions.
   * Shorthand for remove + add at same location.
   *
   * @example
   * {
   *   'goal-management': newGoalManagementJourney,
   *   'parent/nested': newNestedJourney,
   * }
   */
  journeyReplacements?: Record<string, JourneyDefinition>

  /**
   * Replace entire steps with new ones.
   * Keys are step paths (journey/step), values are replacement step definitions.
   * Shorthand for remove + add at same location.
   *
   * @example
   * {
   *   'goal-management/add-steps': newAddStepsStep,
   *   'plan-overview/plan': newPlanStep,
   * }
   */
  stepReplacements?: Record<string, StepDefinition>

  /**
   * Whether this form package should be registered. Default: true
   *
   * When set to false, registerFormPackage() will skip registration entirely.
   * Useful for disabling forms via configuration or feature flags.
   *
   * @example
   * ```typescript
   * createFormPackage({
   *   enabled: config.featureFlags.myFormEnabled,
   *   journey: myJourney,
   * })
   * ```
   */
  enabled?: boolean
}

/**
 * A variant wraps a journey with metadata about its lineage.
 * Enables debugging and further variant creation.
 */
export interface Variant {
  /** The resulting journey definition */
  readonly journey: JourneyDefinition

  /** The base this variant was created from */
  readonly base: Variant | null

  /** The configuration used to create this variant */
  readonly config: VariantConfig

  createRegistries?: (deps?: any) => FunctionRegistryObject

  /** Whether this form package should be registered. */
  readonly enabled: boolean

  /** Get the inheritance chain */
  getLineage(): string[]

  /** Find where a step override originated from */
  getOverrideSource(stepPath: string): string | null
}

// =============================================================================
// Helper Functions
// =============================================================================

function isArrayOverride<T>(value: unknown): value is ArrayOverride<T> {
  return typeof value === 'object' &&
    value !== null &&
    'mode' in value &&
    'items' in value &&
    Array.isArray((value as ArrayOverride<T>).items)
}

function applyArrayOverride<T>(original: T[] | undefined, override: PropertyOverride<T[]>): T[] {
  if (!isArrayOverride<T>(override)) {
    return override as T[]
  }

  const base = original ?? []

  switch (override.mode) {
    case 'replace':
      return override.items
    case 'append':
      return [...base, ...override.items]
    case 'prepend':
      return [...override.items, ...base]
    default:
      return override.items
  }
}

function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepClone(item)) as T
  }

  const cloned = {} as T

  Object.keys(obj as object).forEach(key => {
    ;(cloned as Record<string, unknown>)[key] = deepClone((obj as Record<string, unknown>)[key])
  })

  return cloned
}

function applyStepOverride(step: StepDefinition, override: StepOverride): StepDefinition {
  const result = { ...step }

  // Handle simple property overrides
  if (override.path !== undefined) {
    result.path = override.path
  }

  if (override.title !== undefined) {
    result.title = override.title
  }

  if (override.isEntryPoint !== undefined) {
    result.isEntryPoint = override.isEntryPoint
  }

  if (override.backlink !== undefined) {
    result.backlink = override.backlink
  }

  if (override.view !== undefined) {
    result.view = { ...result.view, ...override.view }
  }

  if (override.data !== undefined) {
    result.data = { ...result.data, ...override.data }
  }

  if (override.metadata !== undefined) {
    result.metadata = { ...result.metadata, ...override.metadata }
  }

  // Handle array property overrides
  if (override.blocks !== undefined) {
    result.blocks = applyArrayOverride(result.blocks, override.blocks)
  }

  if (override.onAccess !== undefined) {
    result.onAccess = applyArrayOverride(result.onAccess, override.onAccess)
  }

  if (override.onAction !== undefined) {
    result.onAction = applyArrayOverride(result.onAction, override.onAction)
  }

  if (override.onSubmission !== undefined) {
    result.onSubmission = applyArrayOverride(result.onSubmission, override.onSubmission)
  }

  return result
}

function applyJourneyOverride(journey: JourneyDefinition, override: JourneyOverride): JourneyDefinition {
  const result = { ...journey }

  if (override.path !== undefined) {
    result.path = override.path
  }

  if (override.code !== undefined) {
    result.code = override.code
  }

  if (override.title !== undefined) {
    result.title = override.title
  }

  if (override.description !== undefined) {
    result.description = override.description
  }

  if (override.view !== undefined) {
    result.view = { ...result.view, ...override.view }
  }

  if (override.data !== undefined) {
    result.data = { ...result.data, ...override.data }
  }

  if (override.metadata !== undefined) {
    result.metadata = { ...result.metadata, ...override.metadata }
  }

  if (override.entryPath !== undefined) {
    result.entryPath = override.entryPath
  }

  if (override.onAccess !== undefined) {
    result.onAccess = applyArrayOverride(result.onAccess, override.onAccess)
  }

  return result
}

/**
 * Normalize a path for comparison.
 * Strips leading slash if present.
 */
function normalizePath(path: string): string {
  return path.startsWith('/') ? path.slice(1) : path
}

/**
 * Check if a journey's path matches the target path.
 * Handles leading slashes flexibly.
 */
function journeyPathMatches(journey: JourneyDefinition, targetPath: string): boolean {
  return normalizePath(journey.path) === normalizePath(targetPath)
}

/**
 * Check if a step's path matches the target path.
 * Handles leading slashes flexibly.
 */
function stepPathMatches(step: StepDefinition, targetPath: string): boolean {
  return normalizePath(step.path) === normalizePath(targetPath)
}

/**
 * Parse a step path into journey path and step path components.
 * Handles both "journey-path/step-path" and "step-path" formats.
 */
function parseStepPath(fullPath: string): { journeyPath: string | null; stepPath: string } {
  const parts = fullPath.split('/')

  if (parts.length === 1) {
    return { journeyPath: null, stepPath: parts[0] }
  }

  return {
    journeyPath: parts.slice(0, -1).join('/'),
    stepPath: parts.at(-1),
  }
}

function findAndModifyStep(
  journey: JourneyDefinition,
  targetJourneyPath: string | null,
  stepPath: string,
  modifier: (step: StepDefinition) => StepDefinition,
): boolean {
  // If no journey path specified, look in root journey's steps
  if (targetJourneyPath === null) {
    const stepIndex = journey.steps?.findIndex(s => stepPathMatches(s, stepPath)) ?? -1

    if (stepIndex >= 0 && journey.steps) {
      journey.steps[stepIndex] = modifier(journey.steps[stepIndex])
      return true
    }

    return false
  }

  // Look in child journeys by path
  const parts = targetJourneyPath.split('/')

  if (parts.length === 1) {
    const child = journey.children?.find(c => journeyPathMatches(c, parts[0]))

    if (child) {
      const stepIndex = child.steps?.findIndex(s => stepPathMatches(s, stepPath)) ?? -1

      if (stepIndex >= 0 && child.steps) {
        child.steps[stepIndex] = modifier(child.steps[stepIndex])
        return true
      }
    }

    return false
  }

  // Nested journey path - recurse
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return findAndModifyStep(child, restPaths.join('/'), stepPath, modifier)
  }

  return false
}

function removeStep(journey: JourneyDefinition, targetJourneyPath: string | null, stepPath: string): boolean {
  if (targetJourneyPath === null && journey.steps) {
    const originalLength = journey.steps.length
    journey.steps = journey.steps.filter(s => !stepPathMatches(s, stepPath))
    return journey.steps.length < originalLength
  }

  const parts = targetJourneyPath?.split('/') ?? []

  if (parts.length === 1) {
    const child = journey.children?.find(c => journeyPathMatches(c, parts[0]))

    if (child?.steps) {
      const originalLength = child.steps.length
      child.steps = child.steps.filter(s => !stepPathMatches(s, stepPath))
      return child.steps.length < originalLength
    }

    return false
  }

  // Nested path
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return removeStep(child, restPaths.join('/'), stepPath)
  }

  return false
}

function addStep(journey: JourneyDefinition, targetJourneyPath: string | null, newStep: StepDefinition): boolean {
  if (targetJourneyPath === null) {
    journey.steps = [...(journey.steps ?? []), newStep]
    return true
  }

  const parts = targetJourneyPath.split('/')

  if (parts.length === 1) {
    const child = journey.children?.find(c => journeyPathMatches(c, parts[0]))

    if (child) {
      child.steps = [...(child.steps ?? []), newStep]
      return true
    }

    return false
  }

  // Nested path
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return addStep(child, restPaths.join('/'), newStep)
  }

  return false
}

/**
 * Find and modify a journey by path.
 * Supports nested paths like "/plan//goal".
 */
function findAndModifyJourney(
  journey: JourneyDefinition,
  targetPath: string,
  modifier: (journey: JourneyDefinition) => JourneyDefinition,
): boolean {
  const parts = targetPath.split('/')

  // Single path segment - look in immediate children
  if (parts.length === 1) {
    const childIndex = journey.children?.findIndex(c => journeyPathMatches(c, parts[0])) ?? -1

    if (childIndex >= 0 && journey.children) {
      journey.children[childIndex] = modifier(journey.children[childIndex])
      return true
    }

    return false
  }

  // Nested path - recurse into children
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return findAndModifyJourney(child, restPaths.join('/'), modifier)
  }

  return false
}

/**
 * Remove a journey by path.
 * Supports nested paths like "/plan//goal".
 */
function removeJourney(journey: JourneyDefinition, targetPath: string): boolean {
  const parts = targetPath.split('/')

  // Single path segment - remove from immediate children
  if (parts.length === 1) {
    if (!journey.children) {
      return false
    }

    const originalLength = journey.children.length
    journey.children = journey.children.filter(c => !journeyPathMatches(c, parts[0]))
    return journey.children.length < originalLength
  }

  // Nested path - recurse into parent and remove from there
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return removeJourney(child, restPaths.join('/'))
  }

  return false
}

/**
 * Add a journey at a specific path.
 * Path indicates the parent journey to add to.
 * Empty/null path adds to root journey's children.
 */
function addJourneyAtPath(
  journey: JourneyDefinition,
  parentPath: string | null,
  newJourney: JourneyDefinition,
): boolean {
  if (!parentPath) {
    journey.children = [...(journey.children ?? []), newJourney]
    return true
  }

  const parts = parentPath.split('/')

  if (parts.length === 1) {
    const parent = journey.children?.find(c => journeyPathMatches(c, parts[0]))

    if (parent) {
      parent.children = [...(parent.children ?? []), newJourney]
      return true
    }

    return false
  }

  // Nested path
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return addJourneyAtPath(child, restPaths.join('/'), newJourney)
  }

  return false
}

/**
 * Replace a journey at a specific path.
 * Finds the journey and replaces it in its parent's children array.
 */
function replaceJourney(journey: JourneyDefinition, targetPath: string, replacement: JourneyDefinition): boolean {
  const parts = targetPath.split('/')

  if (parts.length === 1) {
    // Replace in immediate children
    const childIndex = journey.children?.findIndex(c => journeyPathMatches(c, parts[0])) ?? -1

    if (childIndex >= 0 && journey.children) {
      journey.children[childIndex] = replacement
      return true
    }

    return false
  }

  // Nested path - find parent and replace there
  const parentPath = parts.slice(0, -1).join('/')
  const targetChildPath = parts.at(-1)

  let found = false

  findAndModifyJourney(journey, parentPath, parent => {
    const childIndex = parent.children?.findIndex(c => journeyPathMatches(c, targetChildPath)) ?? -1

    if (childIndex >= 0 && parent.children) {
      parent.children[childIndex] = replacement
      found = true
    }

    return parent
  })

  return found
}

/**
 * Replace a step at a specific path.
 * Finds the step and replaces it in its journey's steps array.
 */
function replaceStep(
  journey: JourneyDefinition,
  targetJourneyPath: string | null,
  stepPath: string,
  replacement: StepDefinition,
): boolean {
  if (targetJourneyPath === null) {
    // Replace in root journey's steps
    const stepIndex = journey.steps?.findIndex(s => stepPathMatches(s, stepPath)) ?? -1

    if (stepIndex >= 0 && journey.steps) {
      journey.steps[stepIndex] = replacement
      return true
    }

    return false
  }

  // Handle nested journey paths
  const parts = targetJourneyPath.split('/')

  if (parts.length === 1) {
    const child = journey.children?.find(c => journeyPathMatches(c, parts[0]))

    if (child?.steps) {
      const stepIndex = child.steps.findIndex(s => stepPathMatches(s, stepPath))

      if (stepIndex >= 0) {
        child.steps[stepIndex] = replacement
        return true
      }
    }

    return false
  }

  // Deeper nesting
  const [firstPath, ...restPaths] = parts
  const child = journey.children?.find(c => journeyPathMatches(c, firstPath))

  if (child) {
    return replaceStep(child, restPaths.join('/'), stepPath, replacement)
  }

  return false
}

// =============================================================================
// Main Function
// =============================================================================

/**
 * Create a journey variant by applying overrides to a base journey.
 *
 * Variants enable creating new journey versions that inherit from existing ones,
 * only specifying what's different. Variants can be stacked (V3 extends V2 extends V1).
 *
 * @example
 * ```typescript
 * const v2Journey = createVariant(v1Journey, {
 *   code: 'sentence-plan-v2',
 *   path: '/sentence-plan/v2.0',
 *   stepOverrides: {
 *     'goal-management/add-steps': { title: 'Add actions' },
 *   },
 * })
 *
 * // Stack variants
 * const v3Journey = createVariant(v2Journey, {
 *   code: 'sentence-plan-v3',
 *   path: '/sentence-plan/v3.0',
 *   stepOverrides: {
 *     'goal-management/add-steps': { title: 'Add tasks' },
 *   },
 * })
 * ```
 */
export function createVariant(base: JourneyDefinition | Variant, config: VariantConfig): Variant {
  // Extract journey and base variant if applicable
  const baseVariant: Variant | null = isVariant(base) ? base : null
  const baseJourney = baseVariant?.journey ?? (base as JourneyDefinition)

  // Validate root override exists with required fields
  const rootOverride = config.journeyOverrides[''] // Why empty string?

  if (!rootOverride?.code || !rootOverride?.path) {
    throw new Error("[createVariant] Root journey override ('') must include 'code' and 'path'")
  }

  // Deep clone to avoid mutating original
  const journey = deepClone(baseJourney)

  // Apply journey overrides ('' for root, 'path' for nested)
  Object.entries(config.journeyOverrides).forEach(([journeyPath, override]) => {
    if (journeyPath === '') {
      // Root journey override
      Object.assign(journey, applyJourneyOverride(journey, override))
    } else {
      // Child/nested journey override
      const found = findAndModifyJourney(journey, journeyPath, j => applyJourneyOverride(j, override))

      if (!found) {
        console.warn(`[createVariant] Journey not found: ${journeyPath}`)
      }
    }
  })

  // Add new journeys ('' for root children, 'path' for nested)
  if (config.journeyAdditions) {
    Object.entries(config.journeyAdditions).forEach(([parentPath, newJourney]) => {
      if (parentPath === '') {
        // Add to root's children
        journey.children = [...(journey.children ?? []), newJourney]
      } else {
        // Add to nested journey's children
        const found = addJourneyAtPath(journey, parentPath, newJourney)

        if (!found) {
          console.warn(`[createVariant] Parent journey not found for addition: ${parentPath}`)
        }
      }
    })
  }

  // Remove journeys (supports nested paths)
  if (config.journeyRemovals?.length) {
    config.journeyRemovals.forEach(journeyPath => {
      removeJourney(journey, journeyPath)
    })
  }

  // Apply step overrides
  if (config.stepOverrides) {
    Object.entries(config.stepOverrides).forEach(([fullPath, override]) => {
      const { journeyPath: targetJourneyPath, stepPath } = parseStepPath(fullPath)
      const found = findAndModifyStep(journey, targetJourneyPath, stepPath, step => applyStepOverride(step, override))

      if (!found) {
        console.warn(`[createVariant] Step not found: ${fullPath}`)
      }
    })
  }

  // Remove steps
  if (config.stepRemovals?.length) {
    config.stepRemovals.forEach(fullPath => {
      const { journeyPath: targetJourneyPath, stepPath } = parseStepPath(fullPath)
      removeStep(journey, targetJourneyPath, stepPath)
    })
  }

  // Add steps
  if (config.stepAdditions) {
    Object.entries(config.stepAdditions).forEach(([fullPath, newStep]) => {
      const { journeyPath: targetJourneyPath } = parseStepPath(fullPath)
      addStep(journey, targetJourneyPath, newStep)
    })
  }

  // Replace journeys (shorthand for remove + add)
  if (config.journeyReplacements) {
    Object.entries(config.journeyReplacements).forEach(([journeyPath, replacement]) => {
      const found = replaceJourney(journey, journeyPath, replacement)

      if (!found) {
        console.warn(`[createVariant] Journey not found for replacement: ${journeyPath}`)
      }
    })
  }

  // Replace steps (shorthand for remove + add)
  if (config.stepReplacements) {
    Object.entries(config.stepReplacements).forEach(([fullPath, replacement]) => {
      const { journeyPath: targetJourneyPath, stepPath } = parseStepPath(fullPath)
      const found = replaceStep(journey, targetJourneyPath, stepPath, replacement)

      if (!found) {
        console.warn(`[createVariant] Step not found for replacement: ${fullPath}`)
      }
    })
  }

  // Change enabled status
  const enabled = config.enabled ?? true

  // Remove original journey path
  journey.children[0].path = ''

  // Why do I end up with e.g. vX.0/privacy? Probably wrong...
  // Where are the registries / effects / components?

  return {
    journey,
    base: baseVariant,
    config,
    enabled,
    // createRegistries: (deps: SentencePlanEffectsDeps) => ({
    //   ...v4Registry(deps),
    // }),

    getLineage(): string[] {
      const lineage: string[] = [rootOverride.code]
      let current = baseVariant

      while (current) {
        lineage.unshift(current.config.journeyOverrides['']?.code ?? 'unknown')
        current = current.base
      }

      // Add original base journey code if not a variant
      if (!baseVariant) {
        lineage.unshift(baseJourney.code)
      }

      return lineage
    },

    getOverrideSource(stepPath: string): string | null {
      if (config.stepOverrides?.[stepPath]) {
        return rootOverride.code
      }

      if (baseVariant) {
        return baseVariant.getOverrideSource(stepPath)
      }

      return null
    },
  }
}

/**
 * Type guard to check if a value is a Variant
 */
export function isVariant(value: unknown): value is Variant {
  return typeof value === 'object' && value !== null && 'journey' in value && 'config' in value && 'getLineage' in value
}

/**
 * Extract the journey definition from a Variant or JourneyDefinition
 */
export function getJourney(value: JourneyDefinition | Variant): JourneyDefinition {
  return isVariant(value) ? value.journey : value
}
