import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import ThunkRuntimeHooksFactory from '@form-engine/core/compilation/thunks/ThunkRuntimeHooksFactory'
import ThunkCompilerFactory from '@form-engine/core/compilation/thunks/ThunkCompilerFactory'
import ThunkCacheManager from '@form-engine/core/compilation/thunks/ThunkCacheManager'
import { CompilationDependencies } from '@form-engine/core/compilation/CompilationDependencies'
import { RuntimeOverlayBuilder } from '@form-engine/core/compilation/thunks/types'
import { AstNodeId } from '@form-engine/core/types/engine.type'
import { NodeFactory } from '@form-engine/core/nodes/NodeFactory'
import NodeRegistry from '@form-engine/core/compilation/registries/NodeRegistry'
import ThunkHandlerRegistry from '@form-engine/core/compilation/registries/ThunkHandlerRegistry'
import MetadataRegistry from '@form-engine/core/compilation/registries/MetadataRegistry'
import DependencyGraph from '@form-engine/core/compilation/dependency-graph/DependencyGraph'
import FunctionRegistry from '@form-engine/registry/FunctionRegistry'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { NodeIDGenerator } from '@form-engine/core/compilation/id-generators/NodeIDGenerator'
import { isTemplateNode } from '@form-engine/core/typeguards/nodes'
import { TemplateValue } from '@form-engine/core/types/template.type'
import TemplateFactory from '@form-engine/core/nodes/template/TemplateFactory'

function createMockRuntimeOverlayBuilder(): RuntimeOverlayBuilder {
  return {
    nodeRegistry: {
      register: jest.fn(),
    } as unknown as NodeRegistry,
    handlerRegistry: {
      register: jest.fn(),
      has: jest.fn().mockReturnValue(false),
    } as unknown as ThunkHandlerRegistry,
    metadataRegistry: {} as MetadataRegistry,
    dependencyGraph: {
      addEdge: jest.fn(),
    } as unknown as DependencyGraph,
    nodeFactory: {
      createNode: jest.fn(),
      transformValue: jest.fn(),
    } as unknown as NodeFactory,
    runtimeNodes: new Map(),
  }
}

