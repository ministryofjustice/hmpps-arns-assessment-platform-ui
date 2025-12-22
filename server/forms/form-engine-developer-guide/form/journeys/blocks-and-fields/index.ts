import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { blocksStep } from './blocks/step'
import { fieldsStep } from './field-types/step'

/**
 * Blocks & Fields Journey
 *
 * Multi-step module covering:
 * - Introduction to blocks and fields
 * - Block types and the block() builder
 * - Field types and the field() builder
 */
export const blocksAndFieldsJourney = journey({
  code: 'blocks-and-fields',
  title: 'Blocks & Fields',
  path: '/blocks-and-fields',
  steps: [introStep, blocksStep, fieldsStep],
})
