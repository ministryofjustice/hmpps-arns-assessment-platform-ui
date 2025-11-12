// eslint-disable-next-line max-classes-per-file
import { ExpressionType, FunctionType, LogicType, TransitionType } from '@form-engine/form/types/enums'
import { ASTNode, AstNodeId, NodeId, PseudoNodeId } from '@form-engine/core/types/engine.type'
import {
  ExpressionASTNode,
  FunctionASTNode,
  PredicateASTNode,
  ReferenceASTNode,
  LoadTransitionASTNode,
  AccessTransitionASTNode,
  SubmitTransitionASTNode,
} from '@form-engine/core/types/expressions.type'
import { BlockASTNode, JourneyASTNode, StepASTNode } from '@form-engine/core/types/structures.type'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { PipelineExpr, ReferenceExpr } from '@form-engine/form/types/expressions.type'
import {
  PseudoNodeType,
  PostPseudoNode,
  QueryPseudoNode,
  ParamsPseudoNode,
  DataPseudoNode,
  AnswerLocalPseudoNode,
  AnswerRemotePseudoNode,
} from '@form-engine/core/types/pseudoNodes.type'

type PredicateBuilderConfig = {
  subject?: ExpressionASTNode
  condition?: ExpressionASTNode
  negate?: boolean
  operands?: ExpressionASTNode[]
  operand?: ExpressionASTNode
}

type BlockType = 'basic' | 'field'

/**
 * Test data factory for creating AST nodes with fluent builders and automatic ID generation.
 *
 * @example
 * // Using fluent builders
 * const form = ASTTestFactory.journey()
 *   .withStep(step => step
 *     .withBlock('TextInput', 'field', block => block
 *       .withCode('firstName')
 *       .withLabel('First Name')
 *     )
 *   )
 *   .build()
 *
 * // Using preset scenarios
 * const form = ASTTestFactory.scenarios.withValidation()
 *
 * // Using test utilities
 * const nodeCount = ASTTestFactory.utils.countNodes(form)
 * const node = ASTTestFactory.utils.findNodeById(form, 5)
 */
export class ASTTestFactory {
  private static astNodeNextId = 1

  private static pseudoNodeNextId = 1

  /**
   * Reset the ID counter (useful between tests)
   */
  static resetIds(): void {
    this.astNodeNextId = 1
  }

  /**
   * Get the next available ID in NodeIDGenerator format
   * @param category - The ID category (defaults to 'compile_ast' for tests)
   */
  static getId(category: string = 'compile_ast'): AstNodeId {
    const id = this.astNodeNextId
    this.astNodeNextId += 1

    return `${category}:${id}` as AstNodeId
  }

  /**
   * Get the next available pseudo node ID
   */
  static getPseudoId(category: string = 'compile_pseudo'): PseudoNodeId {
    const id = this.pseudoNodeNextId
    this.pseudoNodeNextId += 1

    return `${category}:${id}` as PseudoNodeId
  }

  /**
   * Create a new JourneyBuilder for fluent journey construction
   */
  static journey(): JourneyBuilder {
    return new JourneyBuilder()
  }

  /**
   * Create a new StepBuilder for fluent step construction
   */
  static step(): StepBuilder {
    return new StepBuilder()
  }

  /**
   * Create a new BlockBuilder for fluent block construction
   */
  static block(variant: string, blockType: BlockType): BlockBuilder {
    return new BlockBuilder(variant, blockType)
  }

  /**
   * Create a new ExpressionBuilder for fluent expression construction
   */
  static expression<T = ExpressionASTNode>(type: ExpressionType | FunctionType | LogicType): ExpressionBuilder<T> {
    return new ExpressionBuilder<T>(type)
  }

  /**
   * Create a new TransitionBuilder for fluent transition construction
   */
  static transition(type: TransitionType): TransitionBuilder {
    return new TransitionBuilder(type)
  }

