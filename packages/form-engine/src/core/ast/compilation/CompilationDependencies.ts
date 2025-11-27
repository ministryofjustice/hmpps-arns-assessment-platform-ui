import { NodeIDCategory, NodeIDGenerator } from '@form-engine/core/ast/nodes/NodeIDGenerator'
import { NodeFactory } from '@form-engine/core/ast/nodes/NodeFactory'
import NodeRegistry from '@form-engine/core/ast/registration/NodeRegistry'
import MetadataRegistry from '@form-engine/core/ast/registration/MetadataRegistry'
import { PseudoNodeFactory } from '@form-engine/core/ast/nodes/PseudoNodeFactory'
import ThunkHandlerRegistry from '@form-engine/core/ast/thunks/registries/ThunkHandlerRegistry'
import DependencyGraph from '@form-engine/core/ast/dependencies/DependencyGraph'

export class CompilationDependencies {
  constructor(
    readonly nodeIdGenerator = new NodeIDGenerator(),
    readonly nodeFactory = new NodeFactory(nodeIdGenerator, NodeIDCategory.COMPILE_AST),
    readonly pseudoNodeFactory = new PseudoNodeFactory(nodeIdGenerator, NodeIDCategory.COMPILE_PSEUDO),
    readonly nodeRegistry: NodeRegistry = new NodeRegistry(),
    readonly metadataRegistry: MetadataRegistry = new MetadataRegistry(),
    readonly thunkHandlerRegistry = new ThunkHandlerRegistry(),
    readonly dependencyGraph: DependencyGraph = new DependencyGraph(),
  ) {}

  clone() {
    const clonedNodeIdGenerator = this.nodeIdGenerator.clone()
    const clonedNodeFactory = new NodeFactory(clonedNodeIdGenerator, NodeIDCategory.COMPILE_AST)
    const clonedPseudoNodeFactory = new PseudoNodeFactory(clonedNodeIdGenerator, NodeIDCategory.COMPILE_PSEUDO)
    const clonedNodeRegistry = this.nodeRegistry.clone()
    const clonedMetadataRegistry = this.metadataRegistry.clone()
    const clonedThunkHandlerRegistry = this.thunkHandlerRegistry.clone()
    const clonedDependencyGraph = this.dependencyGraph.clone()

    return new CompilationDependencies(
      clonedNodeIdGenerator,
      clonedNodeFactory,
      clonedPseudoNodeFactory,
      clonedNodeRegistry,
      clonedMetadataRegistry,
      clonedThunkHandlerRegistry,
      clonedDependencyGraph,
    )
  }
}
