import { Session } from '@ministryofjustice/hmpps-forge/core/authoring';
import { Timeline } from '../../../components/timeline/timeline';

export const timelineComponent = Timeline({
  timeline: Session('currentData.timeline'),
  postData: Session('timelinePostData'),
})