  static reference(path: string[]): ReferenceASTNode {
    return ASTTestFactory.expression(ExpressionType.REFERENCE).withPath(path).build() as ReferenceASTNode
  }

  static functionExpression(type: FunctionType, name: string, args: unknown[] = []): FunctionASTNode {
    return ASTTestFactory.expression<FunctionASTNode>(type)
      .withProperty('name', name)
      .withProperty('arguments', args)
      .build()
  }

  static predicate(type: LogicType, config: PredicateBuilderConfig = {}): PredicateASTNode {
    const builder = ASTTestFactory.expression(type)

    if (config.subject) {
      builder.withSubject(config.subject)
    }

    if (config.condition) {
      builder.withProperty('condition', config.condition)
    }

    if (config.negate !== undefined) {
      builder.withProperty('negate', config.negate)
    }

    if (config.operands) {
      builder.withProperty('operands', config.operands)
    }

    if (config.operand) {
      builder.withProperty('operand', config.operand)
    }

    return builder.build() as PredicateASTNode
  }

  /**
   * Create a POST pseudo node
   */
  static postPseudoNode(baseFieldCode: string): PostPseudoNode {
    return {
      id: ASTTestFactory.getPseudoId(),
      type: PseudoNodeType.POST,
      properties: {
        baseFieldCode,
      },
    }
  }

  /**
   * Create a QUERY pseudo node
   */
  static queryPseudoNode(paramName: string): QueryPseudoNode {
    return {
      id: ASTTestFactory.getPseudoId(),
      type: PseudoNodeType.QUERY,
      properties: {
        paramName,
      },
    }
  }

  /**
   * Create a PARAMS pseudo node
   */
  static paramsPseudoNode(paramName: string): ParamsPseudoNode {
    return {
      id: ASTTestFactory.getPseudoId(),
      type: PseudoNodeType.PARAMS,
      properties: {
        paramName,
      },
    }
  }

  /**
   * Create a DATA pseudo node
   */
  static dataPseudoNode(baseFieldCode: string): DataPseudoNode {
    return {
      id: ASTTestFactory.getPseudoId(),
      type: PseudoNodeType.DATA,
      properties: {
        baseFieldCode,
      },
    }
  }

  /**
   * Create an ANSWER_LOCAL pseudo node
   */
  static answerLocalPseudoNode(baseFieldCode: string, fieldNodeId: NodeId): AnswerLocalPseudoNode {
    return {
      id: ASTTestFactory.getPseudoId(),
      type: PseudoNodeType.ANSWER_LOCAL,
      properties: {
        baseFieldCode,
        fieldNodeId,
      },
    }
  }

  /**
   * Create an ANSWER_REMOTE pseudo node
   */
  static answerRemotePseudoNode(baseFieldCode: string): AnswerRemotePseudoNode {
    return {
      id: ASTTestFactory.getPseudoId(),
      type: PseudoNodeType.ANSWER_REMOTE,
      properties: {
        baseFieldCode,
      },
    }
  }

