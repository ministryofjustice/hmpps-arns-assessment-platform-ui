import { EventDTO, TimelineItem } from './AssessmentDataModel.type'

export interface DataDeletionDataResponse {
  events: EventDTO[]
  timeline: TimelineItem[]
}

export interface DataDeletionRequest {
  events?: EventUpdate[]
  timeline?: TimelineUpdate[]
  dryRun?: boolean
}

export interface EventUpdate {
  uuid: string
  operation: DataDeletionOperation
  event: Record<string, unknown>
}

export interface TimelineUpdate {
  uuid: string
  operation: DataDeletionOperation
  timeline: TimelineItem
}

export enum DataDeletionOperation {
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
}

export interface EventHandlingException {
  eventUuid: string
  eventName: string
  handlerName: string
  cause: Record<string, unknown>
}

export interface DataDeletionResponse {
  success: boolean
  dryRun: boolean
  exception?: EventHandlingException
  rebuiltState?: Record<string, unknown>
}
