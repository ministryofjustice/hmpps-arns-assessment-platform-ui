import { accessTransition, Data, redirect, step } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { SentencePlanEffects as V4 } from './effects'

export const migrationStep = step({
  path: '/migrate',
  title: 'V3 to V4 migration',
  onAccess: [
    accessTransition({
      effects: [V4.migrateFromV3ToV4()],
    }),
    accessTransition({
      when: Data('assessment.formVersion').match(Condition.Equals('3.0')),
      next: [redirect({ goto: '/forms/sentence-plan/v4.0' })],
    }),
  ],
})
