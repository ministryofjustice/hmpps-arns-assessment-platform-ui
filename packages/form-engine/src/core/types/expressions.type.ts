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
export interface ReferenceASTNode extends ExpressionASTNode {
  expressionType: ExpressionType.REFERENCE
  properties: Map<string, ASTNode | any>
}

/**
 * Next Expression AST node
 */
export interface NextASTNode extends ExpressionASTNode {
  expressionType: ExpressionType.NEXT
  properties: Map<string, ASTNode | any>
}

/**
 * Pipeline Expression AST node
 */
export interface PipelineASTNode extends ExpressionASTNode {
  expressionType: ExpressionType.PIPELINE
  properties: Map<string, ASTNode | any>
}

/**
 * Format Expression AST node
 */
export interface FormatASTNode extends ExpressionASTNode {
  expressionType: ExpressionType.FORMAT
  properties: Map<string, ASTNode | any>
}

/**
 * Collection Expression AST node
 */
export interface CollectionASTNode extends ExpressionASTNode {
  expressionType: ExpressionType.COLLECTION
  properties: Map<string, ASTNode | any>
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
export interface ValidationASTNode extends ExpressionASTNode {
  expressionType: ExpressionType.VALIDATION
  properties: Map<string, ASTNode | any>
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
export interface LoadTransitionASTNode extends TransitionASTNode {
  transitionType: TransitionType.LOAD
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
