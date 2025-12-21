import { step } from '@form-engine/form/builders'
import { pageContent } from './fields'

/**
 * Blocks & Fields - Field Types
 *
 * Deep dive into the field() builder, common field properties, and GOV.UK field components.
 */
export const fieldsStep = step({
  path: '/fields',
  title: 'Fields',
  blocks: [pageContent],
})
