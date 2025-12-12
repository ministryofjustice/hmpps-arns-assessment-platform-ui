import { defineEffectsWithDeps } from '@form-engine/registry/utils/createRegisterableFunction'
import EffectFunctionContext from '@form-engine/core/ast/thunks/EffectFunctionContext'
import { AnswerHistory, AnswerSource } from '@form-engine/core/ast/thunks/types'
import AssessmentPlatformApiClient from '../../data/assessmentPlatformApiClient'
import { CreateAssessmentCommand, UpdateAssessmentAnswersCommand } from '../../interfaces/aap-api/command'
import { Answers, Values } from '../../interfaces/aap-api/dataModel'
import { AssessmentVersionQuery } from '../../interfaces/aap-api/query'
import { AssessmentVersionQueryResult } from '../../interfaces/aap-api/queryResult'
import { CreateAssessmentCommandResult } from '../../interfaces/aap-api/commandResult'

interface AnswerDelta {
  added: Record<string, { value: unknown }>
  removed: string[]
}

function calculateAnswerDelta(histories: Record<string, AnswerHistory>): AnswerDelta {
  const userInputSources: AnswerSource[] = ['post', 'processed', 'action']
  const added: Record<string, { value: unknown }> = {}
  const removed: string[] = []

  Object.entries(histories).forEach(([code, history]) => {
    const hasUserInput = history.mutations.some(m => userInputSources.includes(m.source))

    if (!hasUserInput) {
      return
    }

    const isEmpty = history.current === '' || history.current === undefined || history.current === null

    if (isEmpty) {
      const wasLoaded = history.mutations.some(m => m.source === 'load')

      if (wasLoaded) {
        removed.push(code)
      }
    } else {
      added[code] = { value: history.current }
    }
  })

  return { added, removed }
}

export interface StandupDemoEffectsDeps {
  api: AssessmentPlatformApiClient
}

export const { effects: StandupDemoEffects, createRegistry: createStandupDemoEffectsRegistry } =
  defineEffectsWithDeps<StandupDemoEffectsDeps>()({
    standupCreateOrLoadAssessment: deps => async (context: EffectFunctionContext) => {
      const session = context.getSession()
      const user = context.getState('user')
      let assessmentUuid = session?.standupAssessmentUuid

      if (!assessmentUuid) {
        const command: CreateAssessmentCommand = {
          type: 'CreateAssessmentCommand',
          assessmentType: 'AAPStandupDemo',
          formVersion: '1.0.0',
          user,
        }

        const response = await deps.api.executeCommands({ commands: [command] })
        const result = response.commands[0].result as CreateAssessmentCommandResult

        assessmentUuid = result.assessmentUuid
        session.standupAssessmentUuid = assessmentUuid
      }

      const query: AssessmentVersionQuery = {
        type: 'AssessmentVersionQuery',
        assessmentIdentifier: { type: 'UUID', uuid: assessmentUuid },
        user,
      }

      const queryResponse = await deps.api.executeQueries({ queries: [query] })
      const assessment = queryResponse.queries[0].result as AssessmentVersionQueryResult

      context.setData('assessment', assessment)

      Object.entries(assessment.answers).forEach(([code, value]) => {
        if (value.type === 'Single') {
          context.setAnswer(code, value.value)
        } else {
          context.setAnswer(code, value.values)
        }
      })
    },

    loadCspNonce: _deps => (context: EffectFunctionContext) => {
      const cspNonce = context.getState('cspNonce')
      context.setData('cspNonce', cspNonce)
    },

    standupClearSession: _deps => (context: EffectFunctionContext) => {
      const session = context.getSession()
      delete session.standupAssessmentUuid
    },

    standupSaveStepAnswers: deps => async (context: EffectFunctionContext) => {
      const histories = context.getAllAnswerHistories()
      const delta = calculateAnswerDelta(histories)
      const hasChanges = Object.keys(delta.added).length > 0 || delta.removed.length > 0

      if (!hasChanges) {
        return
      }

      const user = context.getState('user')
      const assessment = context.getData('assessment') as AssessmentVersionQueryResult

      const added: Answers = Object.fromEntries(
        Object.entries(delta.added).map(([code, entry]): [string, Values] => [
          code,
          Array.isArray(entry.value)
            ? { type: 'Multi', values: entry.value as string[] }
            : { type: 'Single', value: String(entry.value) },
        ]),
      )

      const command: UpdateAssessmentAnswersCommand = {
        type: 'UpdateAssessmentAnswersCommand',
        assessmentUuid: assessment.assessmentUuid,
        added,
        removed: delta.removed,
        user,
      }

      await deps.api.executeCommands({ commands: [command] })
    },
  })