  static scenarios = {
    /**
     * Minimal form with single step and field
     */
    minimal: (): JourneyASTNode => {
      return ASTTestFactory.journey()
        .withStep(step => step.withBlock('TextInput', 'field', block => block.withCode('name').withLabel('Name')))
        .build()
    },

    /**
     * Form with validation expressions
     */
    withValidation: (): JourneyASTNode => {
      return ASTTestFactory.journey()
        .withStep(step =>
          step.withBlock('TextInput', 'field', block =>
            block
              .withCode('email')
              .withLabel('Email')
              .withValidation(
                ASTTestFactory.expression(ExpressionType.VALIDATION)
                  .withProperty(
                    'when',
                    ASTTestFactory.expression(LogicType.TEST)
                      .withSubject(
                        ASTTestFactory.expression(ExpressionType.REFERENCE).withPath(['answers', '@self']).build(),
                      )
                      .withProperty('condition', {
                        type: FunctionType.CONDITION,
                        name: 'isEmail',
                        arguments: [],
                      })
                      .build(),
                  )
                  .withProperty('message', 'Please enter a valid email')
                  .build(),
              ),
          ),
        )
        .build()
    },

    /**
     * Form with conditional fields
     */
    withConditionals: (): JourneyASTNode => {
      return ASTTestFactory.journey()
        .withStep(step =>
          step
            .withBlock('RadioInput', 'field', block =>
              block
                .withCode('hasChildren')
                .withLabel('Do you have children?')
                .withProperty('options', [
                  { value: 'yes', label: 'Yes' },
                  { value: 'no', label: 'No' },
                ]),
            )
            .withBlock('NumberInput', 'field', block =>
              block
                .withCode('childCount')
                .withLabel('How many children?')
                .withShowWhen(
                  ASTTestFactory.expression(LogicType.TEST)
                    .withSubject(
                      ASTTestFactory.expression(ExpressionType.REFERENCE).withPath(['answers', 'hasChildren']).build(),
                    )
                    .withProperty('condition', {
                      type: FunctionType.CONDITION,
                      name: 'equals',
                      arguments: ['yes'],
                    })
                    .build(),
                ),
            ),
        )
        .build()
    },

    /**
     * Generate a deeply nested form for testing traversal
     */
    deeplyNested: (depth: number = 5): JourneyASTNode => {
      const createNestedBlock = (level: number): BlockASTNode => {
        if (level === 0) {
          return ASTTestFactory.block('TextInput', 'field')
            .withCode(`field_${level}`)
            .withLabel(`Field ${level}`)
            .build()
        }

        return ASTTestFactory.block('Container', 'basic')
          .withProperty('blocks', [createNestedBlock(level - 1)])
          .build()
      }

      return ASTTestFactory.journey()
        .withStep(step => step.withProperty('blocks', [createNestedBlock(depth)]))
        .build()
    },
  }

  static utils = {
    /**
     * Count all nodes in a tree
     */
    countNodes: (root: ASTNode): number => {
      let count = 1

      const traverse = (node: any) => {
        if (!node) return

        if (node.properties instanceof Map) {
          for (const value of node.properties.values()) {
            if (ASTTestFactory.utils.isASTNode(value)) {
              count += 1
              traverse(value)
            } else if (Array.isArray(value)) {
              // eslint-disable-next-line no-loop-func
              value.forEach(item => {
                if (ASTTestFactory.utils.isASTNode(item)) {
                  count += 1
                  traverse(item)
                }
              })
            }
          }
        }
      }

      traverse(root)
      return count
    },

    /**
     * Find a node by ID
     */
    findNodeById: (root: ASTNode, targetId: string): ASTNode | null => {
      if (root.id === targetId) return root

      const traverse = (node: any): ASTNode | null => {
        if (!node) return null
        if (node.id === targetId) return node

        if (node.properties instanceof Map) {
          for (const value of node.properties.values()) {
            if (ASTTestFactory.utils.isASTNode(value)) {
              const found = traverse(value)
              if (found) return found
            } else if (Array.isArray(value)) {
              for (const item of value) {
                if (ASTTestFactory.utils.isASTNode(item)) {
                  const found = traverse(item)
                  if (found) return found
                }
              }
            }
          }
        }

        return null
      }

      return traverse(root)
    },

    /**
     * Check if value is an AST node
     */
    isASTNode: (value: any): value is ASTNode => {
      return value != null && typeof value === 'object' && 'type' in value && Object.values(ASTNodeType).includes(value.type)
    },

    /**
     * Get the depth of the tree
     */
    getDepth: (root: ASTNode): number => {
      const traverse = (node: any, currentDepth: number): number => {
        if (!node) return currentDepth

        let maxDepth = currentDepth

        if (node.properties instanceof Map) {
          for (const value of node.properties.values()) {
            if (ASTTestFactory.utils.isASTNode(value)) {
              maxDepth = Math.max(maxDepth, traverse(value, currentDepth + 1))
            } else if (Array.isArray(value)) {
              // eslint-disable-next-line no-loop-func
              value.forEach(item => {
                if (ASTTestFactory.utils.isASTNode(item)) {
                  maxDepth = Math.max(maxDepth, traverse(item, currentDepth + 1))
                }
              })
            }
          }
        }

        return maxDepth
      }

      return traverse(root, 0)
    },

    /**
     * Count nodes by type
     */
    countNodesByType: (root: ASTNode, type: ASTNodeType): number => {
      let count = root.type === type ? 1 : 0

      const traverse = (node: any) => {
        if (!node) return

        if (node.properties instanceof Map) {
          for (const value of node.properties.values()) {
            if (ASTTestFactory.utils.isASTNode(value)) {
              if (value.type === type) count += 1
              traverse(value)
            } else if (Array.isArray(value)) {
              // eslint-disable-next-line no-loop-func
              value.forEach(item => {
                if (ASTTestFactory.utils.isASTNode(item)) {
                  if (item.type === type) count += 1
                  traverse(item)
                }
              })
            }
          }
        }
      }

      traverse(root)
      return count
    },
  }
}

