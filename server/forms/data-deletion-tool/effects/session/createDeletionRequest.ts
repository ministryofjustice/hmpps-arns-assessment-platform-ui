import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from '../types'
import { DataDeletionOperation } from '../../../../interfaces/aap-api/dataDeletion'

export const createDeletionRequest =
  (_deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
    const answers = context.getAllAnswers()
    const session = context.getSession()

    session.deletionRequest = {
      dryRun: true,
      events: Object.entries(answers)
        .filter(([key, value]) => key.startsWith('event-action-') && (value as string[]).length > 0)
        .map(([key, value]) => {
          const uuid = key.slice('event-action-'.length)
          const operation = (value as DataDeletionOperation[])[0]
          const currentEvent = session.currentData.events.find(it => it.uuid === uuid)
          const eventData = answers[`event-data-${uuid}`] as string

          return {
            uuid,
            operation,
            event: operation === DataDeletionOperation.UPDATE ? JSON.parse(eventData) : currentEvent.data,
          }
        }),
      timeline: Object.entries(answers)
        .filter(([key, value]) => key.startsWith('timeline-action-') && (value as string[]).length > 0)
        .map(([key, value]) => {
          const uuid = key.slice('timeline-action-'.length)
          const operation = (value as DataDeletionOperation[])[0]
          const currentTimelineItem = session.currentData.timeline.find(it => it.uuid === uuid)
          const event = answers[`timeline-event-${uuid}`] as string
          const eventData = answers[`timeline-data-${uuid}`] as string
          const customType = answers[`timeline-custom-type-${uuid}`] as string
          const customData = answers[`timeline-custom-data-${uuid}`] as string

          return {
            uuid,
            operation,
            timeline: {
              uuid,
              assessment: currentTimelineItem.assessment,
              position: currentTimelineItem.position,
              event:
                operation === DataDeletionOperation.UPDATE
                  ? (event ?? currentTimelineItem.event)
                  : currentTimelineItem.event,
              timestamp: currentTimelineItem.timestamp,
              data:
                operation === DataDeletionOperation.UPDATE && eventData
                  ? JSON.parse(eventData)
                  : currentTimelineItem.data,
              customType:
                operation === DataDeletionOperation.UPDATE
                  ? (customType ?? currentTimelineItem.customType)
                  : currentTimelineItem.customType,
              customData:
                operation === DataDeletionOperation.UPDATE && customData
                  ? JSON.parse(customData)
                  : currentTimelineItem.customData,
              user: currentTimelineItem.user,
            },
          }
        }),
    }
  }
