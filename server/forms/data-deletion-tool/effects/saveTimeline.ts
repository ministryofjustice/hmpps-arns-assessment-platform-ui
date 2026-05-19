import { DataDeletionToolContext, DataDeletionToolEffectsDeps } from './types'
import { DataDeletionOperation } from '../../../interfaces/aap-api/dataDeletion'

/**
 * Save timeline updates to session
 */
export const saveTimeline = (deps: DataDeletionToolEffectsDeps) => async (context: DataDeletionToolContext) => {
  const data = context.getPostData()
  const session = context.getSession()

  session.deletionRequest = session.deletionRequest ?? {}
  session.deletionRequest.timeline = []
  session.timelinePostData = {}

  const timelineActions: [string, DataDeletionOperation][] = Object.entries(data)
    .filter(([key]) => key.startsWith("timeline-action-"))
    .map(([key, value]) => [
      key.slice('timeline-action-'.length), // extract timeline item UUID
      value as DataDeletionOperation,
    ])

  timelineActions.forEach(([uuid, operation]) => {
    session.timelinePostData[`timeline-action-${uuid}`] = operation

    if (operation == DataDeletionOperation.UPDATE) {
      session.timelinePostData[`timeline-event-${uuid}`] = data[`timeline-event-${uuid}`]
      session.timelinePostData[`timeline-data-${uuid}`] = data[`timeline-data-${uuid}`]
      session.timelinePostData[`timeline-custom-type-${uuid}`] = data[`timeline-custom-type-${uuid}`]
      session.timelinePostData[`timeline-custom-data-${uuid}`] = data[`timeline-custom-data-${uuid}`]
    }

    const currentTimelineItem = session.currentData.timeline.find(it => it.uuid == uuid)

    session.deletionRequest.timeline.push({
      uuid: uuid,
      operation: operation,
      timeline: {
        uuid: uuid,
        event: operation == DataDeletionOperation.UPDATE
          ? data[`timeline-event-${uuid}`] ?? currentTimelineItem.event
          : currentTimelineItem.event,
        timestamp: currentTimelineItem.timestamp,
        data: operation == DataDeletionOperation.UPDATE
          ? (data[`timeline-data-${uuid}`] ? JSON.parse(data[`timeline-data-${uuid}`]) : currentTimelineItem.data)
          : currentTimelineItem.data,
        customType: operation == DataDeletionOperation.UPDATE
          ? data[`timeline-custom-type-${uuid}`] ?? currentTimelineItem.customType
          : currentTimelineItem.customType,
        customData: operation == DataDeletionOperation.UPDATE
          ? (data[`timeline-custom-data-${uuid}`] ? JSON.parse(data[`timeline-custom-data-${uuid}`]) : currentTimelineItem.customData)
          : currentTimelineItem.customData,
        user: currentTimelineItem.user,
      },
    })
  })
}
