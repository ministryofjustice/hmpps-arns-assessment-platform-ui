import EffectFunctionContext from '@form-engine/core/nodes/expressions/effect/EffectFunctionContext'
import { insertNavigationReferrer } from './insertNavigationReferrer'

const CONFIG = { stackKey: 'testStack' }

function makeContext(stack: string[] = []) {
  const session: Record<string, unknown> = { testStack: [...stack] }

  const context = {
    getSession: () => session,
  } as unknown as EffectFunctionContext

  return { context, session }
}

describe('insertNavigationReferrer()', () => {
  it('should push the key onto the stack when the key is not already at the top', async () => {
    // Arrange
    const { context, session } = makeContext(['list'])

    // Act
    await insertNavigationReferrer(context, 'detail', CONFIG)

    // Assert
    expect(session.testStack).toEqual(['list', 'detail'])
  })

  it('should push the key onto an empty stack', async () => {
    // Arrange
    const { context, session } = makeContext([])

    // Act
    await insertNavigationReferrer(context, 'detail', CONFIG)

    // Assert
    expect(session.testStack).toEqual(['detail'])
  })

  it('should not push the key when it is already at the top of the stack', async () => {
    // Arrange
    const { context, session } = makeContext(['list', 'detail'])

    // Act
    await insertNavigationReferrer(context, 'detail', CONFIG)

    // Assert
    expect(session.testStack).toEqual(['list', 'detail'])
  })

  it('should push the key when it exists in the stack but not at the top', async () => {
    // Arrange — 'list' is in the stack but not at top
    const { context, session } = makeContext(['list', 'detail'])

    // Act
    await insertNavigationReferrer(context, 'list', CONFIG)

    // Assert
    expect(session.testStack).toEqual(['list', 'detail', 'list'])
  })

  it('should drop the oldest entry when pushing would exceed the 10-entry cap', async () => {
    // Arrange
    const fullStack = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j']
    const { context, session } = makeContext(fullStack)

    // Act
    await insertNavigationReferrer(context, 'new', CONFIG)

    // Assert
    const result = session.testStack as string[]
    expect(result.length).toBe(10)
    expect(result[0]).toBe('b')
    expect(result[9]).toBe('new')
  })
})
