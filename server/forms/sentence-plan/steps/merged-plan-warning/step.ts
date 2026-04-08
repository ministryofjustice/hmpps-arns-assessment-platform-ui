import { accessTransition, and, not, redirect, step } from '@form-engine/form/builders'
import { SentencePlanEffects } from '../../effects'
import { isMergedPlan, isMpopAccess } from '../../versions/v1.0/guards'
import { warningContent } from './fields'

export const mergedPlanWarningStep = step({
  path: '/merged-plan-warning',
  title: 'You need to use OASys to access this plan',
  view: {
    template: 'sentence-plan/views/sentence-plan-step',
    locals: {
      hideNavigation: true,
      hidePlanHeader: true,
      hidePreviousVersions: true,
      hmppsHeaderServiceNameLink: '/sentence-plan/merged-plan-warning',
    },
  },
  blocks: [warningContent],
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadFeatureFlags(),
        SentencePlanEffects.initializeSessionFromAccess(),
        SentencePlanEffects.loadSessionData(),
        SentencePlanEffects.loadPlan(),
      ],
    }),
    accessTransition({
      when: not(and(isMpopAccess, isMergedPlan)),
      next: [redirect({ goto: '/sentence-plan/v1.0/plan/overview' })],
    }),
  ],
})
