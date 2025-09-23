import RouteGenerator from '@form-engine/core/runtime/routes/RouteGenerator'
import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import { FormInstanceDependencies } from '@form-engine/core/types/engine.type'
import { JourneyASTNode } from '@form-engine/core/types/structures.type'
import { FormEngineOptions } from '@form-engine/core/FormEngine'

describe('RouteGenerator', () => {
  const mockDependencies: FormInstanceDependencies = {
    functionRegistry: {} as any,
    componentRegistry: {} as any,
    logger: {
      info: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      log: jest.fn(),
      debug: jest.fn(),
      trace: jest.fn(),
    } as any,
  }

  const mockOptions: FormEngineOptions = {
    disableBuiltInFunctions: false,
    disableBuiltInComponents: false,
    basePath: '/forms',
    debug: false,
  }

  const createMockCompiledAST = (root: JourneyASTNode) => {
    return {
      getRoot: () => root,
      getNodeRegistry: () => ({
        size: () => 10,
      }),
      getAnalysis: () => ({
        topoOrder: [1, 2, 3],
        nodes: new Map(),
        pseudoNodes: new Map(),
        graph: {
          adjacency: new Map(),
        },
        cycles: [] as any[],
      }),
      getVisualizationData: () => ({}),
    } as any
  }

  beforeEach(() => {
    // Reset IDs for consistent test results
    ASTTestFactory.resetIds()
    jest.clearAllMocks()
  })

  describe('Simple journey with steps', () => {
    it('should generate routes for steps without journey path', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withStep(step => step.withProperty('path', '/step-one'))
        .withStep(step => step.withProperty('path', '/step-two'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes).toHaveLength(4) // 2 steps * 2 methods (GET, POST)

      // Check isDebugRoute flag
      result.routes.forEach(route => {
        expect(route.isDebugRoute).toBe(false)
      })

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/step-one')
      expect(routePaths).toContain('/step-two')

      const getMethods = result.routes.filter(r => r.method === 'GET')
      const postMethods = result.routes.filter(r => r.method === 'POST')
      expect(getMethods).toHaveLength(2)
      expect(postMethods).toHaveLength(2)
    })

    it('should generate routes with journey path prefix', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/assessment')
        .withStep(step => step.withProperty('path', '/personal-details'))
        .withStep(step => step.withProperty('path', '/contact-info'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/assessment/personal-details')
      expect(routePaths).toContain('/assessment/contact-info')
    })

    it('should normalize paths that dont start with /', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', 'assessment')
        .withStep(step => step.withProperty('path', 'step-one'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/assessment/step-one')
    })
  })

  describe('Nested journeys', () => {
    it('should handle nested child journeys with accumulated paths', () => {
      // Create child journey
      const childJourney = ASTTestFactory.journey()
        .withProperty('code', 'child-journey')
        .withProperty('title', 'Child Journey')
        .withProperty('path', '/child')
        .withStep(step => step.withProperty('path', '/child-step'))
        .build()

      // Create parent journey with child
      const parentJourney = ASTTestFactory.journey()
        .withProperty('code', 'parent-journey')
        .withProperty('title', 'Parent Journey')
        .withProperty('path', '/parent')
        .withStep(step => step.withProperty('path', '/parent-step'))
        .withProperty('children', [childJourney])
        .build()

      const mockCompiledAst = createMockCompiledAST(parentJourney)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/parent/parent-step')
      expect(routePaths).toContain('/parent/child/child-step')
    })

    it('should handle child journeys without parent path', () => {
      const childJourney = ASTTestFactory.journey()
        .withProperty('code', 'child-journey')
        .withProperty('title', 'Child Journey')
        .withProperty('path', '/child')
        .withStep(step => step.withProperty('path', '/child-step'))
        .build()

      const parentJourney = ASTTestFactory.journey()
        .withProperty('code', 'parent-journey')
        .withProperty('title', 'Parent Journey')
        .withStep(step => step.withProperty('path', '/parent-step'))
        .withProperty('children', [childJourney])
        .build()

      const mockCompiledAst = createMockCompiledAST(parentJourney)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/parent-step')
      expect(routePaths).toContain('/child/child-step')
    })

    it('should handle deeply nested journeys', () => {
      // Create deeply nested structure
      const level3 = ASTTestFactory.journey()
        .withProperty('code', 'level-3')
        .withProperty('title', 'Level 3')
        .withProperty('path', '/l3')
        .withStep(step => step.withProperty('path', '/deep-step'))
        .build()

      const level2 = ASTTestFactory.journey()
        .withProperty('code', 'level-2')
        .withProperty('title', 'Level 2')
        .withProperty('path', '/l2')
        .withProperty('children', [level3])
        .build()

      const level1 = ASTTestFactory.journey()
        .withProperty('code', 'level-1')
        .withProperty('title', 'Level 1')
        .withProperty('path', '/l1')
        .withProperty('children', [level2])
        .build()

      const mockCompiledAst = createMockCompiledAST(level1)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/l1/l2/l3/deep-step')
    })
  })

  describe('Route map', () => {
    it('should create a route map for quick step lookups', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/app')
        .withStep(step => step.withProperty('path', '/step-a'))
        .withStep(step => step.withProperty('path', '/step-b'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routeMap.has('/app/step-a')).toBe(true)
      expect(result.routeMap.has('/app/step-b')).toBe(true)

      const stepA = result.routeMap.get('/app/step-a')
      expect(stepA).toBeDefined()
      expect(stepA?.properties.get('path')).toBe('/step-a')
    })

    it('should warn about duplicate paths', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withStep(step => step.withProperty('path', '/duplicate'))
        .withStep(step => step.withProperty('path', '/duplicate'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      generator.generateRoutes()

      expect(mockDependencies.logger.warn).toHaveBeenCalledWith('Duplicate route path detected: /duplicate')
    })
  })

  describe('Route handlers', () => {
    it('should create request handlers that attach AST nodes to request', async () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withStep(step => step.withProperty('path', '/test-step'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const getRoute = result.routes.find(r => r.method === 'GET' && r.path === '/test-step')
      expect(getRoute).toBeDefined()

      const req: any = {
        path: '/test-step',
      }
      const res: any = {
        json: jest.fn(),
      }
      const next = jest.fn()

      await getRoute!.handler(req, res, next)

      expect(req.stepNode).toBeDefined()
      expect(req.journeyNode).toBeDefined()
      expect(req.compiledAst).toBeDefined()
      expect(res.json).toHaveBeenCalled()
    })

    it('should handle errors in request handlers', async () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withStep(step => step.withProperty('path', '/test-step'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const route = result.routes[0]
      const req: any = {
        path: '/test-step',
      }
      const res: any = {
        json: jest.fn(() => {
          throw new Error('Test error')
        }),
      }
      const next = jest.fn()

      await route.handler(req, res, next)

      expect(next).toHaveBeenCalledWith(expect.any(Error))
    })
  })

  describe('Edge cases', () => {
    it('should handle steps without paths', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withStep(step => step.withProperty('blocks', [])) // Step with no path
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes).toHaveLength(0)
      expect(mockDependencies.logger.warn).toHaveBeenCalled()
    })

    it('should handle journey without steps', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/empty')
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes).toHaveLength(0)
    })

    it('should handle journey with empty steps array', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('steps', [])
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes).toHaveLength(0)
    })
  })

  describe('ASTTestFactory scenarios', () => {
    it('should work with minimal scenario from factory', () => {
      const minimalForm = ASTTestFactory.scenarios.minimal()

      // Override the path property for the step
      const steps = minimalForm.properties.get('steps') || []
      if (steps.length > 0 && steps[0]) {
        steps[0].properties.set('path', '/name-step')
      }

      const mockCompiledAst = createMockCompiledAST(minimalForm)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes.length).toBeGreaterThan(0)
      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/name-step')
    })

    it('should work with validation scenario from factory', () => {
      const withValidation = ASTTestFactory.scenarios.withValidation()

      // Add path to the step
      const steps = withValidation.properties.get('steps') || []
      if (steps.length > 0 && steps[0]) {
        steps[0].properties.set('path', '/email-step')
      }

      const mockCompiledAst = createMockCompiledAST(withValidation)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes.length).toBeGreaterThan(0)
      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/email-step')
    })

    it('should work with collection scenario from factory', () => {
      const withCollection = ASTTestFactory.scenarios.withCollection()

      // Add paths to steps
      const steps = withCollection.properties.get('steps') || []
      steps.forEach((step: any, index: number) => {
        step.properties.set('path', `/step-${index + 1}`)
      })

      const mockCompiledAst = createMockCompiledAST(withCollection)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      expect(result.routes.length).toBeGreaterThan(0)
    })
  })

  describe('Complex journey structures', () => {
    it('should handle journey with multiple levels of nested children', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'main')
        .withProperty('title', 'Main Journey')
        .withProperty('path', '/main')
        .withStep(step => step.withProperty('path', '/intro'))
        .withProperty('children', [
          ASTTestFactory.journey()
            .withProperty('code', 'section1')
            .withProperty('path', '/s1')
            .withStep(step => step.withProperty('path', '/page1'))
            .withStep(step => step.withProperty('path', '/page2'))
            .build(),
          ASTTestFactory.journey()
            .withProperty('code', 'section2')
            .withProperty('path', '/s2')
            .withStep(step => step.withProperty('path', '/page3'))
            .build(),
        ])
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const routePaths = result.routes.map(r => r.path)
      expect(routePaths).toContain('/main/intro')
      expect(routePaths).toContain('/main/s1/page1')
      expect(routePaths).toContain('/main/s1/page2')
      expect(routePaths).toContain('/main/s2/page3')
    })

    it('should maintain correct journey context when traversing', () => {
      const journey = ASTTestFactory.journey()
        .withId(1)
        .withProperty('code', 'root')
        .withProperty('path', '/root')
        .withStep(step => step.withId(2).withProperty('path', '/step1'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      // Check that the step has the correct journey context
      const route = result.routes.find(r => r.path === '/root/step1')
      expect(route).toBeDefined()
      expect(route?.journeyNode.id).toBe(1)
      expect(route?.stepNode.id).toBe(2)
    })
  })

  describe('Debug route', () => {
    it('should not generate debug route when debug is false', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/app')
        .withStep(step => step.withProperty('path', '/step1'))
        .build()

      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, mockOptions)
      const result = generator.generateRoutes()

      const debugRoute = result.routes.find(r => r.isDebugRoute === true)
      expect(debugRoute).toBeUndefined()
    })

    it('should generate debug route when debug is true', () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/app')
        .withStep(step => step.withProperty('path', '/step1'))
        .build()

      const debugOptions = { ...mockOptions, debug: true }
      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, debugOptions)
      const result = generator.generateRoutes()

      const debugRoute = result.routes.find(r => r.isDebugRoute === true)
      expect(debugRoute).toBeDefined()
      expect(debugRoute?.path).toBe('/app/debug')
      expect(debugRoute?.method).toBe('GET')
    })

    it('should handle debug route handler correctly', async () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/test')
        .withProperty('name', 'Test Form')
        .build()

      const debugOptions = { ...mockOptions, debug: true }
      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, debugOptions)
      const result = generator.generateRoutes()

      const debugRoute = result.routes.find(r => r.isDebugRoute === true)
      expect(debugRoute).toBeDefined()

      const req: any = {
        path: '/test/debug',
      }
      const res: any = {
        json: jest.fn(),
      }
      const next = jest.fn()

      await debugRoute!.handler(req, res, next)

      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: 'Debug route for form instance',
          formCode: 'test-journey',
          formTitle: 'Test Form',
          visualizationData: expect.any(Object),
          analysis: expect.objectContaining({
            executionOrder: expect.any(Array),
            dependencyGraph: expect.objectContaining({
              nodes: expect.any(Number),
              pseudoNodes: expect.any(Number),
              edges: expect.any(Number),
              hasCycles: expect.any(Boolean),
              cycleCount: expect.any(Number),
            }),
          }),
          astStructure: expect.objectContaining({
            root: expect.any(Number),
            totalNodes: expect.any(Number),
          }),
          routes: expect.any(Array),
        }),
      )
    })

    it('debug route should filter itself from routes list', async () => {
      const journey = ASTTestFactory.journey()
        .withProperty('code', 'test-journey')
        .withProperty('title', 'Test Journey')
        .withProperty('path', '/app')
        .withStep(step => step.withProperty('path', '/step1'))
        .build()

      const debugOptions = { ...mockOptions, debug: true }
      const mockCompiledAst = createMockCompiledAST(journey)
      const generator = new RouteGenerator(mockCompiledAst, mockDependencies, debugOptions)
      const result = generator.generateRoutes()

      const debugRoute = result.routes.find(r => r.isDebugRoute === true)
      const req: any = { path: '/app/debug' }
      const res: any = { json: jest.fn() }
      const next = jest.fn()

      await debugRoute!.handler(req, res, next)

      const responseData = res.json.mock.calls[0][0]
      // Should not include the debug route itself in the routes list
      expect(responseData.routes.every((r: any) => r.path !== '/app/debug')).toBe(true)
    })
  })
})
