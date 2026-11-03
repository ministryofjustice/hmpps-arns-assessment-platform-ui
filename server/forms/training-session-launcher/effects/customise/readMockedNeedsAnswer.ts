import { TrainingSessionLauncherContext } from '../../types'

/**
 * The "Use mocked criminogenic needs" checkbox as YES or NO. Checkbox answers are arrays, and an unticked one is
 * empty, which means the mocks were turned off.
 */
export function readMockedNeedsAnswer(context: TrainingSessionLauncherContext): 'YES' | 'NO' {
  const answer: unknown = context.getAnswer('useMockedCriminogenicNeeds')

  return Array.isArray(answer) && answer.includes('YES') ? 'YES' : 'NO'
}
