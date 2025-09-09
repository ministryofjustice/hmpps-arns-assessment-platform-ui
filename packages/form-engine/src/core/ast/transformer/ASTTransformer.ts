import {
  isJourneyDefinition,
  isStepDefinition,
  isBlockDefinition,
  isFieldBlockDefinition,
  isCollectionBlockDefinition,
  isCompositeBlockDefinition,
} from '@form-engine/typeguards/structures'
import {
  isReferenceExpr,
  isPipelineExpr,
  isConditionalExpr,
  isValidationExpr,
  isExpression,
} from '@form-engine/typeguards/expressions'
import { isFunctionExpr } from '@form-engine/typeguards/functions'
import {
  isPredicateExpr,
  isPredicateTestExpr,
  isPredicateNotExpr,
  isPredicateAndExpr,
  isPredicateOrExpr,
  isPredicateXorExpr,
} from '@form-engine/typeguards/predicates'
import {
  isTransition,
  isLoadTransition,
  isAccessTransition,
  isSubmitTransition,
} from '@form-engine/typeguards/transitions'
import ASTTransformationError from '@form-engine/errors/ASTTransformationError'
import UnknownNodeTypeError from '@form-engine/errors/UnknownNodeTypeError'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { ExpressionType, LogicType, TransitionType } from '@form-engine/form/types/enums'
import {
  ASTNode,
  JourneyASTNode,
  StepASTNode,
  BlockASTNode,
  ExpressionASTNode,
  ReferenceASTNode,
  PipelineASTNode,
  ConditionalASTNode,
  PredicateASTNode,
  FunctionASTNode,
  ValidationASTNode,
  TransitionASTNode,
  LoadTransitionASTNode,
  AccessTransitionASTNode,
  SubmitTransitionASTNode,
} from '../types/nodes.type'

/**
 * ASTTransformer: Core transformation engine for the form system
 * Converts JSON form configurations into Abstract Syntax Tree (AST) nodes.
 */
export class ASTTransformer {
  /**
   * Main entry point for transformation
   * Sets up error boundary and initiates recursive transformation
   */
  static transform(json: any): ASTNode {
    // Path tracks location in JSON tree for error reporting
    const path: string[] = []

    try {
      return this.transformNode(json, path)
    } catch (error) {
      if (error instanceof Error) {
        throw error
      }

      // Wrap unknown errors with transformation context
      throw new ASTTransformationError({
        message: 'Failed to transform JSON to AST',
        path,
        node: json,
        cause: error as Error,
      })
    }
  }

  /**
   * Central dispatcher: Detects node type and routes to appropriate transformer
   * Uses typeguards to identify structures, expressions, and transitions
   */
  private static transformNode(json: any, path: string[]): ASTNode {
    if (!json || typeof json !== 'object') {
      throw new InvalidNodeError({
        message: `Invalid node: expected object, got ${typeof json}`,
        path,
        node: json,
        expected: 'object',
        actual: typeof json,
      })
    }

    // Journey: Top-level form flow container
    if (isJourneyDefinition(json)) {
      return this.transformJourney(json, path)
    }

    // Step: Individual page in a journey
    if (isStepDefinition(json)) {
      return this.transformStep(json, path)
    }

    // Block: UI component (field, composite, collection)
    if (isBlockDefinition(json)) {
      return this.transformBlock(json, path)
    }

    // Expressions: References, conditionals, pipelines, functions
    if (isExpression(json)) {
      return this.transformExpression(json, path)
    }

    // Transitions: Lifecycle hooks (load, access, submit)
    if (isTransition(json)) {
      return this.transformTransition(json, path)
    }

    throw new UnknownNodeTypeError({
      nodeType: json?.type,
      path,
      node: json,
      validTypes: ['Journey', 'Step', 'Block', 'Expression', 'Transition'],
    })
  }

