import { step } from '@form-engine/form/builders'
import { pageHeading } from './fields'

export const planStep = step({
  path: '/overview',
  title: 'Plan Overview',
  isEntryPoint: true,
  blocks: [pageHeading],
})
