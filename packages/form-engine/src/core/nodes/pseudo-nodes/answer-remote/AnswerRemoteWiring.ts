import { WiringContext } from '@form-engine/core/compilation/dependency-graph/WiringContext'
import { AnswerRemotePseudoNode, PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import { DependencyEdgeType } from '@form-engine/core/compilation/dependency-graph/DependencyGraph'
import { NodeId } from '@form-engine/core/types/engine.type'
import { isReferenceExprNode } from '@form-engine/core/typeguards/expression-nodes'
import { ReferenceASTNode } from '@form-engine/core/types/expressions.type'
import { getPseudoNodeKey } from '@form-engine/core/utils/pseudoNodeKeyExtractor'

/**
 * AnswerRemoteWiring: Wires Answer.Remote pseudo nodes to their data sources and consumers
 *
 * Creates dependency edges for remote field answer values (fields from other steps).
 *
 * Wiring pattern for ANSWER_REMOTE:
 * - ANSWER_REMOTE → Answer() references (consumers)
 */
export default class AnswerRemoteWiring {
  constructor(private readonly wiringContext: WiringContext) {}

  /**
   * Wire all Answer.Remote pseudo nodes to their producers and consumers
   */
  wire() {
    const answerRefsByFieldCode = this.buildAnswerRefsIndex()

    this.wiringContext.nodeRegistry.findByType<AnswerRemotePseudoNode>(PseudoNodeType.ANSWER_REMOTE)
      .forEach(answerPseudoNode => {
        this.wireConsumersFromIndex(answerPseudoNode, answerRefsByFieldCode)
      })
  }

  /**
   * Wire only the specified nodes (scoped wiring for runtime nodes)
   */
  wireNodes(nodeIds: NodeId[]) {
    const nodes = nodeIds.map(id => this.wiringContext.nodeRegistry.get(id))

    // Handle new Answer() references pointing to remote fields
    const answerRefs = nodes.filter(isReferenceExprNode).filter(ref => {
      const path = ref.properties.path

      return Array.isArray(path) && path.length >= 2 && path[0] === 'answers'
    })

    answerRefs.forEach(refNode => {
      const baseFieldCode = refNode.properties.path[1] as string
      const pseudoNode = this.wiringContext.nodeRegistry.findByType<AnswerRemotePseudoNode>(PseudoNodeType.ANSWER_REMOTE)
        .find(node => getPseudoNodeKey(node) === baseFieldCode)

      if (pseudoNode) {
        this.wiringContext.graph.addEdge(pseudoNode.id, refNode.id, DependencyEdgeType.DATA_FLOW, {
          referenceType: 'answer',
          fieldCode: baseFieldCode,
        })
      }
    })
  }

  /**
   * Build an index of Answer references by field code
   */
  private buildAnswerRefsIndex(): Map<string, ReferenceASTNode[]> {
    const index = new Map<string, ReferenceASTNode[]>()

    this.wiringContext.findReferenceNodes('answers').forEach(refNode => {
      const path = refNode.properties.path

      if (path.length >= 2) {
        const fieldCode = path[1] as string

        if (!index.has(fieldCode)) {
          index.set(fieldCode, [])
        }

        index.get(fieldCode)!.push(refNode)
      }
    })

    return index
  }

  /**
   * Wire consumers using pre-built index
   */
  private wireConsumersFromIndex(
    answerPseudoNode: AnswerRemotePseudoNode,
    answerRefsByFieldCode: Map<string, ReferenceASTNode[]>,
  ) {
    const { baseFieldCode } = answerPseudoNode.properties
    const refs = answerRefsByFieldCode.get(baseFieldCode) ?? []

    refs.forEach(refNode => {
      this.wiringContext.graph.addEdge(answerPseudoNode.id, refNode.id, DependencyEdgeType.DATA_FLOW, {
        referenceType: 'answer',
        fieldCode: baseFieldCode,
      })
    })
  }

}
