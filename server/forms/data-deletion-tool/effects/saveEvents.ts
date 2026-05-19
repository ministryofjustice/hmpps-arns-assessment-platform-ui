import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'
import { DataDeletionOperation } from '../../../interfaces/aap-api/dataDeletion'

/**
 * Save event updates to session
 */
export const saveEvents = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const data = context.getPostData()
  const session = context.getSession()

  session.deletionRequest = session.deletionRequest ?? {}
  session.deletionRequest.events = []
  session.eventsPostData = {}

  const eventActions: [string, DataDeletionOperation][] = Object.entries(data)
    .filter(([key]) => key.startsWith("event-action-"))
    .map(([key, value]) => [
      key.slice('event-action-'.length), // extract event UUID
      value as DataDeletionOperation,
    ])

  eventActions.forEach(([uuid, operation]) => {
    session.eventsPostData[`event-action-${uuid}`] = operation

    if (operation == DataDeletionOperation.UPDATE) {
      session.eventsPostData[`event-data-${uuid}`] = data[`event-data-${uuid}`]
    }

    session.deletionRequest.events.push({
      uuid: uuid,
      operation: operation,
      event: operation == DataDeletionOperation.UPDATE
        ? JSON.parse(data[`event-data-${uuid}`])
        : session.currentData.events.find(it => it.uuid == uuid),
    })
  })
}
