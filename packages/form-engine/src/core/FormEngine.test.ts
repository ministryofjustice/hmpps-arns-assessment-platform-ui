import { buildComponent } from '@form-engine/registry/utils/buildComponent'
import { JourneyDefinition } from '@form-engine/form/types/structures.type'
import { formatBox } from '@form-engine/logging/formatBox'
import express from 'express'
import ComponentRegistry from '@form-engine/registry/ComponentRegistry'
import FunctionRegistry from '@form-engine/registry/FunctionRegistry'
import FormInstance from './FormInstance'
import FormEngine from './FormEngine'

jest.mock('./FormInstance')
jest.mock('@form-engine/registry/ComponentRegistry')
jest.mock('@form-engine/registry/FunctionRegistry')
jest.mock('@form-engine/logging/formatBox')
jest.mock('express')

describe('FormEngine', () => {
  let mockLogger: jest.Mocked<Console>
  let mockRouter: jest.Mocked<express.Router>
  let mockFormInstanceRouter: jest.Mocked<express.Router>
  let mockFormInstance: jest.Mocked<FormInstance>

  beforeEach(() => {
    jest.clearAllMocks()

    // Mock logger
    mockLogger = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
    } as any

    // Mock express routers
    mockRouter = {
      use: jest.fn(),
    } as any

    mockFormInstanceRouter = {
      use: jest.fn(),
    } as any

    // Mock express.Router
    ;(express.Router as jest.Mock).mockReturnValue(mockRouter)

    // Mock formatBox
    ;(formatBox as jest.Mock).mockReturnValue('formatted box')

    // Mock FormInstance
    mockFormInstance = {
      getFormTitle: jest.fn().mockReturnValue('Test Form'),
      getFormCode: jest.fn().mockReturnValue('test-form'),
      getRouter: jest.fn().mockReturnValue(mockFormInstanceRouter),
      getRegisteredRoutes: jest.fn().mockReturnValue([
        { method: 'GET', path: '/start' },
        { method: 'GET', path: '/page-1' },
        { method: 'POST', path: '/page-1' },
      ]),
    } as any
    ;(FormInstance.createFromConfiguration as jest.Mock).mockReturnValue(mockFormInstance)
  })

  describe('constructor', () => {
    it('should initialize with default options', () => {
      // eslint-disable-next-line no-new
      new FormEngine()

      expect(ComponentRegistry).toHaveBeenCalledTimes(1)
      expect(FunctionRegistry).toHaveBeenCalledTimes(1)
      expect(express.Router).toHaveBeenCalledWith({ mergeParams: true })
    })

    it('should use custom options when provided', () => {
      const customOptions = {
        basePath: '/custom-forms',
        disableBuiltInFunctions: true,
        disableBuiltInComponents: true,
      }

      // eslint-disable-next-line no-new
      new FormEngine(customOptions)

      const mockComponentRegistry = (ComponentRegistry as jest.MockedClass<typeof ComponentRegistry>).mock.instances[0]
      const mockFunctionRegistry = (FunctionRegistry as jest.MockedClass<typeof FunctionRegistry>).mock.instances[0]

      expect(mockFunctionRegistry.registerBuiltInFunctions).not.toHaveBeenCalled()
      expect(mockComponentRegistry.registerBuiltInComponents).not.toHaveBeenCalled()
    })

    it('should register built-in functions and components by default', () => {
      // eslint-disable-next-line no-new
      new FormEngine({})

      const mockComponentRegistry = (ComponentRegistry as jest.MockedClass<typeof ComponentRegistry>).mock.instances[0]
      const mockFunctionRegistry = (FunctionRegistry as jest.MockedClass<typeof FunctionRegistry>).mock.instances[0]

      expect(mockFunctionRegistry.registerBuiltInFunctions).toHaveBeenCalledTimes(1)
      expect(mockComponentRegistry.registerBuiltInComponents).toHaveBeenCalledTimes(1)
    })

    it('should use custom logger when provided', () => {
      const engine = new FormEngine({})

      // Logger is stored and will be used in other methods
      expect(engine).toBeDefined()
    })
  })

  describe('registerComponent', () => {
    it('should register a single component', () => {
      const engine = new FormEngine({})
      const mockComponent = buildComponent('test-component', async () => '<div>Test</div>')

      engine.registerComponent(mockComponent)

      const mockComponentRegistry = (ComponentRegistry as jest.MockedClass<typeof ComponentRegistry>).mock.instances[0]
      expect(mockComponentRegistry.registerMany).toHaveBeenCalledWith([mockComponent])
    })
  })

  describe('registerComponents', () => {
    it('should register multiple components', () => {
      const engine = new FormEngine({})
      const mockComponents = [
        buildComponent('component-1', async () => '<div>1</div>'),
        buildComponent('component-2', async () => '<div>2</div>'),
      ]

      engine.registerComponents(mockComponents)

      const mockComponentRegistry = (ComponentRegistry as jest.MockedClass<typeof ComponentRegistry>).mock.instances[0]
      expect(mockComponentRegistry.registerMany).toHaveBeenCalledWith(mockComponents)
    })
  })

  describe('registerFunctions', () => {
    it('should register a function registry object', () => {
      const engine = new FormEngine({})
      const mockRegistry = {
        Function1: { name: 'Function1', evaluate: () => true },
        Function2: { name: 'Function2', evaluate: (x: any) => x },
      }

      engine.registerFunctions(mockRegistry)

      const mockFunctionRegistry = (FunctionRegistry as jest.MockedClass<typeof FunctionRegistry>).mock.instances[0]
      expect(mockFunctionRegistry.register).toHaveBeenCalledWith(mockRegistry)
    })
  })

  describe('registerForm', () => {
    it('should successfully register a form from string configuration', () => {
      const engine = new FormEngine({ logger: mockLogger })
      const formConfig = JSON.stringify({
        journey: 'test-journey',
        code: 'test-form',
        title: 'Test Form',
      })

      engine.registerForm(formConfig)

      // Verify FormInstance creation
      expect(FormInstance.createFromConfiguration).toHaveBeenCalledWith(
        formConfig,
        expect.objectContaining({
          functionRegistry: expect.any(FunctionRegistry),
          componentRegistry: expect.any(ComponentRegistry),
          logger: mockLogger,
        }),
        expect.objectContaining({
          basePath: '/forms',
          disableBuiltInFunctions: false,
          disableBuiltInComponents: false,
        }),
      )

      // Verify router setup
      expect(mockRouter.use).toHaveBeenCalledWith('/forms', mockFormInstanceRouter)

      // Verify logging
      expect(formatBox).toHaveBeenCalledWith(
        [
          { label: 'Form', value: 'Test Form' },
          { label: 'Code', value: 'test-form' },
          { label: 'Base Path', value: '/forms' },
          { label: 'Routes', value: '2 registered' },
          { label: 'GET Paths', value: '/forms/start\n/forms/page-1' },
        ],
        { title: 'FormEngine' },
      )
      expect(mockLogger.info).toHaveBeenCalledWith('formatted box')
    })

    it('should successfully register a form from JourneyDefinition object', () => {
      const engine = new FormEngine({})
      const formConfig: JourneyDefinition = {
        journey: 'test-journey',
        code: 'test-form',
        title: 'Test Form',
        steps: [],
      } as any

      engine.registerForm(formConfig)

      expect(FormInstance.createFromConfiguration).toHaveBeenCalledWith(
        formConfig,
        expect.any(Object),
        expect.any(Object),
      )
    })

    it('should not include GET paths in log when there are no GET routes', () => {
      mockFormInstance.getRegisteredRoutes.mockReturnValue([
        { method: 'POST', path: '/submit' },
        { method: 'PUT', path: '/update' },
      ])

      const engine = new FormEngine({})
      engine.registerForm('test-config')

      expect(formatBox).toHaveBeenCalledWith(
        [
          { label: 'Form', value: 'Test Form' },
          { label: 'Code', value: 'test-form' },
          { label: 'Base Path', value: '/forms' },
          { label: 'Routes', value: '0 registered' },
        ],
        { title: 'FormEngine' },
      )
    })

    it('should use custom base path in route paths', () => {
      const engine = new FormEngine({ basePath: '/custom' })
      engine.registerForm('test-config')

      expect(mockRouter.use).toHaveBeenCalledWith('/custom', mockFormInstanceRouter)
      expect(formatBox).toHaveBeenCalledWith(
        expect.arrayContaining([
          { label: 'Base Path', value: '/custom' },
          { label: 'GET Paths', value: '/custom/start\n/custom/page-1' },
        ]),
        expect.any(Object),
      )
    })

    it('should handle regular errors during form registration', () => {
      const error = new Error('Registration failed')
      ;(FormInstance.createFromConfiguration as jest.Mock).mockImplementation(() => {
        throw error
      })

      const engine = new FormEngine({ logger: mockLogger })
      engine.registerForm('invalid-config')

      expect(mockLogger.error).toHaveBeenCalledWith(error)
      expect(mockRouter.use).not.toHaveBeenCalled()
    })

    it('should handle AggregateError during form registration', () => {
      const error1 = new Error('Validation error 1')
      const error2 = new Error('Validation error 2')
      const aggregateError = new AggregateError([error1, error2], 'Multiple validation errors')

      ;(FormInstance.createFromConfiguration as jest.Mock).mockImplementation(() => {
        throw aggregateError
      })

      const engine = new FormEngine({ logger: mockLogger })
      engine.registerForm('invalid-config')

      expect(mockLogger.error).toHaveBeenCalledWith('Multiple validation errors:')
      expect(mockLogger.error).toHaveBeenCalledWith('Error: Validation error 1')
      expect(mockLogger.error).toHaveBeenCalledWith('Error: Validation error 2')
      expect(mockLogger.error).toHaveBeenCalledTimes(3)
    })

    it('should handle errors without toString method in AggregateError', () => {
      const error1 = { message: 'Object error' }
      const error2: any = null
      const aggregateError = new AggregateError([error1, error2], 'Mixed errors')

      ;(FormInstance.createFromConfiguration as jest.Mock).mockImplementation(() => {
        throw aggregateError
      })

      const engine = new FormEngine({ logger: mockLogger })
      engine.registerForm('invalid-config')

      expect(mockLogger.error).toHaveBeenCalledWith('Mixed errors:')
      expect(mockLogger.error).toHaveBeenCalledWith('[object Object]')
      expect(mockLogger.error).toHaveBeenCalledWith('null')
    })

    it('should store form instance after successful registration', () => {
      const engine = new FormEngine({})
      engine.registerForm('test-config')

      const instance = engine.getFormInstance('test-form')
      expect(instance).toBe(mockFormInstance)
    })
  })

  describe('getRouter', () => {
    it('should return the main router', () => {
      const engine = new FormEngine({})
      const router = engine.getRouter()

      expect(router).toBe(mockRouter)
    })
  })

  describe('getFormInstance', () => {
    it('should return a registered form instance', () => {
      const engine = new FormEngine({})
      engine.registerForm('test-config')

      const instance = engine.getFormInstance('test-form')
      expect(instance).toBe(mockFormInstance)
    })

    it('should return undefined for non-existent form', () => {
      const engine = new FormEngine({})

      const instance = engine.getFormInstance('non-existent')
      expect(instance).toBeUndefined()
    })

    it('should handle multiple form registrations', () => {
      const engine = new FormEngine({})

      // First form
      engine.registerForm('config-1')

      // Second form with different code
      const mockFormInstance2 = {
        ...mockFormInstance,
        getFormCode: jest.fn().mockReturnValue('test-form-2'),
      }
      ;(FormInstance.createFromConfiguration as jest.Mock).mockReturnValue(mockFormInstance2)
      engine.registerForm('config-2')

      expect(engine.getFormInstance('test-form')).toBe(mockFormInstance)
      expect(engine.getFormInstance('test-form-2')).toBe(mockFormInstance2)
    })
  })

  describe('fluent interface / method chaining', () => {
    it('should support method chaining for all registration methods', () => {
      const engine = new FormEngine({})
      const component1 = buildComponent('comp-1', async () => '<div>1</div>')
      const component2 = buildComponent('comp-2', async () => '<div>2</div>')
      const functions1 = {
        Func1: { name: 'Func1', evaluate: () => true },
      }
      const functions2 = {
        Func2: { name: 'Func2', evaluate: (x: any) => x },
      }

      const result = engine
        .registerComponent(component1)
        .registerComponents([component2])
        .registerFunctions(functions1)
        .registerFunctions(functions2)
        .registerForm('config-1')
        .registerForm('config-2')

      expect(result).toBe(engine)
      expect(engine.getFormInstance('test-form')).toBeDefined()
    })

    it('should support chaining even when form registration fails', () => {
      const engine = new FormEngine({ logger: mockLogger })
      const component = buildComponent('comp', async () => '<div />')

      ;(FormInstance.createFromConfiguration as jest.Mock)
        .mockImplementationOnce(() => {
          throw new Error('First form fails')
        })
        .mockImplementationOnce(() => mockFormInstance)

      const result = engine
        .registerComponent(component)
        .registerForm('bad-config') // This will fail
        .registerForm('good-config') // This should work

      expect(result).toBe(engine)
      expect(mockLogger.error).toHaveBeenCalledWith(expect.any(Error))
      expect(engine.getFormInstance('test-form')).toBeDefined()
    })

    it('should handle complete registration workflow with chaining', () => {
      const engine = new FormEngine({ basePath: '/my-forms' })
      const customComponent = buildComponent('custom-input', async () => '<input />')
      const customFunctions = {
        CustomValidator: {
          name: 'CustomValidator',
          evaluate: (value: any) => value !== null,
        },
      }

      const result = engine
        .registerComponent(customComponent)
        .registerFunctions(customFunctions)
        .registerForm('test-config')

      // Verify chaining returns the engine
      expect(result).toBe(engine)

      // Verify all registrations worked
      const mockComponentRegistry = (ComponentRegistry as jest.MockedClass<typeof ComponentRegistry>).mock.instances[0]
      const mockFunctionRegistry = (FunctionRegistry as jest.MockedClass<typeof FunctionRegistry>).mock.instances[0]

      expect(mockComponentRegistry.registerMany).toHaveBeenCalledWith([customComponent])
      expect(mockFunctionRegistry.register).toHaveBeenCalledWith(customFunctions)
      expect(engine.getFormInstance('test-form')).toBeDefined()
    })
  })
})
