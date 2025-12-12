import { FieldBlockASTNode, JourneyASTNode } from '@form-engine/core/types/structures.type'
import NodeRegistry from '@form-engine/core/ast/registration/NodeRegistry'
import MetadataRegistry from '@form-engine/core/ast/registration/MetadataRegistry'
import { ASTNode } from '@form-engine/core/types/engine.type'
import { PseudoNode, PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import {
  StructuralContext,
  structuralTraverse,
  StructuralVisitResult,
  VisitorResult,
} from '@form-engine/core/ast/traverser/StructuralTraverser'
import {
  isAccessTransitionNode,
  isActionTransitionNode,
  isLoadTransitionNode,
  isSubmitTransitionNode,
} from '@form-engine/core/typeguards/transition-nodes'
import {
  isBlockStructNode,
  isFieldBlockStructNode,
  isJourneyStructNode,
  isStepStructNode,
} from '@form-engine/core/typeguards/structure-nodes'
import { isCollectionExprNode, isReferenceExprNode } from '@form-engine/core/typeguards/expression-nodes'
import { isASTNode } from '@form-engine/core/typeguards/nodes'
import { isMapValue, isObjectValue } from '@form-engine/typeguards/primitives'

type RelevantNode = ASTNode | PseudoNode

const JOURNEY_ALLOWED_PROPS = new Set(['children', 'steps', 'view'])
const STEP_ALLOWED_PROPS = new Set(['blocks', 'view', 'onSubmission'])
const JOURNEY_TRANSITION_PROPS = new Set(['onLoad', 'onAccess'])
const VALIDATION_PROPS = new Set(['code', 'validate', 'dependent'])

/**
 * Find all nodes relevant for a unified artefact compilation
 *
 * This creates a single artefact with smart property filtering based on whether
 * a step is the current step being rendered or not.
 *
 * For the CURRENT STEP (isCurrentStep = true):
 * - Full traversal of all properties (blocks with rendering properties)
 * - All transitions: onLoad, onAccess, onAction, onSubmission
 * - All block properties (including rendering properties)
 *
 * For ANCESTOR journeys/steps:
 * - The journey/step node itself
 * - onLoad transitions (already fired, affect current step)
 * - onAccess transitions (already fired, affect current step)
 *
 * For OTHER STEPS (not current, not ancestor):
 * - The step node itself (for navigation metadata)
 * - onSubmission transitions (for journey navigation)
 * - Block validation properties (code, validate, dependent) with all sub-nodes
 * - Nested field blocks discovered recursively on any property
 * - NO rendering properties (label, hint, items, etc.) from non-field blocks
 *
 * This approach:
 * - Creates one artefact with one handler set
 * - Effects run once
 * - Skips evaluating rendering thunks for off-screen steps
 *
 * @param rootNode - Root journey node to search from
 * @param nodeRegistry - Registry containing all nodes
 * @param metadataRegistry - Registry containing node metadata (isAncestorOfStep, isCurrentStep, etc.)
 * @returns Array of all relevant AST and pseudo nodes for unified artifact compilation
 */
export function findRelevantNodes(
  rootNode: JourneyASTNode,
  nodeRegistry: NodeRegistry,
  metadataRegistry: MetadataRegistry,
) {
  const nodes: RelevantNode[] = []
  const seenIds = new Set<string>()

  const addNode = (node: RelevantNode) => {
    if (seenIds.has(node.id)) {
      return
    }

    seenIds.add(node.id)
    nodes.push(node)
  }

  // Tracks when we're inside the current step or a relevant transition subtree
  // so we can disable property filtering and do a full traversal.
  let currentStepDepth = 0
  let transitionDepth = 0
  const transitionRoots = new Set<string>()

  // Track structural ownership for transition relevance checks.
  const journeyOrStepStack: (JourneyASTNode | ASTNode)[] = []
  const stepStack: ASTNode[] = []

  const inFullTraversalScope = () => currentStepDepth > 0 || transitionDepth > 0

  const shouldIncludeTransition = (node: ASTNode): boolean => {
    if (isLoadTransitionNode(node) || isAccessTransitionNode(node)) {
      const owner = journeyOrStepStack.at(-1)

      if (!owner) {
        return false
      }

      return metadataRegistry.get(owner.id, 'isAncestorOfStep', false) ||
        metadataRegistry.get(owner.id, 'isCurrentStep', false)
    }

    if (isActionTransitionNode(node)) {
      const ownerStep = stepStack.at(-1)

      return ownerStep != null && metadataRegistry.get(ownerStep.id, 'isCurrentStep', false)
    }

    if (isSubmitTransitionNode(node)) {
      // Submit transitions are only relevant when owned by a Step
      return stepStack.length > 0
    }

    return false
  }

  const nestedFieldBlockScanVisited = new WeakSet<object>()
  const processedNestedFieldBlockIds = new Set<string>()

  structuralTraverse(rootNode, {
    enterNode: (node: ASTNode): VisitorResult => {
      const isJourney = isJourneyStructNode(node)
      const isStep = isStepStructNode(node)

      if (isJourney || isStep) {
        journeyOrStepStack.push(node)
      }

      if (isStep) {
        stepStack.push(node)
      }

      // Full traversal inside current step or included transitions
      if (inFullTraversalScope()) {
        addNode(node)
        return StructuralVisitResult.CONTINUE
      }

      // Enter current step scope (full traversal for all descendants)
      if (isStep && metadataRegistry.get(node.id, 'isCurrentStep', false)) {
        currentStepDepth += 1
        addNode(node)
        return StructuralVisitResult.CONTINUE
      }

      // Handle transitions in-line (no separate full-tree scans)
      if (
        isLoadTransitionNode(node) ||
        isAccessTransitionNode(node) ||
        isActionTransitionNode(node) ||
        isSubmitTransitionNode(node)
      ) {
        if (!shouldIncludeTransition(node)) {
          return StructuralVisitResult.SKIP
        }

        transitionDepth += 1
        transitionRoots.add(node.id)
        addNode(node)

        return StructuralVisitResult.CONTINUE
      }

      addNode(node)
      return StructuralVisitResult.CONTINUE
    },

    exitNode: (node: ASTNode): VisitorResult => {
      if (transitionRoots.delete(node.id)) {
        transitionDepth -= 1
      }

      if (isStepStructNode(node)) {
        if (metadataRegistry.get(node.id, 'isCurrentStep', false)) {
          currentStepDepth -= 1
        }

        stepStack.pop()
      }

      if (isJourneyStructNode(node) || isStepStructNode(node)) {
        journeyOrStepStack.pop()
      }

      return StructuralVisitResult.CONTINUE
    },

    /**
     * Property filtering for non-current steps
     *
     * Current step and included transitions get full traversal.
     * Other steps/blocks get filtered properties for validation/navigation only.
     */
    enterProperty: (key: string, value: any, ctx: StructuralContext): VisitorResult => {
      if (inFullTraversalScope()) {
        return StructuralVisitResult.CONTINUE
      }

      const { parent } = ctx

      // Journey nodes: traverse structure and relevant transitions (ancestors only)
      if (isJourneyStructNode(parent)) {
        if (JOURNEY_ALLOWED_PROPS.has(key)) {
          return StructuralVisitResult.CONTINUE
        }

        if (JOURNEY_TRANSITION_PROPS.has(key) && metadataRegistry.get(parent.id, 'isAncestorOfStep', false)) {
          return StructuralVisitResult.CONTINUE
        }

        if (isCollectionExprNode(value)) {
          return StructuralVisitResult.CONTINUE
        }

        return StructuralVisitResult.SKIP
      }

      // Step nodes (non-current): traverse blocks + view + onSubmission only
      if (isStepStructNode(parent)) {
        if (STEP_ALLOWED_PROPS.has(key)) {
          return StructuralVisitResult.CONTINUE
        }

        if (isCollectionExprNode(value)) {
          return StructuralVisitResult.CONTINUE
        }

        return StructuralVisitResult.SKIP
      }

      // Block nodes (non-current step): validation properties + nested field block discovery
      if (isBlockStructNode(parent)) {
        if (VALIDATION_PROPS.has(key)) {
          return StructuralVisitResult.CONTINUE
        }

        if (isCollectionExprNode(value)) {
          return StructuralVisitResult.CONTINUE
        }

        if (isBlockStructNode(value)) {
          return StructuralVisitResult.CONTINUE
        }

        // For other properties: discover nested field blocks (but don't add other nodes)
        collectNestedFieldBlocks(value, addNode, nestedFieldBlockScanVisited, processedNestedFieldBlockIds)

        return StructuralVisitResult.SKIP
      }

      return StructuralVisitResult.CONTINUE
    },
  })

  findRelevantPseudoNodes(nodes, nodeRegistry).forEach(addNode)

  return nodes
}

/**
 * Find all pseudo nodes referenced by the given AST nodes
 * @param nodes - Array of AST nodes to scan for references
 * @param nodeRegistry - Registry containing all pseudo nodes
 */
export function findRelevantPseudoNodes(nodes: (ASTNode | PseudoNode)[], nodeRegistry: NodeRegistry): PseudoNode[] {
  // Extract identifiers from reference nodes
  const identifiers = {
    answers: new Set<string>(), // Answer() and Post() base field codes
    data: new Set<string>(), // Data() base property names
    query: new Set<string>(), // Query() param names
    params: new Set<string>(), // Params() param names
  }

  nodes.forEach(node => {
    if (!isReferenceExprNode(node)) {
      return
    }

    const refNode = node
    const path = refNode.properties.path as string[]

    if (!Array.isArray(path) || path.length < 2) {
      return
    }

    const source = path[0] // 'answers', 'data', 'post', 'query', 'params'
    const identifier = path[1] // 'firstName', 'user', 'redirect_url', etc.

    switch (source) {
      case 'answers':
      case 'post': {
        // Extract base field code (before the dot)
        const baseFieldCode = identifier.split('.')[0]
        identifiers.answers.add(baseFieldCode)
        break
      }
      case 'data': {
        // Extract base property name (before the dot)
        const baseProperty = identifier.split('.')[0]
        identifiers.data.add(baseProperty)
        break
      }
      case 'query':
        identifiers.query.add(identifier)
        break

      case 'params':
        identifiers.params.add(identifier)
        break
      default:
        break
    }
  })

  // Use the NodeRegistry pseudo node index for O(1) lookups
  const results: PseudoNode[] = []
  const seen = new Set<string>()

  const add = (pseudoNode: PseudoNode | undefined) => {
    if (!pseudoNode || seen.has(pseudoNode.id)) {
      return
    }

    seen.add(pseudoNode.id)
    results.push(pseudoNode)
  }

  identifiers.answers.forEach(baseFieldCode => {
    add(nodeRegistry.findPseudoNode(PseudoNodeType.ANSWER_LOCAL, baseFieldCode))
    add(nodeRegistry.findPseudoNode(PseudoNodeType.ANSWER_REMOTE, baseFieldCode))
    add(nodeRegistry.findPseudoNode(PseudoNodeType.POST, baseFieldCode))
  })

  identifiers.data.forEach(baseProperty => {
    add(nodeRegistry.findPseudoNode(PseudoNodeType.DATA, baseProperty))
  })

  identifiers.query.forEach(paramName => {
    add(nodeRegistry.findPseudoNode(PseudoNodeType.QUERY, paramName))
  })

  identifiers.params.forEach(paramName => {
    add(nodeRegistry.findPseudoNode(PseudoNodeType.PARAMS, paramName))
  })

  return results
}

/**
 * Recursively traverse a value looking for nested field blocks.
 * When a field block is found, collect it and its validation properties.
 * This enables validation discovery for field blocks nested on arbitrary properties.
 */
function collectNestedFieldBlocks(
  value: unknown,
  addNode: (node: RelevantNode) => void,
  visited: WeakSet<object>,
  processedFieldBlockIds: Set<string>,
): void {
  if (value == null || typeof value !== 'object') {
    return
  }

  const obj = value as object

  if (visited.has(obj)) {
    return
  }

  visited.add(obj)

  // If value is a field block, collect it and its validation properties
  if (isFieldBlockStructNode(value)) {
    collectFieldBlockValidationNodes(value, addNode, visited, processedFieldBlockIds)
    return
  }

  // If value is any other AST node, traverse its properties looking for nested blocks
  if (isASTNode(value)) {
    const props = (value as any).properties

    if (props) {
      Object.values(props).forEach(propValue => {
        collectNestedFieldBlocks(propValue, addNode, visited, processedFieldBlockIds)
      })
    }

    return
  }

  // If value is an array, check each element
  if (Array.isArray(value)) {
    value.forEach(element => {
      collectNestedFieldBlocks(element, addNode, visited, processedFieldBlockIds)
    })

    return
  }

  // If value is a Map, scan values
  if (isMapValue(value)) {
    Array.from(value.values()).forEach(mapValue => {
      collectNestedFieldBlocks(mapValue, addNode, visited, processedFieldBlockIds)
    })

    return
  }

  // If value is a plain object, check each property
  if (isObjectValue(value)) {
    Object.values(value as Record<string, unknown>).forEach(objValue => {
      collectNestedFieldBlocks(objValue, addNode, visited, processedFieldBlockIds)
    })
  }
}

/**
 * Collect a field block and all nodes under its validation properties.
 * Also recursively discovers nested field blocks in other properties.
 */
function collectFieldBlockValidationNodes(
  fieldBlock: FieldBlockASTNode,
  addNode: (node: RelevantNode) => void,
  scanVisited: WeakSet<object>,
  processedFieldBlockIds: Set<string>,
): void {
  if (processedFieldBlockIds.has(fieldBlock.id)) {
    return
  }

  processedFieldBlockIds.add(fieldBlock.id)

  // Add the field block itself
  addNode(fieldBlock)

  const collectVisited = new WeakSet<object>()

  // Traverse and add all nodes under validation properties
  VALIDATION_PROPS.forEach(propKey => {
    const propValue = fieldBlock.properties[propKey]

    if (propValue !== undefined) {
      collectAllAstNodes(propValue, addNode, collectVisited)
    }
  })

  // Continue looking for nested field blocks in OTHER properties
  Object.entries(fieldBlock.properties).forEach(([key, propValue]) => {
    if (!VALIDATION_PROPS.has(key)) {
      collectNestedFieldBlocks(propValue, addNode, scanVisited, processedFieldBlockIds)
    }
  })
}

/**
 * Collect all AST nodes within a value.
 *
 * Used for field-block validation discovery where we need the full subtree,
 * without paying the cost of full StructuralTraverser context construction.
 */
function collectAllAstNodes(value: unknown, addNode: (node: RelevantNode) => void, visited: WeakSet<object>): void {
  if (value == null || typeof value !== 'object') {
    return
  }

  const obj = value as object

  if (visited.has(obj)) {
    return
  }

  visited.add(obj)

  if (isASTNode(value)) {
    addNode(value)

    const props = (value as any).properties

    if (props) {
      Object.values(props).forEach(propValue => {
        collectAllAstNodes(propValue, addNode, visited)
      })
    }

    return
  }

  if (Array.isArray(value)) {
    value.forEach(el => {
      collectAllAstNodes(el, addNode, visited)
    })

    return
  }

  if (isMapValue(value)) {
    Array.from(value.values()).forEach(mapValue => {
      collectAllAstNodes(mapValue, addNode, visited)
    })

    return
  }

  if (isObjectValue(value)) {
    Object.values(value).forEach(objValue => {
      collectAllAstNodes(objValue, addNode, visited)
    })
  }
}

/**
 * Collect all OnSubmit transition nodes from all steps
 *
 * OnSubmit transitions define navigation and validation behavior.
 * These are needed from all steps for journey-wide navigation logic.
 *
 * @param rootNode - Root journey node to search from
 * @returns Array of all AST nodes within OnSubmit transitions
 */
export function collectOnSubmitTransitionsFromAllSteps(rootNode: JourneyASTNode): ASTNode[] {
  const nodes: ASTNode[] = []

  structuralTraverse(rootNode, {
    enterNode: (node: ASTNode, ctx: StructuralContext): VisitorResult => {
      if (!isSubmitTransitionNode(node)) {
        return StructuralVisitResult.CONTINUE
      }

      // Find the Step node that owns this OnSubmit transition
      const ownerNode = ctx.ancestors.filter(ancestor => isStepStructNode(ancestor)).at(-1)

      if (ownerNode) {
        // Traverse this OnSubmit subtree
        structuralTraverse(node, {
          enterNode(childNode: ASTNode): VisitorResult {
            nodes.push(childNode)
            return StructuralVisitResult.CONTINUE
          },
        })
      }

      return StructuralVisitResult.SKIP
    },
  })

  return nodes
}
