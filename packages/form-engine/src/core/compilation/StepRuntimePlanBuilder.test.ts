import { CompilationDependencies } from '@form-engine/core/compilation/CompilationDependencies'
import { AstNodeId } from '@form-engine/core/types/engine.type'
import { ASTNodeType } from '@form-engine/core/types/enums'
import {
  AccessTransitionASTNode,
  ActionTransitionASTNode,
  IterateASTNode,
  SubmitTransitionASTNode,
} from '@form-engine/core/types/expressions.type'
import { BasicBlockASTNode, JourneyASTNode, StepASTNode } from '@form-engine/core/types/structures.type'
import { BlockType, ExpressionType, IteratorType, TransitionType } from '@form-engine/form/types/enums'
import StepRuntimePlanBuilder from './StepRuntimePlanBuilder'

function createAccessTransition(id: AstNodeId): AccessTransitionASTNode {
  return {
    id,
    type: ASTNodeType.TRANSITION,
    transitionType: TransitionType.ACCESS,
    properties: {},
  }
}

function createActionTransition(id: AstNodeId): ActionTransitionASTNode {
  return {
    id,
    type: ASTNodeType.TRANSITION,
    transitionType: TransitionType.ACTION,
    properties: {
      when: { id: 'compile_ast:99', type: ASTNodeType.EXPRESSION },
      effects: [],
    },
  }
}

function createSubmitTransition(id: AstNodeId): SubmitTransitionASTNode {
  return {
    id,
    type: ASTNodeType.TRANSITION,
    transitionType: TransitionType.SUBMIT,
    properties: {
      validate: false,
    },
  }
}

function createJourney(id: AstNodeId, onAccess: AccessTransitionASTNode[]): JourneyASTNode {
  return {
    id,
    type: ASTNodeType.JOURNEY,
    properties: {
      path: '/journey',
      code: 'journey',
      title: 'Journey',
      onAccess,
    },
  }
}

function createStep(
  id: AstNodeId,
  options: {
    onAccess?: AccessTransitionASTNode[]
    onAction?: ActionTransitionASTNode[]
    onSubmission?: SubmitTransitionASTNode[]
  } = {},
): StepASTNode {
  return {
    id,
    type: ASTNodeType.STEP,
    properties: {
      path: '/step',
      title: 'Step',
      ...options,
    },
  }
}

function createBlock(id: AstNodeId): BasicBlockASTNode {
  return {
    id,
    type: ASTNodeType.BLOCK,
    variant: 'test',
    blockType: BlockType.BASIC,
    properties: {},
  }
}

function createIterate(id: AstNodeId): IterateASTNode {
  return {
    id,
    type: ASTNodeType.EXPRESSION,
    expressionType: ExpressionType.ITERATE,
    properties: {
      input: [],
      iterator: {
        type: IteratorType.MAP,
      },
    },
  }
}

describe('StepRuntimePlanBuilder', () => {
  describe('build()', () => {
    it('should compile the step runtime topology from metadata and node registry', () => {
      // Arrange
      const dependencies = new CompilationDependencies()
      const journeyAccess = createAccessTransition('compile_ast:1')
      const stepAccess = createAccessTransition('compile_ast:2')
      const action = createActionTransition('compile_ast:3')
      const submit = createSubmitTransition('compile_ast:4')
      const journey = createJourney('compile_ast:5', [journeyAccess])
      const step = createStep('compile_ast:6', {
        onAccess: [stepAccess],
        onAction: [action],
        onSubmission: [submit],
      })
      const block = createBlock('compile_ast:7')
      const siblingBlock = createBlock('compile_ast:8')
      const externalBlock = createBlock('compile_ast:9')
      const iterateA = createIterate('compile_ast:10')
      const iterateB = createIterate('compile_ast:11')

      dependencies.nodeRegistry.register(journey.id, journey)
      dependencies.nodeRegistry.register(step.id, step)
      dependencies.nodeRegistry.register(block.id, block)
      dependencies.nodeRegistry.register(siblingBlock.id, siblingBlock)
      dependencies.nodeRegistry.register(externalBlock.id, externalBlock)
      dependencies.nodeRegistry.register(iterateA.id, iterateA)
      dependencies.nodeRegistry.register(iterateB.id, iterateB)

      dependencies.metadataRegistry.set(step.id, 'attachedToParentNode', journey.id)
      dependencies.metadataRegistry.set(step.id, 'isCurrentStep', true)
      dependencies.metadataRegistry.set(step.id, 'isDescendantOfStep', true)
      dependencies.metadataRegistry.set(journey.id, 'isAncestorOfStep', true)
      dependencies.metadataRegistry.set(block.id, 'attachedToParentNode', step.id)
      dependencies.metadataRegistry.set(block.id, 'isDescendantOfStep', true)
      dependencies.metadataRegistry.set(siblingBlock.id, 'attachedToParentNode', step.id)
      dependencies.metadataRegistry.set(siblingBlock.id, 'isDescendantOfStep', true)
      dependencies.metadataRegistry.set(iterateA.id, 'attachedToParentNode', block.id)
      dependencies.metadataRegistry.set(iterateA.id, 'isDescendantOfStep', true)
      dependencies.metadataRegistry.set(iterateB.id, 'attachedToParentNode', block.id)
      dependencies.metadataRegistry.set(iterateB.id, 'isDescendantOfStep', true)
      dependencies.metadataRegistry.set(externalBlock.id, 'attachedToParentNode', journey.id)

      const builder = new StepRuntimePlanBuilder()

      // Act
      const result = builder.build(step, dependencies)

      // Assert
      expect(result).toEqual({
        stepId: step.id,
        accessAncestorIds: [journey.id, step.id],
        actionTransitionIds: [action.id],
        submitTransitionIds: [submit.id],
        iteratorRootIds: [block.id],
        validationBlockIds: [block.id, siblingBlock.id],
        renderAncestorIds: [journey.id],
        renderStepId: step.id,
      })
    })
  })
})
