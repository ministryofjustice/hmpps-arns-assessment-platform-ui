import { ASTNodeType } from '@form-engine/core/types/enums'
import { ASTNode } from '@form-engine/core/types/engine.type'
import { ValidationASTNode } from '@form-engine/core/types/expressions.type'

/**
 * Journey AST node - represents the top-level form journey
 */
export interface JourneyASTNode extends ASTNode {
  type: ASTNodeType.JOURNEY
  properties: Map<string, ASTNode | any>
}

/**
 * Step AST node - represents a single page/step in the journey
 */
export interface StepASTNode extends ASTNode {
  type: ASTNodeType.STEP
  properties: Map<string, ASTNode | any>
}

/**
 * Basic Block AST node - for non-field UI components (HTML, dividers, etc.)
 */
export interface BasicBlockASTNode extends Omit<ASTNode, 'properties'> {
  type: ASTNodeType.BLOCK
  variant: string
  blockType: 'basic'
  properties: {
    // Component-specific arbitrary parameters
    [key: string]: any
  }
}

/**
 * Field Block AST node - for input fields with validation
 */
export interface FieldBlockASTNode extends Omit<ASTNode, 'properties'> {
  type: ASTNodeType.BLOCK
  variant: string
  blockType: 'field'
  properties: {
    // Known field properties
    code?: string | ASTNode // Optional because it might not be set initially
    defaultValue?: ASTNode | any
    formatters?: ASTNode // Pipeline node after normalization
    hidden?: ASTNode
    validate?: ValidationASTNode[]
    dependent?: ASTNode
    value?: ASTNode // Added by normalizer (Self reference)

    // Component-specific arbitrary parameters
    [key: string]: any
  }
}

/**
 * Block AST node - union type for all block variants
 */
export type BlockASTNode = BasicBlockASTNode | FieldBlockASTNode
