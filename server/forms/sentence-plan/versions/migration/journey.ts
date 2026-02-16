import { accessTransition, Data, journey } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { actorLabels, areasOfNeed } from '../v1.0/constants'
import { SentencePlanEffects } from '../../effects'
import { migrationStep } from './step'

export const migrateToV4Journey = journey({
  code: 'sentence-plan-v4-migration',
  title: 'Sentence Plan v4 Migration',
  path: '/migrate/v4.0',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      basePath: '/forms/sentence-plan',
      hmppsHeaderServiceNameLink: '/forms/sentence-plan/v4.0/plan/overview',
      showPlanHistoryTab: Data('latestAgreementStatus').match(
        Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
      ),
    },
  },
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadSessionData(),
        SentencePlanEffects.initializeSessionFromAccess(),
        SentencePlanEffects.loadPlan(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
      ],
    }),
  ],
  data: {
    areasOfNeed,
    actorLabels,
  },
  steps: [migrationStep],
})
