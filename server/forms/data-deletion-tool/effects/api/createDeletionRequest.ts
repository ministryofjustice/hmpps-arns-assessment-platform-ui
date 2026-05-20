import { DataDeletionToolContext } from '../types'
import { DataDeletionOperation, DataDeletionRequest } from '../../../../interfaces/aap-api/dataDeletion'

export const createDataDeletionRequest = (context: DataDeletionToolContext): DataDeletionRequest => {
  const answers = context.getAllAnswers()
  const session = context.getSession()

  return {
    events: Object.entries(answers)
      .filter(([key]) => key.startsWith("event-action-"))
      .map(([key, value]) => {
        const uuid = key.slice('event-action-'.length)
        const operation = value as DataDeletionOperation
        const currentEvent = session.currentData.events.find(it => it.uuid == uuid)
        const eventData = answers[`event-data-${uuid}`] as string

        return {
          uuid: uuid,
          operation: operation,
          event: operation == DataDeletionOperation.UPDATE ? JSON.parse(eventData) : currentEvent,
        }
      }),

    timeline: Object.entries(answers)
      .filter(([key]) => key.startsWith("timeline-action-"))
      .map(([key, value]) => {
        const uuid = key.slice('timeline-action-'.length)
        const operation = value as DataDeletionOperation
        const currentTimelineItem = session.currentData.timeline.find(it => it.uuid == uuid)
        const event = answers[`timeline-event-${uuid}`] as string
        const eventData = answers[`timeline-data-${uuid}`] as string
        const customType = answers[`timeline-custom-type-${uuid}`] as string
        const customData = answers[`timeline-custom-data-${uuid}`] as string

        return {
          uuid: uuid,
          operation: operation,
          timeline: {
            uuid: uuid,
            event: operation == DataDeletionOperation.UPDATE
              ? event ?? currentTimelineItem.event
              : currentTimelineItem.event,
            timestamp: currentTimelineItem.timestamp,
            data: operation == DataDeletionOperation.UPDATE
              ? (eventData ? JSON.parse(eventData) : currentTimelineItem.data)
              : currentTimelineItem.data,
            customType: operation == DataDeletionOperation.UPDATE
              ? customType ?? currentTimelineItem.customType
              : currentTimelineItem.customType,
            customData: operation == DataDeletionOperation.UPDATE
              ? (customData ? JSON.parse(customData) : currentTimelineItem.customData)
              : currentTimelineItem.customData,
            user: currentTimelineItem.user,
          },
        }
      }),
  }
}
