import { journey } from '@form-engine/form/builders'
import riskToOthers from './risk-to-others'

export const roshScreening = journey({
  code: 'rosh_screening',
  title: 'ROSH screening',
  path: '/rosh-screening',
  version: '1.0',
  children: [riskToOthers],
})
