import { readMockedNeedsAnswer } from './readMockedNeedsAnswer'
import { TrainingSessionLauncherContext } from '../../types'

const contextWithAnswer = (answer: unknown) =>
  ({ getAnswer: jest.fn().mockReturnValue(answer) }) as unknown as TrainingSessionLauncherContext

describe('readMockedNeedsAnswer', () => {
  it('should be YES when the checkbox is ticked', () => {
    const context = contextWithAnswer(['YES'])

    const result = readMockedNeedsAnswer(context)

    expect(result).toBe('YES')
    expect(context.getAnswer).toHaveBeenCalledWith('useMockedCriminogenicNeeds')
  })

  it.each([[[]], [undefined], ['YES']])('should be NO when the answer is %p', answer => {
    const context = contextWithAnswer(answer)

    const result = readMockedNeedsAnswer(context)

    expect(result).toBe('NO')
  })
})