/**
 * Fluent builder for Journey nodes
 */
export class JourneyBuilder {
  private id?: string

  private properties: Map<string, any> = new Map()

  withId(id: string): this {
    this.id = id
    return this
  }

  withProperty(key: string, value: any): this {
    this.properties.set(key, value)
    return this
  }

  withStep(configFn?: (builder: StepBuilder) => StepBuilder): this {
    const stepBuilder = new StepBuilder()
    const step = configFn ? configFn(stepBuilder).build() : stepBuilder.build()

    const steps = this.properties.get('steps') || []
    steps.push(step)
    this.properties.set('steps', steps)

    return this
  }

  withMetadata(metadata: Record<string, any>): this {
    this.properties.set('metadata', metadata)
    return this
  }

  build(): JourneyASTNode {
    const nodeId = this.id ?? ASTTestFactory.getId()

    return {
      type: ASTNodeType.JOURNEY,
      id: nodeId,
      properties: this.properties,
    } as JourneyASTNode
  }
}

/**
 * Fluent builder for Step nodes
 */
export class StepBuilder {
  private id?: string

  private properties: Map<string, any> = new Map()

  withId(id: string): this {
    this.id = id
    return this
  }

  withProperty(key: string, value: any): this {
    this.properties.set(key, value)
    return this
  }

  withBlock(variant: string, blockType: BlockType, configFn?: (builder: BlockBuilder) => BlockBuilder): this {
    const blockBuilder = new BlockBuilder(variant, blockType)
    const block = configFn ? configFn(blockBuilder).build() : blockBuilder.build()

    const blocks = this.properties.get('blocks') || []
    blocks.push(block)
    this.properties.set('blocks', blocks)

    return this
  }

  withTitle(title: string): this {
    this.properties.set('title', title)
    return this
  }

  withDescription(description: string): this {
    this.properties.set('description', description)
    return this
  }

  build(): StepASTNode {
    const nodeId = this.id ?? ASTTestFactory.getId()

    return {
      type: ASTNodeType.STEP,
      id: nodeId,
      properties: this.properties,
    } as StepASTNode
  }
}

/**
 * Fluent builder for Block nodes
 */
export class BlockBuilder {
  private id?: string

  private properties: Map<string, any> = new Map()

  constructor(
    private variant: string,
    private blockType: BlockType,
  ) {}

  withId(id: string): this {
    this.id = id
    return this
  }

  withProperty(key: string, value: any): this {
    this.properties.set(key, value)
    return this
  }

  withCode(code: string | ExpressionASTNode): this {
    this.properties.set('code', code)
    return this
  }

  withLabel(label: string): this {
    this.properties.set('label', label)
    return this
  }

  withValue(value: any): this {
    this.properties.set('value', value)
    return this
  }

