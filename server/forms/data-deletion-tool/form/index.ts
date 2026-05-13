import { journey, accessTransition } from '@form-engine/form/builders'

export const dataDeletionToolJourney = journey({
  code: 'data-deletion-tool',
  title: 'Data Deletion Tool',
  path: '/data-deletion-tool',
  onAccess: [
    accessTransition({
      // effects: [PatternEffects.ClearAllAnswers], TODO
    }),
  ],
  steps: [], // TODO
})
