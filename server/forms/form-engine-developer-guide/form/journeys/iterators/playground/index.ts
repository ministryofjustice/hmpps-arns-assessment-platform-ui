import { journey } from '@form-engine/form/builders'
import { introStep } from './intro/step'
import { mapExamplesStep } from './map-examples/step'
import { filterExamplesStep } from './filter-examples/step'
import { findExamplesStep } from './find-examples/step'
import { dynamicFieldsStep } from './dynamic-fields/step'
import { chainingExamplesStep } from './chaining-examples/step'
import { hubStep } from './hub/step'
import { editStep } from './edit/step'

/**
 * Iterators Playground
 *
 * Interactive examples where users can test iterators in real time.
 */
export const iteratorsPlaygroundJourney = journey({
  code: 'playground',
  title: 'Iterators Playground',
  path: '/playground',
  steps: [
    introStep,
    mapExamplesStep,
    filterExamplesStep,
    findExamplesStep,
    dynamicFieldsStep,
    chainingExamplesStep,
    hubStep,
    editStep,
  ],
})
