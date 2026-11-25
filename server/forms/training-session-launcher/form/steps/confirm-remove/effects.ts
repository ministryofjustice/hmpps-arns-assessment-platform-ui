import { trainingSessionLauncherEffectRegistry } from '../../../effects/index'
import { deleteAllSessions, deleteSession } from '../../../effects/preferences/saveSession'
import { deleteScenario } from '../../../effects/preferences/saveScenario'
import { addNotification } from '../../../effects/notifications/addNotification'
import { TrainingSessionLauncherEffectsDeps } from '../../../effects/types'
import { DisplayScenario, DisplaySession, TrainingSessionLauncherContext } from '../../../types'

/**
 * What the trainer asked to remove, passed to the confirm-remove step in the `item` query parameter
 */
export type RemovalItem = 'session' | 'all-sessions' | 'scenario'

/**
 * The item awaiting confirmation, resolved from the trainer's own preferences
 */
export interface RemovalTarget {
  item: RemovalItem
  question: string
  name: string
  detail: string
  trainingSessionId: string
  scenarioId: string
  returnPath: string
  cancelPath: string
}

const firstValue = (value: string | string[] | undefined): string => (Array.isArray(value) ? value[0] : value) ?? ''

/**
 * Work out what is being removed and the question to ask. Returns undefined when the item
 * does not exist, so the step can send the trainer back to Your sessions.
 */
export function resolveRemovalTarget(
  item: string,
  id: string,
  sessions: DisplaySession[],
  savedScenarios: DisplayScenario[],
): RemovalTarget | undefined {
  const none = { name: '', detail: '', trainingSessionId: '', scenarioId: '' }

  if (item === 'all-sessions') {
    if (sessions.length === 0) {
      return undefined
    }

    const question =
      sessions.length === 1
        ? 'Are you sure you want to remove 1 session?'
        : `Are you sure you want to remove all ${sessions.length} sessions?`

    return { ...none, item, question, returnPath: 'sessions', cancelPath: 'sessions' }
  }

  if (item === 'session') {
    const session = sessions.find(s => s.id === id)

    if (!session) {
      return undefined
    }

    return {
      ...none,
      item,
      question: `Are you sure you want to remove ${session.scenarioName}?`,
      name: session.scenarioName,
      detail: [`${session.givenName} ${session.familyName}`.trim(), session.crn].filter(Boolean).join(', '),
      trainingSessionId: session.id,
      returnPath: 'sessions',
      cancelPath: 'sessions',
    }
  }

  if (item === 'scenario') {
    const scenario = savedScenarios.find(s => s.id === id)

    if (!scenario) {
      return undefined
    }

    return {
      ...none,
      item,
      question: `Are you sure you want to remove ${scenario.name}?`,
      name: scenario.name,
      scenarioId: scenario.id,
      returnPath: 'browse',
      cancelPath: `browse?scenario=${encodeURIComponent(scenario.id)}`,
    }
  }

  return undefined
}

/**
 * Load the item awaiting confirmation from the `item` and `id` query parameters into Data('removal').
 * Leaves Data('removal') unset when there is nothing to remove.
 */
export const loadRemovalTarget = () => async (context: TrainingSessionLauncherContext) => {
  const target = resolveRemovalTarget(
    firstValue(context.getQueryParam('item')),
    firstValue(context.getQueryParam('id')),
    context.getData('sessions') ?? [],
    context.getData('savedScenarios') ?? [],
  )

  if (target) {
    context.setData('removal', target)
  }
}

/**
 * Handle the confirmation answer. Only "Yes, remove" (action=confirm) runs the existing delete effect;
 * "Cancel" changes nothing. Either way, Data('removalReturnPath') says where to go next.
 */
export const confirmRemoval =
  (deps: TrainingSessionLauncherEffectsDeps) => async (context: TrainingSessionLauncherContext) => {
    const target = context.getData('removal') as RemovalTarget | undefined
    const confirmed = context.getPostData('action') === 'confirm'
    const returnPath = confirmed ? target?.returnPath : target?.cancelPath

    context.setData('removalReturnPath', returnPath ?? 'sessions')

    if (!confirmed || !target) {
      return
    }

    if (target.item === 'session') {
      await deleteSession(deps)(context, target.trainingSessionId)
      await addNotification()(context, {
        type: 'success',
        title: 'Session removed',
        message: `${target.name} has been removed.`,
        target: 'sessions',
      })
    } else if (target.item === 'all-sessions') {
      await deleteAllSessions(deps)(context)
      await addNotification()(context, {
        type: 'success',
        title: 'Sessions removed',
        message: 'All your training sessions have been removed.',
        target: 'sessions',
      })
    } else {
      await deleteScenario(deps)(context, target.scenarioId)
    }
  }

export const ConfirmRemoveEffects = {
  loadRemovalTarget: trainingSessionLauncherEffectRegistry.register(loadRemovalTarget),
  confirmRemoval: trainingSessionLauncherEffectRegistry.register(confirmRemoval),
}