  withValidation(validation: ExpressionASTNode): this {
    this.properties.set('validate', validation)
    return this
  }

  withShowWhen(condition: ExpressionASTNode): this {
    this.properties.set('showWhen', condition)
    return this
  }

  build(): BlockASTNode {
    const nodeId = this.id ?? ASTTestFactory.getId()

    return {
      type: ASTNodeType.BLOCK,
      id: nodeId,
      variant: this.variant,
      blockType: this.blockType,
      properties: this.properties,
    } as BlockASTNode
  }
}

/**
 * Fluent builder for Expression nodes
 */
export class ExpressionBuilder<T = ExpressionASTNode> {
  private id?: string

  private properties: Map<string, any> = new Map()

  constructor(private expressionType: ExpressionType | FunctionType | LogicType) {}

  withId(id: string): this {
    this.id = id
    return this
  }

  withProperty(key: string, value: any): this {
    this.properties.set(key, value)
    return this
  }

  withPath(path: any[]): this {
    this.properties.set('path', path)
    return this
  }

  withSubject(subject: ExpressionASTNode): this {
    this.properties.set('subject', subject)
    return this
  }

  withCondition(condition: any): this {
    this.properties.set('condition', condition)
    return this
  }

  withPredicate(predicate: ExpressionASTNode): this {
    this.properties.set('predicate', predicate)
    return this
  }

  withThenValue(value: any): this {
    this.properties.set('thenValue', value)
    return this
  }

  withElseValue(value: any): this {
    this.properties.set('elseValue', value)
    return this
  }

  withSteps(steps: any[]): this {
    this.properties.set('steps', steps)
    return this
  }

  withCollection(collection: ReferenceExpr | PipelineExpr | any[]): this {
    this.properties.set('collection', collection)
    return this
  }

  withTemplate(nodes: ASTNode[]): this {
    this.properties.set('template', nodes)
    return this
  }

  withFallback(node: ASTNode): this {
    this.properties.set('fallback', node)
    return this
  }

