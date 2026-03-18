import { NodeId } from '@form-engine/core/types/engine.type'
import { EvaluationResult } from '@form-engine/core/compilation/thunks/ThunkEvaluator'
import { BlockASTNode, JourneyASTNode, StepASTNode } from '@form-engine/core/types/structures.type'
import getAncestorChain from '@form-engine/core/utils/getAncestorChain'
import MetadataRegistry from '@form-engine/core/compilation/registries/MetadataRegistry'
import ThunkCacheManager from '@form-engine/core/compilation/thunks/ThunkCacheManager'
import { StepValidationFailure } from '@form-engine/core/compilation/thunks/ThunkEvaluationContext'
import { ValidationResult } from '@form-engine/core/nodes/expressions/validation/ValidationHandler'
import { isBlockStructNode } from '@form-engine/core/typeguards/structure-nodes'
import { BlockType } from '@form-engine/form/types/enums'
import { isObjectValue } from '@form-engine/typeguards/primitives'
import {
  JourneyAncestor,
  RenderContext,
  NavigationTree,
  NavigationJourney,
  NavigationStep,
  JourneyMetadata,
  StepMetadata,
  Evaluated,
} from './types'

export interface RenderContextOptions {
  /** Show validation errors on blocks. Set to true after form submission. Defaults to false. */
  showValidationFailures?: boolean

  /** Raw navigation metadata from the router, hydrated with active state. */
  navigationMetadata?: JourneyMetadata[]

  /** Full path of the current step, used to determine active state in navigation. */
  currentStepPath?: string
}

/** Builds RenderContext from evaluated AST for template rendering. */
export default class RenderContextFactory {
  static build(
    evaluationResult: EvaluationResult,
    currentStepId: NodeId,
    options: RenderContextOptions = {},
  ): RenderContext {
    const { cacheManager, metadataRegistry } = evaluationResult.context
    const showValidationFailures = options.showValidationFailures ?? false

    const step = getStepFromCache(cacheManager, currentStepId)
    const ancestors = resolveAncestors(cacheManager, metadataRegistry, currentStepId)
    const navigation = buildNavigationTree(options.navigationMetadata ?? [], options.currentStepPath ?? '')

    const validationFailures = showValidationFailures
      ? getStoredValidationFailures(evaluationResult, currentStepId)
      : []

    const blocks =
      validationFailures.length > 0
        ? attachValidationToBlocks(step.properties.blocks ?? [], validationFailures)
        : (step.properties.blocks ?? [])

    return {
      navigation,
      step: stripStepInternals(step),
      ancestors: ancestors.map(stripJourneyInternals),
      blocks,
      showValidationFailures,
      validationErrors: validationFailures.map(stripBlockId),
      answers: evaluationResult.context.global.answers,
      data: evaluationResult.context.global.data,
    }
  }
}

function getStepFromCache(cacheManager: ThunkCacheManager, stepId: NodeId): Evaluated<StepASTNode> {
  const result = cacheManager.get<Evaluated<StepASTNode>>(stepId)

  if (!result?.value) {
    throw new Error(`Step not found in cache: ${stepId}`)
  }

  return result.value
}

function stripStepInternals(step: Evaluated<StepASTNode>): RenderContext['step'] {
  const { onAction, onSubmission, blocks, ...properties } = step.properties

  return properties
}

function resolveAncestors(
  cacheManager: ThunkCacheManager,
  metadataRegistry: MetadataRegistry,
  stepId: NodeId,
): JourneyASTNode[] {
  const chain = getAncestorChain(stepId, metadataRegistry)
  const ancestorIds = chain.slice(0, -1)

  return ancestorIds.map(id => {
    const result = cacheManager.get<JourneyASTNode>(id)

    if (!result?.value) {
      throw new Error(`Ancestor not found in cache: ${id}`)
    }

    return result.value
  })
}

function stripJourneyInternals(journey: JourneyASTNode): JourneyAncestor {
  const { onAccess, children, steps, ...properties } = journey.properties

  return properties
}

function buildNavigationTree(metadata: JourneyMetadata[], currentStepPath: string): NavigationTree {
  return metadata.map(journey => toNavigationJourney(journey, currentStepPath))
}

function toNavigationJourney(stored: JourneyMetadata, currentStepPath: string): NavigationJourney {
  const children = stored.children.map(child => {
    if ('children' in child) {
      return toNavigationJourney(child, currentStepPath)
    }

    return toNavigationStep(child, currentStepPath)
  })

  return {
    type: 'journey',
    title: stored.title,
    description: stored.description,
    path: stored.path,
    active: children.some(child => child.active),
    hiddenFromNavigation: stored.hiddenFromNavigation,
    children,
  }
}

function toNavigationStep(stored: StepMetadata, currentStepPath: string): NavigationStep {
  return {
    type: 'step',
    title: stored.title,
    path: stored.path,
    active: stored.path === currentStepPath,
    hiddenFromNavigation: stored.hiddenFromNavigation,
  }
}

function getStoredValidationFailures(
  evaluationResult: EvaluationResult,
  currentStepId: NodeId,
): StepValidationFailure[] {
  const validation = evaluationResult.context.global.validation

  if (validation?.validated === true && validation.stepId === currentStepId) {
    return validation.failures
  }

  return []
}

function attachValidationToBlocks(
  blocks: Evaluated<BlockASTNode>[],
  failures: StepValidationFailure[],
): Evaluated<BlockASTNode>[] {
  const failuresByBlockId = groupFailuresByBlockId(failures)

  return blocks.map(block => attachValidationToBlock(block, failuresByBlockId))
}

function groupFailuresByBlockId(failures: StepValidationFailure[]): Map<NodeId, ValidationResult[]> {
  return failures.reduce((map, failure) => {
    const existing = map.get(failure.blockId) ?? []

    existing.push(stripBlockId(failure))
    map.set(failure.blockId, existing)

    return map
  }, new Map<NodeId, ValidationResult[]>())
}

function attachValidationToBlock(
  block: Evaluated<BlockASTNode>,
  failuresByBlockId: Map<NodeId, ValidationResult[]>,
): Evaluated<BlockASTNode> {
  const properties = walkPropertiesForBlocks(block.properties, failuresByBlockId)

  if (block.blockType !== BlockType.FIELD) {
    return { ...block, properties }
  }

  return {
    ...block,
    properties: {
      ...properties,
      validate: failuresByBlockId.get(block.id) ?? [],
    },
  }
}

/** Walks property values recursively to find and update nested blocks with validation. */
function walkPropertiesForBlocks(
  properties: Record<string, unknown>,
  failuresByBlockId: Map<NodeId, ValidationResult[]>,
): Record<string, unknown> {
  return Object.fromEntries(
    Object.entries(properties).map(([key, value]) => [key, walkValueForBlocks(value, failuresByBlockId)]),
  )
}

function walkValueForBlocks(value: unknown, failuresByBlockId: Map<NodeId, ValidationResult[]>): unknown {
  if (Array.isArray(value)) {
    return value.map(item => walkValueForBlocks(item, failuresByBlockId))
  }

  if (isBlockStructNode(value)) {
    return attachValidationToBlock(value, failuresByBlockId)
  }

  if (isObjectValue(value)) {
    return walkPropertiesForBlocks(value, failuresByBlockId)
  }

  return value
}

function stripBlockId(failure: StepValidationFailure): ValidationResult {
  const { blockId: _, ...validation } = failure

  return validation
}
