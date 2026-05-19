import { Events } from '../../../components/events/events';
import { Session } from '@ministryofjustice/hmpps-forge/core/authoring';

export const eventsComponent = Events({
  events: Session('currentData.events'),
  postData: Session('eventsPostData'),
})
