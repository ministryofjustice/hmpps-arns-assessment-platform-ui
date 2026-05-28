import { access, and, not, redirect, step } from '@ministryofjustice/hmpps-forge/core/authoring'
import { SentencePlanEffects } from '../../effects'
import { isMergedPlan, isMpopAccess } from '../../versions/v1.0/guards'
import { warningContent } from './fields'

export const mergedPlanWarningStep = step({
  path: '/merged-plan-warning',
  title: 'You need to use OASys to access this plan',
  reachability: { entryWhen: true },
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
    access({
      effects: [
        SentencePlanEffects.loadFeatureFlags(),
        SentencePlanEffects.initializeSessionFromAccess(),
        SentencePlanEffects.loadSessionData(),
        SentencePlanEffects.loadPlan(),
      ],
    }),
    access({
      when: not(and(isMpopAccess, isMergedPlan)),
      next: [redirect({ goto: '/sentence-plan/v1.0/plan/overview' })],
    }),
  ],
})
