import { ExpressionType, LogicType } from '@form-engine/form/types/enums'
import { isExpressionNode } from '@form-engine/core/typeguards/expression-nodes'
import { ASTTestFactory } from '@form-engine/test-utils/ASTTestFactory'
import { attachValidationBlockCode } from './AttachValidationBlockCode'

describe('attachValidationBlockCode', () => {
  beforeEach(() => {
    ASTTestFactory.resetIds()
  })

  const buildValidation = () =>
    ASTTestFactory.expression(ExpressionType.VALIDATION)
      .withProperty('when', ASTTestFactory.expression(LogicType.TEST).build())
      .withProperty('message', 'Required field')
      .build()

  it('attaches static block code to validation expressions', () => {
    const journey = ASTTestFactory.journey().withStep(step =>
      step.withBlock('TextInput', 'field', block => block.withCode('nickname').withValidation(buildValidation())),
    )

    const ast = journey.build()

    attachValidationBlockCode(ast)

    const steps = ast.properties.get('steps')
    const block = steps[0].properties.get('blocks')[0]
    const validation = block.properties.get('validation')

    expect(validation.properties.get('resolvedBlockCode')).toBe('nickname')
  })

  it('attaches cloned dynamic code expressions to validation nodes', () => {
    const dynamicCode = ASTTestFactory.reference(['answers', 'dynamicCode'])

    const journey = ASTTestFactory.journey().withStep(step =>
      step.withBlock('TextInput', 'field', block => block.withCode(dynamicCode).withValidation(buildValidation())),
    )

    const ast = journey.build()

    attachValidationBlockCode(ast)

    const steps = ast.properties.get('steps')
    const block = steps[0].properties.get('blocks')[0]
    const validation = block.properties.get('validation')

    const resolved = validation.properties.get('resolvedBlockCode')

    expect(isExpressionNode(resolved)).toBe(true)
    expect(resolved).not.toBe(dynamicCode)
    expect(resolved.properties.get('path')).toEqual(['answers', 'dynamicCode'])
  })

  it('omits resolved block code when block has no code', () => {
    const journey = ASTTestFactory.journey().withStep(step =>
      step.withBlock('Html', 'basic', block => block.withValidation(buildValidation())),
    )

    const ast = journey.build()

    attachValidationBlockCode(ast)

    const steps = ast.properties.get('steps')
    const block = steps[0].properties.get('blocks')[0]
    const validation = block.properties.get('validation')

    expect(validation.properties.has('resolvedBlockCode')).toBe(false)
  })
})
