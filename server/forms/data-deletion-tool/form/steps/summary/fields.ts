import { Session } from '@ministryofjustice/hmpps-forge/core/authoring'
import { Summary } from '../../../components/summary/summary'

export const summaryComponent = Summary({
  currentData: Session('currentData'),
  deletionRequest: Session('deletionRequest'),
})