  /**
   * Transform Journey node: Top-level form container
   * Extracts properties and recursively transforms nested steps/children
   */
  private static transformJourney(json: any, path: string[]): JourneyASTNode {
    // Destructure to separate type from actual properties
    const { type, ...dataProperties } = json
    // Convert all properties to Map, transforming nested nodes
    const properties = this.transformProperties(dataProperties, [...path, 'journey'])

    return {
      type: ASTNodeType.JOURNEY,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Step node: Single page within a journey
   * Contains blocks and transitions for user interaction
   */
  private static transformStep(json: any, path: string[]): StepASTNode {
    // Destructure to separate type from actual properties
    const { type, ...dataProperties } = json
    // Properties include blocks[], onLoad, onAccess, onSubmission
    const properties = this.transformProperties(dataProperties, [...path, 'step'])

    return {
      type: ASTNodeType.STEP,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Block node: UI components that render in steps
   * Determines block category and preserves variant for rendering
   */
  private static transformBlock(json: any, path: string[]): BlockASTNode {
    // Destructure to separate type from actual properties
    const { variant, type, ...dataProperties } = json
    // Convert all properties to Map, transforming nested nodes
    const properties = this.transformProperties(dataProperties, [...path, 'block', variant])

    // Classify block for AST traversal optimization
    let blockType: 'basic' | 'field' | 'collection' | 'composite'

    if (isFieldBlockDefinition(json)) {
      blockType = 'field'
    } else if (isCollectionBlockDefinition(json)) {
      blockType = 'collection'
    } else if (isCompositeBlockDefinition(json)) {
      blockType = 'composite'
    } else {
      blockType = 'basic'
    }

    return {
      type: ASTNodeType.BLOCK,
      variant,
      blockType,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Expression node: Dynamic values and logic
   * Handles references, pipelines, conditionals, validations, predicates, functions
   */
  private static transformExpression(json: any, path: string[]): ExpressionASTNode {
    // Handle reference expressions
    if (isReferenceExpr(json)) {
      return this.transformReference(json, path)
    }

    // Handle pipeline expressions
    if (isPipelineExpr(json)) {
      return this.transformPipeline(json, path)
    }

    // Handle conditional expressions
    if (isConditionalExpr(json)) {
      return this.transformConditional(json, path)
    }

    // Handle validation expressions
    if (isValidationExpr(json)) {
      return this.transformValidation(json, path)
    }

    // Handle predicate expressions
    if (isPredicateExpr(json)) {
      return this.transformPredicate(json, path)
    }

    // Handle function expressions
    if (isFunctionExpr(json)) {
      return this.transformFunction(json, path)
    }

    // Fallback: Unknown expression types preserved as generic nodes
    const { type, ...dataProperties } = json
    const properties = new Map<string, ASTNode | any>()

    for (const [key, value] of Object.entries(dataProperties)) {
      properties.set(key, this.transformValue(value, [...path, key]))
    }

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: json.type,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Reference expression: Points to data in context
   * Examples: Answer('field'), Data('external.value'), Self(), Item()
   */
  private static transformReference(json: any, _path: string[]): ReferenceASTNode {
    const properties = new Map<string, ASTNode | any>()

    // Path segments for data resolution (e.g., ['answers', 'email'])
    properties.set('path', json.path)

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: ExpressionType.REFERENCE,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Pipeline expression: Sequential data transformations
   * Input flows through each step: input -> step1 -> step2 -> output
   */
  private static transformPipeline(json: any, path: string[]): PipelineASTNode {
    const properties = new Map<string, ASTNode | any>()

    // Initial value to transform
    properties.set('input', this.transformNode(json.input, [...path, 'input']))

    // Transform each pipeline step
    const steps = json.steps.map((step: any, i: number) => {
      const result: any = {
        name: step.name,
      }

      // Optional arguments for transformer functions
      if (step.args) {
        result.args = step.args.map((arg: any, j: number) =>
          this.transformValue(arg, [...path, 'steps', i.toString(), 'args', j.toString()]),
        )
      }

      return result
    })

    properties.set('steps', steps)

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: ExpressionType.PIPELINE,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Conditional expression: If-then-else logic
   * Evaluates predicate to choose between two values
   */
  private static transformConditional(json: any, path: string[]): ConditionalASTNode {
    const properties = new Map<string, ASTNode | any>()

    if (json.predicate) {
      properties.set('predicate', this.transformNode(json.predicate, [...path, 'predicate']))
    }

    if (json.then !== undefined) {
      properties.set('thenValue', this.transformValue(json.then, [...path, 'then']))
    }

    if (json.else !== undefined) {
      properties.set('elseValue', this.transformValue(json.else, [...path, 'else']))
    }

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: LogicType.CONDITIONAL,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Validation expression: Field validation rules
   * Contains predicate condition and error message
   */
  private static transformValidation(json: any, path: string[]): ValidationASTNode {
    const properties = new Map<string, ASTNode | any>()

    if (json.when) {
      properties.set('when', this.transformNode(json.when, [...path, 'when']))
    }

    properties.set('message', json.message || '')

    if (json.submissionOnly !== undefined) {
      properties.set('submissionOnly', json.submissionOnly)
    }

    if (json.details) {
      properties.set('details', json.details)
    }

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: ExpressionType.VALIDATION,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Predicate expression: Boolean logic operators
   * Handles TEST, AND, OR, XOR, NOT operations
   */
  private static transformPredicate(json: any, path: string[]): PredicateASTNode {
    const predicateType = json.type
    const properties = new Map<string, ASTNode | any>()

    // TEST: subject.condition with optional negation
    if (isPredicateTestExpr(json)) {
      properties.set('subject', this.transformNode(json.subject, [...path, 'subject']))
      properties.set('negate', json.negate)
      properties.set('condition', this.transformNode(json.condition, [...path, 'condition']))
    } else if (isPredicateNotExpr(json)) {
      // NOT: Single operand negation
      properties.set('operand', this.transformNode(json.operand, [...path, 'operand']))
    } else if (isPredicateAndExpr(json) || isPredicateOrExpr(json) || isPredicateXorExpr(json)) {
      // AND/OR/XOR: Multiple operands (min 2)
      const operands = json.operands.map((operand: any, i: number) =>
        this.transformNode(operand, [...path, 'operands', i.toString()]),
      )

      properties.set('operands', operands)
    }

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: predicateType,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Function expression: Registered function calls
   * Types: Condition (boolean), Transformer (value), Effect (side-effect)
   */
  private static transformFunction(json: any, path: string[]): FunctionASTNode {
    const funcType = json.type
    const properties = new Map<string, ASTNode | any>()

    properties.set('name', json.name)

    // Transform arguments recursively
    const args = json.arguments.map((arg: any, i: number) =>
      this.transformValue(arg, [...path, 'arguments', i.toString()]),
    )

    properties.set('arguments', args)

    return {
      type: ASTNodeType.EXPRESSION,
      expressionType: funcType,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Transition node: Lifecycle event handlers
   * Routes to specific transition type (Load, Access, Submit)
   */
  private static transformTransition(json: any, path: string[]): TransitionASTNode {
    if (isLoadTransition(json)) {
      return this.transformLoadTransition(json, path)
    }

    if (isAccessTransition(json)) {
      return this.transformAccessTransition(json, path)
    }

    if (isSubmitTransition(json)) {
      return this.transformSubmitTransition(json, path)
    }

    const { type, ...dataProperties } = json
    const properties = new Map<string, ASTNode | any>()

    for (const [key, value] of Object.entries(dataProperties)) {
      properties.set(key, this.transformValue(value, [...path, key]))
    }

    return {
      type: ASTNodeType.TRANSITION,
      transitionType: json.type,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Load transition: Data loading on step/journey access
   * Executes effects before rendering
   */
  private static transformLoadTransition(json: any, path: string[]): LoadTransitionASTNode {
    const properties = new Map<string, ASTNode | any>()

    const effects = json.effects.map((effect: any, i: number) =>
      this.transformNode(effect, [...path, 'effects', i.toString()]),
    )

    properties.set('effects', effects)

    return {
      type: ASTNodeType.TRANSITION,
      transitionType: TransitionType.LOAD,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Access transition: Guards and analytics
   * Controls access and tracks user navigation
   */
  private static transformAccessTransition(json: any, path: string[]): AccessTransitionASTNode {
    const properties = new Map<string, ASTNode | any>()

    if (json.guards) {
      properties.set('guards', this.transformNode(json.guards, [...path, 'guards']))
    }

    if (Array.isArray(json.effects)) {
      const effects = json.effects.map((effect: any, i: number) =>
        this.transformNode(effect, [...path, 'effects', i.toString()]),
      )

      properties.set('effects', effects)
    }

    if (Array.isArray(json.redirect)) {
      const redirect = json.redirect.map((r: any, i: number) =>
        this.transformNode(r, [...path, 'redirect', i.toString()]),
      )

      properties.set('redirect', redirect)
    }

    return {
      type: ASTNodeType.TRANSITION,
      transitionType: TransitionType.ACCESS,
      properties,
      raw: json,
    }
  }

  /**
   * Transform Submit transition: Form submission handling
   * Manages validation, effects, and navigation on submit
   */
  private static transformSubmitTransition(json: any, path: string[]): SubmitTransitionASTNode {
    const properties = new Map<string, ASTNode | any>()

    if (json.when) {
      properties.set('when', this.transformNode(json.when, [...path, 'when']))
    }

    if (json.guards) {
      properties.set('guards', this.transformNode(json.guards, [...path, 'guards']))
    }

    // Default to validation enabled unless explicitly false
    properties.set('validate', json.validate !== false)

    // Helper to transform submission branches (onAlways/onValid/onInvalid)
    const transformBranch = (branch: any, branchPath: string[]) => {
      if (!branch) {
        return undefined
      }

      const result: any = {}

      if (Array.isArray(branch.effects)) {
        result.effects = branch.effects.map((effect: any, i: number) =>
          this.transformNode(effect, [...branchPath, 'effects', i.toString()]),
        )
      }

      if (Array.isArray(branch.next)) {
        result.next = branch.next.map((n: any, i: number) =>
          this.transformNode(n, [...branchPath, 'next', i.toString()]),
        )
      }

      return result
    }

    if (json.onAlways) {
      properties.set('onAlways', transformBranch(json.onAlways, [...path, 'onAlways']))
    }

    if (json.onValid) {
      properties.set('onValid', transformBranch(json.onValid, [...path, 'onValid']))
    }

    if (json.onInvalid) {
      properties.set('onInvalid', transformBranch(json.onInvalid, [...path, 'onInvalid']))
    }

    return {
      type: ASTNodeType.TRANSITION,
      transitionType: TransitionType.SUBMIT,
      properties,
      raw: json,
    }
  }

  /**
   * Transform properties: Convert object to Map with recursive transformation
   * Enables efficient property access and modification in AST
   */
  private static transformProperties(obj: any, path: string[]): Map<string, ASTNode | any> {
    const properties = new Map<string, ASTNode | any>()

    for (const [key, value] of Object.entries(obj)) {
      const propPath = [...path, key]
      const transformedValue = this.transformValue(value, propPath)

      properties.set(key, transformedValue)
    }

    return properties
  }

  /**
   * Transform value: Recursive processor for any JSON value
   * Detects and transforms nested nodes while preserving primitives
   */
  private static transformValue(value: any, path: string[]): any {
    // Preserve null/undefined as-is
    if (value === null || value === undefined) {
      return value
    }

    // Primitives (string, number, boolean) pass through
    if (typeof value !== 'object') {
      return value
    }

    // Arrays: Transform each element recursively
    if (Array.isArray(value)) {
      return value.map((item, index) => {
        // Recursively transform each array item
        return this.transformValue(item, [...path, index.toString()])
      })
    }

    // Detect AST nodes and transform them
    if (this.isNode(value)) {
      return this.transformNode(value, path)
    }

    // Plain objects: Recursively check properties for nested nodes
    // Critical for finding blocks inside component properties
    const result: any = {}

    for (const [key, val] of Object.entries(value)) {
      result[key] = this.transformValue(val, [...path, key])
    }

    return result
  }

  /**
   * Node detection: Identifies objects that are AST nodes
   * Nodes have a 'type' field and match known patterns
   */
  private static isNode(value: any): boolean {
    // Must be an object
    if (!value || typeof value !== 'object') {
      return false
    }

    // Arrays are not nodes (but may contain nodes)
    if (Array.isArray(value)) {
      return false
    }

    // Nodes must have a string type field
    if (!value.type || typeof value.type !== 'string') {
      return false
    }

    // Check against all known node types
    return (
      isJourneyDefinition(value) ||
      isStepDefinition(value) ||
      isBlockDefinition(value) ||
      isExpression(value) ||
      isTransition(value)
    )
  }
}
