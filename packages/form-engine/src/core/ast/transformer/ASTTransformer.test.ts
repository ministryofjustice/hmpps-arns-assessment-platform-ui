import { StructureType, ExpressionType, LogicType, FunctionType, TransitionType } from '@form-engine/form/types/enums'
import UnknownNodeTypeError from '@form-engine/errors/UnknownNodeTypeError'
import InvalidNodeError from '@form-engine/errors/InvalidNodeError'
import { ASTNodeType } from '@form-engine/core/types/enums'
import { ASTTransformer } from './ASTTransformer'
import {
  ASTNode,
  JourneyASTNode,
  StepASTNode,
  BlockASTNode,
  ReferenceASTNode,
  PipelineASTNode,
  ConditionalASTNode,
  PredicateASTNode,
  FunctionASTNode,
  ValidationASTNode,
  LoadTransitionASTNode,
  AccessTransitionASTNode,
  SubmitTransitionASTNode,
} from '../types/nodes.type'

describe('ASTTransformer', () => {
  describe('transform()', () => {
    it('should transform a valid journey definition', () => {
      const journey = {
        type: StructureType.JOURNEY,
        code: 'test-journey',
        title: 'Test Journey',
        steps: [] as any[],
      }

      const result = ASTTransformer.transform(journey)

      expect(result).toMatchObject({
        type: ASTNodeType.JOURNEY,
      })
      expect(result.raw).toBe(journey)
    })

    it('should transform without source path', () => {
      const step = {
        type: StructureType.STEP,
        path: '/step1',
        blocks: [] as any[],
      }

      const result = ASTTransformer.transform(step)

      expect(result).toMatchObject({
        type: ASTNodeType.STEP,
      })
    })

    it('should throw InvalidNodeError for non-object input', () => {
      expect(() => ASTTransformer.transform('not an object')).toThrow(InvalidNodeError)
      expect(() => ASTTransformer.transform(123)).toThrow(InvalidNodeError)
      expect(() => ASTTransformer.transform(null)).toThrow(InvalidNodeError)
      expect(() => ASTTransformer.transform(undefined)).toThrow(InvalidNodeError)
    })

    it('should throw UnknownNodeTypeError for unknown node types', () => {
      const unknownNode = {
        type: 'UnknownType',
        someProperty: 'value',
      }

      expect(() => ASTTransformer.transform(unknownNode)).toThrow(UnknownNodeTypeError)
    })

    it('should handle empty objects', () => {
      const emptyStep = {
        type: StructureType.STEP,
        path: '/empty',
        blocks: [] as any[],
      }

      const result = ASTTransformer.transform(emptyStep) as StepASTNode

      expect(result.type).toBe(ASTNodeType.STEP)
      const blocks = result.properties.get('blocks') as any[]
      expect(blocks).toEqual([])
    })

    it('should handle objects with many properties', () => {
      const largeObject = {
        type: StructureType.JOURNEY,
        code: 'test',
        title: 'Test',
        ...Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`property${i}`, `value${i}`])),
      }

      const result = ASTTransformer.transform(largeObject) as JourneyASTNode

      expect(result.properties.size).toBeGreaterThan(100)
      expect(result.properties.get('property50')).toBe('value50')
    })

    it('should preserve metadata in all transformations', () => {
      const journey = {
        type: StructureType.JOURNEY,
        code: 'test',
        title: 'Test',
        steps: [
          {
            type: StructureType.STEP,
            path: '/step',
            blocks: [
              {
                type: StructureType.BLOCK,
                variant: 'text',
                code: 'field1',
              },
            ],
          },
        ],
      }

      const result = ASTTransformer.transform(journey) as JourneyASTNode

      expect(result.raw).toBe(journey)

      const steps = result.properties.get('steps') as ASTNode[]
      expect(steps[0].raw).toBe(journey.steps[0])

      const blocks = (steps[0] as StepASTNode).properties.get('blocks') as ASTNode[]
      expect(blocks[0].raw).toBe(journey.steps[0].blocks[0])
    })

    it('should handle complex real-world form configuration', () => {
      const complexForm = {
        type: StructureType.JOURNEY,
        code: 'assessment',
        title: 'Complex Assessment',
        onLoad: [
          {
            type: TransitionType.LOAD,
            effects: [{ type: FunctionType.EFFECT, name: 'loadUser', arguments: [] as any[] }],
          },
        ],
        steps: [
          {
            type: StructureType.STEP,
            path: '/personal',
            blocks: [
              {
                type: StructureType.BLOCK,
                variant: 'fieldset',
                blocks: [
                  {
                    type: StructureType.BLOCK,
                    variant: 'text',
                    code: 'firstName',
                    validate: [
                      {
                        type: ExpressionType.VALIDATION,
                        when: {
                          type: LogicType.TEST,
                          subject: { type: ExpressionType.REFERENCE, path: ['@self'] },
                          negate: true,
                          condition: { type: FunctionType.CONDITION, name: 'isRequired', arguments: [] as any[] },
                        },
                        message: 'First name is required',
                      },
                    ],
                  },
                  {
                    type: StructureType.BLOCK,
                    variant: 'text',
                    code: 'lastName',
                  },
                ],
              },
              {
                type: StructureType.BLOCK,
                variant: 'collection',
                template: [
                  {
                    type: StructureType.BLOCK,
                    variant: 'text',
                    code: {
                      type: ExpressionType.FORMAT,
                      text: 'address_%1_street',
                      args: [{ type: ExpressionType.REFERENCE, path: ['@item', 'id'] }],
                    },
                  },
                ],
                collectionContext: {
                  collection: { type: ExpressionType.REFERENCE, path: ['answers', 'addresses'] },
                },
              },
            ],
            onSubmission: [
              {
                type: TransitionType.SUBMIT,
                when: {
                  type: LogicType.TEST,
                  subject: { type: ExpressionType.REFERENCE, path: ['post', 'action'] },
                  negate: false,
                  condition: { type: FunctionType.CONDITION, name: 'equals', arguments: ['continue'] as any[] },
                },
                validate: true,
                onValid: {
                  effects: [{ type: FunctionType.EFFECT, name: 'save', arguments: [] as any[] }],
                  next: [
                    {
                      type: ExpressionType.NEXT,
                      when: {
                        type: LogicType.TEST,
                        subject: { type: ExpressionType.REFERENCE, path: ['answers', 'hasChildren'] },
                        negate: false,
                        condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
                      },
                      goto: '/children',
                    },
                    {
                      type: ExpressionType.NEXT,
                      goto: '/summary',
                    },
                  ],
                },
                onInvalid: {
                  next: [{ type: ExpressionType.NEXT, goto: '@self' }],
                },
              },
            ],
          },
        ],
      }

      const result = ASTTransformer.transform(complexForm)

      expect(result).toBeDefined()
      expect(result.type).toBe(ASTNodeType.JOURNEY)

      const steps = (result as JourneyASTNode).properties.get('steps') as ASTNode[]
      expect(steps).toHaveLength(1)

      const blocks = (steps[0] as StepASTNode).properties.get('blocks') as ASTNode[]
      expect(blocks).toHaveLength(2)

      expect(blocks[0]).toMatchObject({
        type: ASTNodeType.BLOCK,
        variant: 'fieldset',
      })

      expect(blocks[1]).toMatchObject({
        type: ASTNodeType.BLOCK,
        variant: 'collection',
      })
    })
  })

  describe('Structure Transformations', () => {
    describe('transformJourney()', () => {
      it('should transform a complete journey with all properties', () => {
        const journey = {
          type: StructureType.JOURNEY,
          code: 'assessment',
          title: 'Assessment Journey',
          description: 'A test assessment',
          path: '/assessment',
          version: '1.0',
          controller: 'customController',
          onLoad: [
            {
              type: TransitionType.LOAD,
              effects: [] as any[],
            },
          ],
          onAccess: [
            {
              type: TransitionType.ACCESS,
              guards: {
                type: LogicType.TEST,
                subject: { type: ExpressionType.REFERENCE, path: ['data', 'authenticated'] },
                negate: false,
                condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
              },
            },
          ],
          steps: [
            {
              type: StructureType.STEP,
              path: '/step1',
              blocks: [] as any[],
            },
          ],
          children: [
            {
              type: StructureType.JOURNEY,
              code: 'child-journey',
              title: 'Child Journey',
              steps: [] as any[],
            },
          ],
        }

        const result = ASTTransformer.transform(journey) as JourneyASTNode

        expect(result.type).toBe(ASTNodeType.JOURNEY)
        expect(result.properties.get('code')).toBe('assessment')
        expect(result.properties.get('title')).toBe('Assessment Journey')
        expect(result.properties.get('description')).toBe('A test assessment')
        expect(result.properties.get('version')).toBe('1.0')
        expect(result.properties.get('controller')).toBe('customController')

        const steps = result.properties.get('steps') as ASTNode[]
        expect(steps).toHaveLength(1)
        expect(steps[0]).toMatchObject({
          type: ASTNodeType.STEP,
        })

        const children = result.properties.get('children') as ASTNode[]
        expect(children).toHaveLength(1)
        expect(children[0]).toMatchObject({
          type: ASTNodeType.JOURNEY,
        })

        const onLoad = result.properties.get('onLoad') as ASTNode[]
        expect(onLoad).toHaveLength(1)
        expect(onLoad[0]).toMatchObject({
          type: ASTNodeType.TRANSITION,
          transitionType: 'TransitionType.Load',
        })
      })

      it('should handle journey with minimal properties', () => {
        const journey = {
          type: StructureType.JOURNEY,
          code: 'minimal',
          title: 'Minimal Journey',
        }

        const result = ASTTransformer.transform(journey) as JourneyASTNode

        expect(result.type).toBe(ASTNodeType.JOURNEY)
        expect(result.properties.get('code')).toBe('minimal')
        expect(result.properties.get('title')).toBe('Minimal Journey')
        expect(result.properties.get('steps')).toBeUndefined()
        expect(result.properties.get('children')).toBeUndefined()
      })
    })

    describe('transformStep()', () => {
      it('should transform a complete step with all properties', () => {
        const step = {
          type: StructureType.STEP,
          path: '/personal-details',
          blocks: [
            {
              type: StructureType.BLOCK,
              variant: 'text',
              code: 'name',
            },
          ],
          onLoad: [
            {
              type: TransitionType.LOAD,
              effects: [] as any[],
            },
          ],
          onSubmission: [
            {
              type: TransitionType.SUBMIT,
              validate: true,
              onValid: {
                next: [{ type: ExpressionType.NEXT, goto: '/next-step' }],
              },
              onInvalid: {
                next: [{ type: ExpressionType.NEXT, goto: '@self' }],
              },
            },
          ],
          controller: 'stepController',
          template: 'custom-template',
          entry: true,
          checkJourneyTraversal: false,
          backlink: '/previous',
        }

        const result = ASTTransformer.transform(step) as StepASTNode

        expect(result.type).toBe(ASTNodeType.STEP)
        expect(result.properties.get('path')).toBe('/personal-details')
        expect(result.properties.get('controller')).toBe('stepController')
        expect(result.properties.get('template')).toBe('custom-template')
        expect(result.properties.get('entry')).toBe(true)
        expect(result.properties.get('checkJourneyTraversal')).toBe(false)
        expect(result.properties.get('backlink')).toBe('/previous')

        const blocks = result.properties.get('blocks') as ASTNode[]
        expect(blocks).toHaveLength(1)
        expect(blocks[0]).toMatchObject({
          type: ASTNodeType.BLOCK,
          variant: 'text',
        })

        const onSubmission = result.properties.get('onSubmission') as ASTNode[]
        expect(onSubmission).toHaveLength(1)
        expect(onSubmission[0]).toMatchObject({
          type: ASTNodeType.TRANSITION,
          transitionType: 'TransitionType.Submit',
        })
      })
    })

    describe('transformBlock()', () => {
      it('should transform a field block', () => {
        const fieldBlock = {
          type: StructureType.BLOCK,
          variant: 'text',
          code: 'username',
          label: 'Username',
          validate: [
            {
              type: ExpressionType.VALIDATION,
              when: {
                type: LogicType.TEST,
                subject: { type: ExpressionType.REFERENCE, path: ['@self'] },
                negate: true,
                condition: { type: FunctionType.CONDITION, name: 'isRequired', arguments: [] as any[] },
              },
              message: 'Username is required',
            },
          ],
        }

        const result = ASTTransformer.transform(fieldBlock) as BlockASTNode

        expect(result.type).toBe(ASTNodeType.BLOCK)
        expect(result.variant).toBe('text')
        expect(result.blockType).toBe('field')
        expect(result.properties.get('code')).toBe('username')
        expect(result.properties.get('label')).toBe('Username')

        const validate = result.properties.get('validate') as ASTNode[]
        expect(validate).toHaveLength(1)
        expect(validate[0]).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Validation',
        })
      })

      it('should transform a collection block', () => {
        const collectionBlock = {
          type: StructureType.BLOCK,
          variant: 'collection',
          template: [
            {
              type: StructureType.BLOCK,
              variant: 'text',
              code: 'item_name',
            },
          ],
          collectionContext: {
            collection: { type: ExpressionType.REFERENCE, path: ['answers', 'items'] },
          },
        }

        const result = ASTTransformer.transform(collectionBlock) as BlockASTNode

        expect(result.type).toBe(ASTNodeType.BLOCK)
        expect(result.variant).toBe('collection')
        expect(result.blockType).toBe('collection')

        const template = result.properties.get('template') as ASTNode[]
        expect(template).toHaveLength(1)
        expect(template[0]).toMatchObject({
          type: ASTNodeType.BLOCK,
          variant: 'text',
        })

        const collectionContext = result.properties.get('collectionContext') as any
        expect(collectionContext.collection).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Reference',
        })
      })

      it('should transform a composite block', () => {
        const compositeBlock = {
          type: StructureType.BLOCK,
          variant: 'fieldset',
          blocks: [
            {
              type: StructureType.BLOCK,
              variant: 'text',
              code: 'first_name',
            },
            {
              type: StructureType.BLOCK,
              variant: 'text',
              code: 'last_name',
            },
          ],
        }

        const result = ASTTransformer.transform(compositeBlock) as BlockASTNode

        expect(result.type).toBe(ASTNodeType.BLOCK)
        expect(result.variant).toBe('fieldset')
        expect(result.blockType).toBe('composite')

        const blocks = result.properties.get('blocks') as ASTNode[]
        expect(blocks).toHaveLength(2)
        expect(blocks[0]).toMatchObject({
          type: ASTNodeType.BLOCK,
          variant: 'text',
        })
      })
    })
  })

  describe('Expression Transformations', () => {
    describe('transformReference()', () => {
      it('should transform a reference expression', () => {
        const reference = {
          type: ExpressionType.REFERENCE,
          path: ['answers', 'email'],
        }

        const result = ASTTransformer.transform(reference) as ReferenceASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Reference',
        })
        expect(result.properties.get('path')).toEqual(['answers', 'email'])
      })

      it('should handle empty path array', () => {
        const reference = {
          type: ExpressionType.REFERENCE,
          path: [] as string[],
        }

        const result = ASTTransformer.transform(reference) as ReferenceASTNode

        expect(result.properties.get('path')).toEqual([])
      })
    })

    describe('transformPipeline()', () => {
      it('should transform a pipeline expression with steps', () => {
        const pipeline = {
          type: ExpressionType.PIPELINE,
          input: { type: ExpressionType.REFERENCE, path: ['answers', 'name'] },
          steps: [{ name: 'trim' }, { name: 'toLowerCase' }, { name: 'capitalize', args: [true] }],
        }

        const result = ASTTransformer.transform(pipeline) as PipelineASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Pipeline',
        })

        expect(result.properties.get('input')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Reference',
        })

        expect(result.properties.get('steps')).toHaveLength(3)
        expect(result.properties.get('steps')[0]).toEqual({ name: 'trim', args: undefined })
        expect(result.properties.get('steps')[1]).toEqual({ name: 'toLowerCase', args: undefined })
        expect(result.properties.get('steps')[2]).toEqual({ name: 'capitalize', args: [true] })
      })
    })

    describe('transformConditional()', () => {
      it('should transform a conditional expression', () => {
        const conditional = {
          type: LogicType.CONDITIONAL,
          predicate: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'hasChildren'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
          },
          then: 'Show children fields',
          else: 'Hide children fields',
        }

        const result = ASTTransformer.transform(conditional) as ConditionalASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'LogicType.Conditional',
        })

        expect(result.properties.get('predicate')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.TEST,
        })

        expect(result.properties.get('thenValue')).toBe('Show children fields')
        expect(result.properties.get('elseValue')).toBe('Hide children fields')
      })

      it('should handle missing then and else values', () => {
        const conditional = {
          type: LogicType.CONDITIONAL,
          predicate: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['@self'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'isRequired', arguments: [] as any[] },
          },
        }

        const result = ASTTransformer.transform(conditional) as ConditionalASTNode

        expect(result.properties.get('thenValue')).toBeUndefined()
        expect(result.properties.get('elseValue')).toBeUndefined()
      })
    })

    describe('transformValidation()', () => {
      it('should transform a validation expression', () => {
        const validation = {
          type: ExpressionType.VALIDATION,
          when: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['@self'] },
            negate: true,
            condition: { type: FunctionType.CONDITION, name: 'isEmail', arguments: [] as any[] },
          },
          message: 'Please enter a valid email',
          submissionOnly: true,
          details: { field: 'email', errorType: 'format' },
        }

        const result = ASTTransformer.transform(validation) as ValidationASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Validation',
        })
        expect(result.properties.get('message')).toBe('Please enter a valid email')
        expect(result.properties.get('submissionOnly')).toBe(true)
        expect(result.properties.get('details')).toEqual({ field: 'email', errorType: 'format' })

        expect(result.properties.get('when')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.TEST,
        })
      })

      it('should handle missing optional properties', () => {
        const validation = {
          type: ExpressionType.VALIDATION,
          when: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['@self'] },
            negate: true,
            condition: { type: FunctionType.CONDITION, name: 'isRequired', arguments: [] as any[] },
          },
          message: 'Required field',
        }

        const result = ASTTransformer.transform(validation) as ValidationASTNode

        expect(result.properties.get('message')).toBe('Required field')
        expect(result.properties.get('submissionOnly')).toBeUndefined()
        expect(result.properties.get('details')).toBeUndefined()
      })
    })

    describe('transformPredicate()', () => {
      it('should transform a TEST predicate', () => {
        const predicate = {
          type: LogicType.TEST,
          subject: { type: ExpressionType.REFERENCE, path: ['answers', 'age'] },
          negate: false,
          condition: { type: FunctionType.CONDITION, name: 'greaterThan', arguments: [18] as any[] },
        }

        const result = ASTTransformer.transform(predicate) as PredicateASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.TEST,
        })

        expect(result.properties.get('subject')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
        })

        expect(result.properties.get('condition')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
        })
      })

      it('should transform an AND predicate', () => {
        const predicate = {
          type: LogicType.AND,
          operands: [
            {
              type: LogicType.TEST,
              subject: { type: ExpressionType.REFERENCE, path: ['answers', 'age'] },
              negate: false,
              condition: { type: FunctionType.CONDITION, name: 'greaterThan', arguments: [18] as any[] },
            },
            {
              type: LogicType.TEST,
              subject: { type: ExpressionType.REFERENCE, path: ['answers', 'consent'] },
              negate: false,
              condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
            },
          ],
        }

        const result = ASTTransformer.transform(predicate) as PredicateASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.AND,
        })

        expect(result.properties.get('operands')).toHaveLength(2)
        expect(result.properties.get('operands')[0]).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.TEST,
        })
      })

      it('should transform an OR predicate', () => {
        const predicate = {
          type: LogicType.OR,
          operands: [
            {
              type: LogicType.TEST,
              subject: { type: ExpressionType.REFERENCE, path: ['answers', 'option1'] },
              negate: false,
              condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
            },
            {
              type: LogicType.TEST,
              subject: { type: ExpressionType.REFERENCE, path: ['answers', 'option2'] },
              negate: false,
              condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
            },
          ],
        }

        const result = ASTTransformer.transform(predicate) as PredicateASTNode

        expect(result.expressionType).toBe(LogicType.OR)
        expect(result.properties.get('operands')).toHaveLength(2)
      })

      it('should transform a NOT predicate', () => {
        const predicate = {
          type: LogicType.NOT,
          operand: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['answers', 'accepted'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
          },
        }

        const result = ASTTransformer.transform(predicate) as PredicateASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.NOT,
        })

        expect(result.properties.get('operand')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.TEST,
        })
      })
    })

    describe('transformFunction()', () => {
      it('should transform a condition function', () => {
        const func = {
          type: FunctionType.CONDITION,
          name: 'hasMaxLength',
          arguments: [100, true] as any[],
        }

        const result = ASTTransformer.transform(func) as FunctionASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: FunctionType.CONDITION,
        })
        expect(result.properties.get('name')).toBe('hasMaxLength')
        expect(result.properties.get('arguments')).toEqual([100, true])
      })

      it('should transform a transformer function', () => {
        const func = {
          type: FunctionType.TRANSFORMER,
          name: 'toUpperCase',
          arguments: [] as any[],
        }

        const result = ASTTransformer.transform(func) as FunctionASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: FunctionType.TRANSFORMER,
        })
        expect(result.properties.get('name')).toBe('toUpperCase')
        expect(result.properties.get('arguments')).toEqual([])
      })

      it('should transform an effect function', () => {
        const func = {
          type: FunctionType.EFFECT,
          name: 'save',
          arguments: [{ draft: true }] as any[],
        }

        const result = ASTTransformer.transform(func) as FunctionASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: FunctionType.EFFECT,
        })
        expect(result.properties.get('name')).toBe('save')
        expect(result.properties.get('arguments')).toEqual([{ draft: true }])
      })
    })
  })

  describe('Transition Transformations', () => {
    describe('transformLoadTransition()', () => {
      it('should transform a load transition with effects', () => {
        const transition = {
          type: TransitionType.LOAD,
          effects: [
            { type: FunctionType.EFFECT, name: 'loadUser', arguments: [] as any[] },
            { type: FunctionType.EFFECT, name: 'loadSettings', arguments: [] as any[] },
          ],
        }

        const result = ASTTransformer.transform(transition) as LoadTransitionASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.TRANSITION,
          transitionType: 'TransitionType.Load',
        })

        expect(result.properties.get('effects')).toHaveLength(2)
        expect(result.properties.get('effects')[0]).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: FunctionType.EFFECT,
        })
      })

      it('should handle empty effects array', () => {
        const transition = {
          type: TransitionType.LOAD,
          effects: [] as any[],
        }

        const result = ASTTransformer.transform(transition) as LoadTransitionASTNode

        expect(result.properties.get('effects')).toEqual([])
      })
    })

    describe('transformAccessTransition()', () => {
      it('should transform an access transition with all properties', () => {
        const transition = {
          type: TransitionType.ACCESS,
          guards: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['data', 'authenticated'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
          },
          effects: [{ type: FunctionType.EFFECT, name: 'trackAccess', arguments: [] as any[] }],
          redirect: [{ type: ExpressionType.NEXT, goto: '/login' }],
        }

        const result = ASTTransformer.transform(transition) as AccessTransitionASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.TRANSITION,
          transitionType: 'TransitionType.Access',
        })

        expect(result.properties.get('guards')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: LogicType.TEST,
        })

        expect(result.properties.get('effects')).toHaveLength(1)
        expect(result.properties.get('redirect')).toHaveLength(1)
      })

      it('should handle missing optional properties', () => {
        const transition = {
          type: TransitionType.ACCESS,
        }

        const result = ASTTransformer.transform(transition) as AccessTransitionASTNode

        expect(result.properties.get('guards')).toBeUndefined()
        expect(result.properties.get('effects')).toBeUndefined()
        expect(result.properties.get('redirect')).toBeUndefined()
      })
    })

    describe('transformSubmitTransition()', () => {
      it('should transform a submit transition with validation', () => {
        const transition = {
          type: TransitionType.SUBMIT,
          when: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['post', 'action'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'equals', arguments: ['continue'] as any[] },
          },
          guards: {
            type: LogicType.TEST,
            subject: { type: ExpressionType.REFERENCE, path: ['data', 'canSubmit'] },
            negate: false,
            condition: { type: FunctionType.CONDITION, name: 'equals', arguments: [true] as any[] },
          },
          validate: true,
          onAlways: {
            effects: [{ type: FunctionType.EFFECT, name: 'log', arguments: ['submission attempt'] as any[] }],
          },
          onValid: {
            effects: [{ type: FunctionType.EFFECT, name: 'save', arguments: [] as any[] }],
            next: [{ type: ExpressionType.NEXT, goto: '/next-step' }],
          },
          onInvalid: {
            effects: [{ type: FunctionType.EFFECT, name: 'saveDraft', arguments: [] as any[] }],
            next: [{ type: ExpressionType.NEXT, goto: '@self' }],
          },
        }

        const result = ASTTransformer.transform(transition) as SubmitTransitionASTNode

        expect(result).toMatchObject({
          type: ASTNodeType.TRANSITION,
          transitionType: 'TransitionType.Submit',
        })

        expect(result.properties.get('when')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
        })

        expect(result.properties.get('guards')).toMatchObject({
          type: ASTNodeType.EXPRESSION,
        })

        expect(result.properties.get('validate')).toBe(true)

        expect(result.properties.get('onAlways')?.effects).toHaveLength(1)
        expect(result.properties.get('onValid')?.effects).toHaveLength(1)
        expect(result.properties.get('onValid')?.next).toHaveLength(1)
        expect(result.properties.get('onInvalid')?.effects).toHaveLength(1)
        expect(result.properties.get('onInvalid')?.next).toHaveLength(1)
      })

      it('should handle validate false', () => {
        const transition = {
          type: TransitionType.SUBMIT,
          validate: false,
        }

        const result = ASTTransformer.transform(transition) as SubmitTransitionASTNode

        expect(result.properties.get('validate')).toBe(false)
      })

      it('should handle missing branches', () => {
        const transition = {
          type: TransitionType.SUBMIT,
          validate: true,
          // No branches defined
        }

        const result = ASTTransformer.transform(transition) as SubmitTransitionASTNode

        expect(result.properties.get('onAlways')).toBeUndefined()
        expect(result.properties.get('onValid')).toBeUndefined()
        expect(result.properties.get('onInvalid')).toBeUndefined()
      })
    })
  })

  describe('Helper Methods', () => {
    describe('transformProperties()', () => {
      it('should transform object properties into a Map', () => {
        const obj = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
          steps: [
            {
              type: StructureType.STEP,
              path: '/step1',
              blocks: [] as any[],
            },
          ],
          metadata: {
            version: '1.0',
            author: 'test',
          },
        }

        const result = ASTTransformer.transform(obj) as JourneyASTNode

        expect(result.properties).toBeInstanceOf(Map)
        expect(result.properties.get('code')).toBe('test')
        expect(result.properties.get('title')).toBe('Test')

        const steps = result.properties.get('steps') as ASTNode[]
        expect(steps).toHaveLength(1)
        expect(steps[0]).toMatchObject({
          type: ASTNodeType.STEP,
        })

        const metadataProperty = result.properties.get('metadata') as any
        expect(metadataProperty).toEqual({
          version: '1.0',
          author: 'test',
        })
      })
    })

    describe('transformValue()', () => {
      it('should handle null and undefined', () => {
        const obj = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
          nullValue: null as any,
          undefinedValue: undefined as any,
        }

        const result = ASTTransformer.transform(obj) as JourneyASTNode

        expect(result.properties.get('nullValue')).toBeNull()
        expect(result.properties.get('undefinedValue')).toBeUndefined()
      })

      it('should handle primitive values', () => {
        const obj = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
          stringValue: 'hello',
          numberValue: 42,
          booleanValue: true,
        }

        const result = ASTTransformer.transform(obj) as JourneyASTNode

        expect(result.properties.get('stringValue')).toBe('hello')
        expect(result.properties.get('numberValue')).toBe(42)
        expect(result.properties.get('booleanValue')).toBe(true)
      })

      it('should transform arrays with mixed content', () => {
        const obj = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
          mixedArray: [
            'string',
            42,
            true,
            null,
            { type: StructureType.STEP, path: '/step', blocks: [] as any[] },
            { plain: 'object' },
            ['nested', 'array'],
          ],
        }

        const result = ASTTransformer.transform(obj) as JourneyASTNode

        const mixedArray = result.properties.get('mixedArray') as any[]
        expect(mixedArray).toHaveLength(7)
        expect(mixedArray[0]).toBe('string')
        expect(mixedArray[1]).toBe(42)
        expect(mixedArray[2]).toBe(true)
        expect(mixedArray[3]).toBeNull()
        expect(mixedArray[4]).toMatchObject({
          type: ASTNodeType.STEP,
        })
        expect(mixedArray[5]).toEqual({ plain: 'object' })
        expect(mixedArray[6]).toEqual(['nested', 'array'])
      })

      it('should transform nested objects with nodes', () => {
        const obj = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
          nestedObject: {
            plainProperty: 'value',
            nodeProperty: {
              type: ExpressionType.REFERENCE,
              path: ['test'],
            },
            deeplyNested: {
              level1: {
                level2: {
                  type: FunctionType.CONDITION,
                  name: 'test',
                  arguments: [] as any[],
                },
              },
            },
          },
        }

        const result = ASTTransformer.transform(obj) as JourneyASTNode

        const nestedObject = result.properties.get('nestedObject') as any
        expect(nestedObject.plainProperty).toBe('value')
        expect(nestedObject.nodeProperty).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Reference',
        })
        expect(nestedObject.deeplyNested.level1.level2).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: FunctionType.CONDITION,
        })
      })

      it('should handle deeply nested arrays with nodes', () => {
        const obj = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
          deepArray: [
            [
              [
                {
                  type: ExpressionType.REFERENCE,
                  path: ['deep', 'ref'],
                },
              ],
            ],
          ],
        }

        const result = ASTTransformer.transform(obj) as JourneyASTNode

        const deepArray = result.properties.get('deepArray') as any[][][]
        expect(deepArray[0][0][0]).toMatchObject({
          type: ASTNodeType.EXPRESSION,
          expressionType: 'ExpressionType.Reference',
        })
      })
    })

    describe('isNode()', () => {
      it('should identify valid nodes', () => {
        const journey = {
          type: StructureType.JOURNEY,
          code: 'test',
          title: 'Test',
        }

        const step = {
          type: StructureType.STEP,
          path: '/test',
          blocks: [] as any[],
        }

        const block = {
          type: StructureType.BLOCK,
          variant: 'text',
        }

        const expression = {
          type: ExpressionType.REFERENCE,
          path: ['test'],
        }

        const transition = {
          type: TransitionType.LOAD,
          effects: [] as any[],
        }

        expect(() => ASTTransformer.transform(journey)).not.toThrow()
        expect(() => ASTTransformer.transform(step)).not.toThrow()
        expect(() => ASTTransformer.transform(block)).not.toThrow()
        expect(() => ASTTransformer.transform(expression)).not.toThrow()
        expect(() => ASTTransformer.transform(transition)).not.toThrow()
      })

      it('should not identify non-nodes', () => {
        const notNodes: any[] = [
          null,
          undefined,
          'string',
          123,
          true,
          [],
          { noType: 'property' },
          { type: null },
          { type: 123 },
          { type: 'UnknownType' },
        ]

        notNodes.forEach(notNode => {
          if (notNode === null || notNode === undefined || typeof notNode !== 'object') {
            expect(() => ASTTransformer.transform(notNode)).toThrow(InvalidNodeError)
          } else {
            expect(() => ASTTransformer.transform(notNode)).toThrow(UnknownNodeTypeError)
          }
        })
      })
    })
  })
})
