import { step } from '@form-engine/form/builders'
import { pageHeading } from './fields'

export const previousVersionsStep = step({
  path: '/previous-versions',
  title: 'Previous Versions',
  isEntryPoint: true,
  blocks: [pageHeading],
})
