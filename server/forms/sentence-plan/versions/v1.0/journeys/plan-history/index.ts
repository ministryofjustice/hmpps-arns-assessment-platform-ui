import { journey } from '@form-engine/form/builders'
import { previousVersionsStep } from './steps/previous-versions/step'
import { viewHistoricStep } from './steps/view-historic/step'
import { redirectToPrivacyUnlessAccepted } from '../../guards'

export const planHistoryJourney = journey({
  code: 'plan-history',
  title: 'Plan History',
  path: '/plan-history',
  onAccess: [redirectToPrivacyUnlessAccepted()],
  steps: [previousVersionsStep, viewHistoricStep],
})
