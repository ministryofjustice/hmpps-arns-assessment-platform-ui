import { WiringContext } from '@form-engine/core/compilation/dependency-graph/WiringContext'
import { DataPseudoNode, PseudoNodeType } from '@form-engine/core/types/pseudoNodes.type'
import { DependencyEdgeType } from '@form-engine/core/compilation/dependency-graph/DependencyGraph'
import { NodeId } from '@form-engine/core/types/engine.type'
import { isReferenceExprNode } from '@form-engine/core/typeguards/expression-nodes'
import { getPseudoNodeKey } from '@form-engine/core/utils/pseudoNodeKeyExtractor'

/**
 * DataWiring: Wires Data pseudo nodes to their consumers
 *
 * DATA pseudo nodes are runtime data lookups. They do not have a single static
 * producer in the AST, so wiring them to a "nearest onAccess" transition creates
 * incorrect cycles when access transitions also consume Data() references.
 *
 * Wiring pattern for DATA:
 * - DATA → Data() references (consumers)
 */
export default class DataWiring {
  constructor(private readonly wiringContext: WiringContext) {}

  /**
   * Wire all Data pseudo nodes to their consumers
   */
  wire() {
    this.wiringContext.nodeRegistry.findByType<DataPseudoNode>(PseudoNodeType.DATA)
      .forEach(dataPseudoNode => {
        this.wireConsumers(dataPseudoNode)
      })
  }

  /**
   * Wire only the specified nodes (scoped wiring for runtime nodes)
   * Handles consumer edges only:
   * - New Data pseudo nodes do not need producer edges
   * - New references wire existing/new pseudo nodes to them
   *
   * Note: We don't call wireConsumers for new pseudo nodes because:
   * 1. Existing references can't reference a data key that was just created
   * 2. New references in the same batch are handled by the "Handle new references" section
   */
  wireNodes(nodeIds: NodeId[]) {
    const nodes = nodeIds.map(id => this.wiringContext.nodeRegistry.get(id))

    // Handle new Data() references (PUSH: existing pseudo node → new reference)
    const dataRefs = nodes
      .filter(isReferenceExprNode)
      .filter(ref => {
        const path = ref.properties.path

        return Array.isArray(path) && path.length >= 2 && path[0] === 'data'
      })

    dataRefs.forEach(refNode => {
      const baseProperty = refNode.properties.path[1] as string

      const pseudoNode = this.wiringContext.nodeRegistry.findByType<DataPseudoNode>(PseudoNodeType.DATA)
        .find(node => getPseudoNodeKey(node) === baseProperty)

      if (pseudoNode) {
        this.wiringContext.graph.addEdge(pseudoNode.id, refNode.id, DependencyEdgeType.DATA_FLOW, {
          referenceType: 'data',
          baseProperty,
        })
      }
    })
  }

  /**
   * Wire a data pseudo node to its consumers (Data reference nodes)
   *
   * Finds all Data() reference nodes that reference this property and creates
   * edges: DATA_PSEUDO_NODE → Data() reference
   */
  private wireConsumers(dataPseudoNode: DataPseudoNode) {
    const { baseProperty } = dataPseudoNode.properties
    const dataRefs = this.wiringContext.findReferenceNodes('data')

    dataRefs.forEach(refNode => {
      const path = refNode.properties.path

      if (path.length >= 2) {
        const referencedBaseProperty = path[1] as string

        if (referencedBaseProperty === baseProperty) {
          this.wiringContext.graph.addEdge(dataPseudoNode.id, refNode.id, DependencyEdgeType.DATA_FLOW, {
            referenceType: 'data',
            baseProperty,
          })
        }
      }
    })
  }
}
