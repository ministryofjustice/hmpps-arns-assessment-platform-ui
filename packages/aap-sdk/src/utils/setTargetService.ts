import { EffectFunctionContext } from '@ministryofjustice/hmpps-forge/core'

// sets `targetService` on the Express session so shared platform pages
// can adapt their behaviour based on which service the user is operating within:
export const setTargetService =
  () =>
  (context: EffectFunctionContext, service: string): void => {
    const session = context.getSession() as Record<string, unknown> | undefined

    if (session) {
      session.targetService = service
    }
  }
