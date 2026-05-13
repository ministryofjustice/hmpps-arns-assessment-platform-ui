import { EventDTO, TimelineItem } from './dataModel';

export interface DataDeletionDataResponse {
  events: EventDTO[],
  timeline: TimelineItem[],
}
