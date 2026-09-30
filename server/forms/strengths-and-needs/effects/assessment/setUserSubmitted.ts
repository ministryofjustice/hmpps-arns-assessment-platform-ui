import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'

export const setUserSubmitted =
  (_deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, stepCode: string, isUserSubmitted: boolean) => {
    const session = context.getSession()
    session.userSubmitted = {
      ...(session.userSubmitted ?? {}),
      [stepCode]: isUserSubmitted,
    }
  }
