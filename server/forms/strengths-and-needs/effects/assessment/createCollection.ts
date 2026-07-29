import { StrengthsAndNeedsContext, StrengthsAndNeedsEffectsDeps } from '../types'
import { CreateCollectionCommand } from '../../../../interfaces/aap-api/command'

export const createVictimCollection =
  (deps: StrengthsAndNeedsEffectsDeps) => async (context: StrengthsAndNeedsContext, fieldCodes: string[]) => {
    const user = context.getState('user')
    const assessmentUuid = context.getData('assessmentUuid')
    const session = context.getSession()
    const sessionDetails = session.sessionDetails

    const item: Record<string, unknown> = {}

    // Get form answers
    for (const code of fieldCodes) {
      const value = context.getAnswer(code)

      if (value !== undefined) {
        item[code] = value
      }
    }

    // Get or create OFFENCE_ANALYSIS_VICTIM collection
    let victimCollectionUuid = context.getData('victimCollectionUuid')

    if (!victimCollectionUuid) {
      const createResult = await deps.api.executeCommand({
        type: 'CreateCollectionCommand',
        name: 'OFFENCE_ANALYSIS_VICTIM',
        assessmentUuid,
        user,
      })

      victimCollectionUuid = createResult.collectionUuid
    }

    context.setData('victimCollectionUuid', victimCollectionUuid)
  }
