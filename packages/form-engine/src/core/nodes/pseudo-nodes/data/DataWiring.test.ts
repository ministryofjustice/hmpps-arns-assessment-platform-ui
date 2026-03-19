import { when } from 'jest-when'
import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import { StepASTNode } from '@form-engine/core/types/structures.type'
import { WiringContext } from '@form-engine/core/compilation/dependency-graph/WiringContext'
import DependencyGraph, { DependencyEdgeType } from '@form-engine/core/compilation/dependency-graph/DependencyGraph'
import { PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import DataWiring from './DataWiring'

describe('DataWiring', () => {
  let mockWiringContext: jest.Mocked<WiringContext>
  let mockGraph: jest.Mocked<DependencyGraph>
  let wiring: DataWiring

  function createMockWiringContext(stepNode: StepASTNode): jest.Mocked<WiringContext> {
    return {
      nodeRegistry: {
        findByType: jest.fn().mockReturnValue([]),
        get: jest.fn().mockReturnValue(undefined),
      },
      findReferenceNodes: jest.fn().mockReturnValue([]),
      findLastOnAccessTransitionFrom: jest.fn().mockReturnValue(undefined),
      graph: mockGraph,
      getCurrentStepNode: jest.fn().mockReturnValue(stepNode),
    } as unknown as jest.Mocked<WiringContext>
  }

  beforeEach(() => {
    ASTTestFactory.resetIds()

    mockGraph = {
      addNode: jest.fn(),
      addEdge: jest.fn(),
    } as unknown as jest.Mocked<DependencyGraph>

    mockWiringContext = createMockWiringContext(ASTTestFactory.step().build())
    wiring = new DataWiring(mockWiringContext)
  })

  describe('wire', () => {
    it('should wire data pseudo node to Data() reference consumers', () => {
      // Arrange
      const dataNode = ASTTestFactory.dataPseudoNode('externalField')
      const dataRef = ASTTestFactory.reference(['data', 'externalField'])

      when(mockWiringContext.nodeRegistry.findByType)
        .calledWith(PseudoNodeType.DATA)
        .mockReturnValue([dataNode])

      when(mockWiringContext.findReferenceNodes)
        .calledWith('data')
        .mockReturnValue([dataRef])

      when(mockWiringContext.findLastOnAccessTransitionFrom)
        .calledWith(expect.anything())
        .mockReturnValue(undefined)

      // Act
      wiring.wire()

      // Assert
      expect(mockGraph.addEdge).toHaveBeenCalledWith(dataNode.id, dataRef.id, DependencyEdgeType.DATA_FLOW, {
        referenceType: 'data',
        baseProperty: 'externalField',
      })
    })

    it('should wire nested path to pseudo node', () => {
      // Arrange
      const dataNode = ASTTestFactory.dataPseudoNode('user')
      const dataRef = ASTTestFactory.reference(['data', 'user', 'name'])

      when(mockWiringContext.nodeRegistry.findByType)
        .calledWith(PseudoNodeType.DATA)
        .mockReturnValue([dataNode])

      when(mockWiringContext.findReferenceNodes)
        .calledWith('data')
        .mockReturnValue([dataRef])

      when(mockWiringContext.findLastOnAccessTransitionFrom)
        .calledWith(expect.anything())
        .mockReturnValue(undefined)

      // Act
      wiring.wire()

      // Assert
      expect(mockGraph.addEdge).toHaveBeenCalledWith(dataNode.id, dataRef.id, DependencyEdgeType.DATA_FLOW, {
        referenceType: 'data',
        baseProperty: 'user',
      })
    })

    describe('edge cases', () => {
      it('should not wire reference when reference path is too short', () => {
        // Arrange
        const dataNode = ASTTestFactory.dataPseudoNode('field')
        const invalidRef = ASTTestFactory.reference(['data']) // Missing field name

        when(mockWiringContext.nodeRegistry.findByType)
          .calledWith(PseudoNodeType.DATA)
          .mockReturnValue([dataNode])

        when(mockWiringContext.findReferenceNodes)
          .calledWith('data')
          .mockReturnValue([invalidRef])

        when(mockWiringContext.findLastOnAccessTransitionFrom)
          .calledWith(expect.anything())
          .mockReturnValue(undefined)

        // Act
        wiring.wire()

        // Assert - no edge to invalid reference
        expect(mockGraph.addEdge).not.toHaveBeenCalled()
      })

      it('should not wire reference when field code does not match', () => {
        // Arrange
        const dataNode = ASTTestFactory.dataPseudoNode('user')
        const differentFieldRef = ASTTestFactory.reference(['data', 'settings'])

        when(mockWiringContext.nodeRegistry.findByType)
          .calledWith(PseudoNodeType.DATA)
          .mockReturnValue([dataNode])

        when(mockWiringContext.findReferenceNodes)
          .calledWith('data')
          .mockReturnValue([differentFieldRef])

        when(mockWiringContext.findLastOnAccessTransitionFrom)
          .calledWith(expect.anything())
          .mockReturnValue(undefined)

        // Act
        wiring.wire()

        // Assert - no edge to non-matching reference
        expect(mockGraph.addEdge).not.toHaveBeenCalled()
      })

    })
  })
})