describe('ThunkRuntimeHooksFactory', () => {
  let factory: ThunkRuntimeHooksFactory
  let mockCompilationDependencies: jest.Mocked<CompilationDependencies>
  let mockCompiler: jest.Mocked<ThunkCompilerFactory>
  let mockCacheManager: jest.Mocked<ThunkCacheManager>
  let mockFunctionRegistry: jest.Mocked<FunctionRegistry>

  beforeEach(() => {
    ASTTestFactory.resetIds()

    mockCompilationDependencies = {
      nodeIdGenerator: {
        next: jest.fn().mockReturnValue('runtime_ast:1'),
      },
      createOverlay: jest.fn(),
    } as unknown as jest.Mocked<CompilationDependencies>

    mockCompiler = {
      compileASTNode: jest.fn(),
    } as unknown as jest.Mocked<ThunkCompilerFactory>

    mockCacheManager = {
      invalidateCascading: jest.fn(),
    } as unknown as jest.Mocked<ThunkCacheManager>

    mockFunctionRegistry = {} as jest.Mocked<FunctionRegistry>
  })

  describe('create()', () => {
    it('should return hooks with template instantiation, transformValue and registerRuntimeNodesBatch', () => {
      // Arrange
      const mockBuilder = createMockRuntimeOverlayBuilder()
      factory = new ThunkRuntimeHooksFactory(
        mockCompilationDependencies,
        mockCompiler,
        mockCacheManager,
        mockBuilder,
        mockFunctionRegistry,
      )
      const currentNodeId = 'compile_ast:1' as AstNodeId

      // Act
      const hooks = factory.create(currentNodeId)

      // Assert
      expect(hooks.instantiateTemplateValue).toBeDefined()
      expect(hooks.transformValue).toBeDefined()
      expect(hooks.registerRuntimeNodesBatch).toBeDefined()
      expect(typeof hooks.instantiateTemplateValue).toBe('function')
      expect(typeof hooks.transformValue).toBe('function')
      expect(typeof hooks.registerRuntimeNodesBatch).toBe('function')
    })

    it('should transform value using builder nodeFactory via transformValue hook', () => {
      // Arrange
      const mockBuilder = createMockRuntimeOverlayBuilder()
      const transformedValue = { transformed: true }

      mockBuilder.nodeFactory.transformValue = jest.fn().mockReturnValue(transformedValue)

      factory = new ThunkRuntimeHooksFactory(
        mockCompilationDependencies,
        mockCompiler,
        mockCacheManager,
        mockBuilder,
        mockFunctionRegistry,
      )

      const hooks = factory.create('compile_ast:1' as AstNodeId)
      const inputValue = { original: true }

      // Act
      const result = hooks.transformValue(inputValue)

      // Assert
      expect(mockBuilder.nodeFactory.transformValue).toHaveBeenCalledWith(inputValue)
      expect(result).toBe(transformedValue)
    })

    it('should instantiate compiled templates without pre-registering runtime ids', () => {
      // Arrange
      const mockBuilder = createMockRuntimeOverlayBuilder()
      factory = new ThunkRuntimeHooksFactory(
        mockCompilationDependencies,
        mockCompiler,
        mockCacheManager,
        mockBuilder,
        mockFunctionRegistry,
      )

      const hooks = factory.create('compile_ast:1' as AstNodeId)
      const templateFactory = new TemplateFactory(new NodeIDGenerator())
      const template = templateFactory.compile({
        type: ASTNodeType.EXPRESSION,
        expressionType: 'ExpressionType.Reference',
        properties: {
          path: ['answers', 'name'],
        },
      })

      // Act
      const result = hooks.instantiateTemplateValue(template) as {
        id?: string
        type: ASTNodeType
        expressionType: string
        properties: { path: string[] }
      }

      // Assert
      expect(result.id).toBeUndefined()
      expect(result.type).toBe(ASTNodeType.EXPRESSION)
      expect(result.expressionType).toBe('ExpressionType.Reference')
      expect(result.properties.path).toEqual(['answers', 'name'])
      expect(mockCompilationDependencies.nodeIdGenerator.next).not.toHaveBeenCalled()
    })

    it('should detach shared template references when instantiating runtime values', () => {
      // Arrange
      const mockBuilder = createMockRuntimeOverlayBuilder()
      factory = new ThunkRuntimeHooksFactory(
        mockCompilationDependencies,
        mockCompiler,
        mockCacheManager,
        mockBuilder,
        mockFunctionRegistry,
      )

      const hooks = factory.create('compile_ast:1' as AstNodeId)
      const sharedTemplateNode: TemplateValue = {
        type: ASTNodeType.TEMPLATE,
        originalType: ASTNodeType.EXPRESSION,
        id: 'template:1' as `template:${number}`,
        expressionType: 'ExpressionType.Reference',
        properties: {
          path: ['answers', 'name'],
        },
      }
      const template: TemplateValue = {
        left: sharedTemplateNode,
        right: sharedTemplateNode,
      }

      // Act
      const result = hooks.instantiateTemplateValue(template) as {
        left: { id?: string; properties: { path: string[] } }
        right: { id?: string; properties: { path: string[] } }
      }

      // Assert
      expect(result.left).not.toBe(result.right)
      expect(result.left.id).toBeUndefined()
      expect(result.right.id).toBeUndefined()
      expect(result.left.properties.path).not.toBe(result.right.properties.path)
    })

    it('should preserve nested iterator templates as compiled templates until nested evaluation', () => {
      // Arrange
      const mockBuilder = createMockRuntimeOverlayBuilder()
      factory = new ThunkRuntimeHooksFactory(
        mockCompilationDependencies,
        mockCompiler,
        mockCacheManager,
        mockBuilder,
        mockFunctionRegistry,
      )

      const hooks = factory.create('compile_ast:1' as AstNodeId)
      const templateFactory = new TemplateFactory(new NodeIDGenerator())
      const outerIterateTemplate = templateFactory.compile({
        type: ASTNodeType.EXPRESSION,
        expressionType: 'ExpressionType.Iterate',
        properties: {
          input: ['flag'],
          iterator: {
            type: 'IteratorType.Map',
            yieldTemplate: templateFactory.compile({
              type: ASTNodeType.BLOCK,
              variant: 'govukTag',
              blockType: 'BlockType.basic',
              properties: {
                text: 'flag',
              },
            }),
          },
        },
      })

      // Act
      const outerIterateNode = hooks.instantiateTemplateValue(outerIterateTemplate) as {
        properties: {
          iterator: {
            yieldTemplate: TemplateValue
          }
        }
      }

      // Assert
      expect(isTemplateNode(outerIterateNode.properties.iterator.yieldTemplate)).toBe(true)
    })
  })
})