  build(): T {
    const nodeId = this.id ?? ASTTestFactory.getId()

    // TODO: Simplify this once all AST nodes have been migrated to use plain object properties
    //  Currently we need to convert Map to object for migrated node types during the transition period
    //  After migration is complete, remove all these conditionals and always use object properties directly

    // Convert Map to object for migrated nodes: FunctionASTNode, PipelineASTNode, ReferenceASTNode, NextASTNode, FormatASTNode, CollectionASTNode, and ValidationASTNode
    const isFunctionType = Object.values(FunctionType).includes(this.expressionType as FunctionType)
    const isPipelineType = this.expressionType === ExpressionType.PIPELINE
    const isReferenceType = this.expressionType === ExpressionType.REFERENCE
    const isNextType = this.expressionType === ExpressionType.NEXT
    const isFormatType = this.expressionType === ExpressionType.FORMAT
    const isCollectionType = this.expressionType === ExpressionType.COLLECTION
    const isValidationType = this.expressionType === ExpressionType.VALIDATION

    let properties
    if (isFunctionType) {
      properties = {
        name: this.properties.get('name'),
        arguments: this.properties.get('arguments'),
      }
    } else if (isPipelineType) {
      properties = {
        input: this.properties.get('input'),
        steps: this.properties.get('steps'),
      }
    } else if (isReferenceType) {
      properties = {
        path: this.properties.get('path'),
      }
    } else if (isNextType) {
      const nextProperties: { goto: any; when?: any } = {
        goto: this.properties.get('goto'),
      }
      const when = this.properties.get('when')
      if (when !== undefined) {
        nextProperties.when = when
      }
      properties = nextProperties
    } else if (isFormatType) {
      properties = {
        template: this.properties.get('template'),
        arguments: this.properties.get('arguments'),
      }
    } else if (isCollectionType) {
      const collectionProperties: { collection: any; template: any; fallback?: any } = {
        collection: this.properties.get('collection'),
        template: this.properties.get('template'),
      }
      const fallback = this.properties.get('fallback')
      if (fallback !== undefined) {
        collectionProperties.fallback = fallback
      }
      properties = collectionProperties
    } else if (isValidationType) {
      const validationProperties: { when: any; message: any; submissionOnly?: boolean; details?: any } = {
        when: this.properties.get('when'),
        message: this.properties.get('message'),
      }
      const submissionOnly = this.properties.get('submissionOnly')
      if (submissionOnly !== undefined) {
        validationProperties.submissionOnly = submissionOnly
      }
      const details = this.properties.get('details')
      if (details !== undefined) {
        validationProperties.details = details
      }
      properties = validationProperties
    } else if (this.expressionType === LogicType.CONDITIONAL) {
      const conditionalProperties: { predicate: any; thenValue: any; elseValue?: any } = {
        predicate: this.properties.get('predicate'),
        thenValue: this.properties.get('thenValue'),
      }
      const elseValue = this.properties.get('elseValue')
      if (elseValue !== undefined) {
        conditionalProperties.elseValue = elseValue
      }
      properties = conditionalProperties
    } else if (this.expressionType === LogicType.TEST) {
      const testProperties: { subject: any; condition: any; negate: boolean } = {
        subject: this.properties.get('subject'),
        condition: this.properties.get('condition'),
        negate: this.properties.get('negate') ?? false,
      }
      properties = testProperties
    } else if (this.expressionType === LogicType.NOT) {
      const notProperties: { operand: any } = {
        operand: this.properties.get('operand'),
      }
      properties = notProperties
    } else if (this.expressionType === LogicType.AND) {
      const andProperties: { operands: any[] } = {
        operands: this.properties.get('operands') || [],
      }
      properties = andProperties
    } else {
      // Legacy nodes still using Map properties (will be removed after migration)
      properties = this.properties
    }

    return {
      type: ASTNodeType.EXPRESSION,
      id: nodeId,
      expressionType: this.expressionType,
      properties,
    } as T
  }
}

/**
 * Fluent builder for Transition nodes
 */
export class TransitionBuilder {
  private id?: string

  private properties: Map<string, any> = new Map()

  constructor(private transitionType: TransitionType) {}

  withId(id: string): this {
    this.id = id
    return this
  }

  withProperty(key: string, value: any): this {
    this.properties.set(key, value)
    return this
  }

  build(): LoadTransitionASTNode | AccessTransitionASTNode | SubmitTransitionASTNode {
    const nodeId = this.id ?? ASTTestFactory.getId()

    // TODO: Simplify this once all AST transition nodes have been migrated to use plain object properties
    //  Currently we need to convert Map to object for migrated node types during the transition period
    //  After migration is complete, remove all these conditionals and always use object properties directly

    const isLoadType = this.transitionType === TransitionType.LOAD
    const isAccessType = this.transitionType === TransitionType.ACCESS
    const isSubmitType = this.transitionType === TransitionType.SUBMIT

    let properties
    if (isLoadType) {
      properties = {
        effects: this.properties.get('effects'),
      }
    } else if (isAccessType) {
      properties = {
        guards: this.properties.get('guards'),
        effects: this.properties.get('effects'),
        redirect: this.properties.get('redirect'),
      }
    } else if (isSubmitType) {
      properties = {
        when: this.properties.get('when'),
        guards: this.properties.get('guards'),
        validate: this.properties.get('validate') ?? false,
        onAlways: this.properties.get('onAlways'),
        onValid: this.properties.get('onValid'),
        onInvalid: this.properties.get('onInvalid'),
      }
    } else {
      // Legacy transition nodes still using Map properties (will be removed after migration)
      properties = this.properties
    }

    return {
      type: ASTNodeType.TRANSITION,
      id: nodeId,
      transitionType: this.transitionType,
      properties,
    } as LoadTransitionASTNode | AccessTransitionASTNode | SubmitTransitionASTNode
  }
}
