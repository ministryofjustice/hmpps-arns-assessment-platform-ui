import { ExpressionType, FunctionType, LogicType, TransitionType } from '@form-engine/form/types/enums'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { ASTNode } from '@form-engine/core/types/engine.type'

/**
 * Expression AST node - represents any expression in the form
 */
export interface ExpressionASTNode extends ASTNode {
  type: ASTNodeType.EXPRESSION
  expressionType: ExpressionType | FunctionType | LogicType
}

/**
 * Reference Expression AST node
 */
export interface ReferenceASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: ExpressionType.REFERENCE
  properties: {
    path: (ASTNode | string | number)[]
  }
}

/**
 * Next Expression AST node
 */
export interface NextASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: ExpressionType.NEXT
  properties: {
    when?: ASTNode
    goto: ASTNode | string
  }
}

/**
 * Pipeline Expression AST node
 */
export interface PipelineASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: ExpressionType.PIPELINE
  properties: {
    input: ASTNode | any
    steps: ASTNode[]
  }
}

/**
 * Format Expression AST node
 */
export interface FormatASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: ExpressionType.FORMAT
  properties: {
    template: string
    arguments: (ASTNode | any)[]
  }
}

/**
 * Collection Expression AST node
 */
export interface CollectionASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: ExpressionType.COLLECTION
  properties: {
    collection: ASTNode
    template: any
    fallback?: ASTNode[]
  }
}

/**
 * Conditional Expression AST node
 */
export interface ConditionalASTNode extends ExpressionASTNode {
  expressionType: LogicType.CONDITIONAL
  properties: Map<string, ASTNode | any>
}

/**
 * Predicate Expression AST node
 */
export interface PredicateASTNode extends ExpressionASTNode {
  expressionType: LogicType
  properties: Map<string, ASTNode | any>
}

/**
 * Function Expression AST node
 */
export interface FunctionASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: FunctionType
  properties: {
    name: string
    arguments: (ASTNode | any)[]
  }
}

/**
 * Validation Expression AST node
 */
export interface ValidationASTNode extends Omit<ExpressionASTNode, 'properties'> {
  expressionType: ExpressionType.VALIDATION
  properties: {
    when: ASTNode // Required: the predicate that determines if validation passes
    message: ASTNode | string // Can be a plain string or a ConditionalString expression
    submissionOnly?: boolean
    details?: Record<string, any>
    resolvedBlockCode?: string | ASTNode // Computed during normalization
  }
}

/**
 * Transition AST node - represents lifecycle transitions
 */
export interface TransitionASTNode extends ASTNode {
  type: ASTNodeType.TRANSITION
  transitionType: TransitionType
  properties: Map<string, ASTNode | any>
}

/**
 * Load Transition AST node
 */
export interface LoadTransitionASTNode extends Omit<TransitionASTNode, 'properties'> {
  transitionType: TransitionType.LOAD
  properties: {
    effects: ASTNode[]
  }
}

/**
 * Access Transition AST node
 */
export interface AccessTransitionASTNode extends TransitionASTNode {
  transitionType: TransitionType.ACCESS
}

/**
 * Submit Transition AST node
 */
export interface SubmitTransitionASTNode extends TransitionASTNode {
  transitionType: TransitionType.SUBMIT
}
