import { loadTransition, step } from '@form-engine/form/builders'
import { blankPlanOverviewContent, futureGoalsContent, subNavigation } from './fields'
import { SentencePlanV1Effects } from '../../../../effects'

export const planStep = step({
  onLoad: [
    loadTransition({
      effects: [SentencePlanV1Effects.loadOrCreatePlanByCrn()],
    }),
  ],
  path: '/overview',
  title: 'Plan overview',
  view: {
    locals: {
      headerPageHeading: Format(`%1's plan`, Data('caseData.name.forename')),
      buttons: {
        // TODO: add conditional statement depending on user's auth and plan status
        showReturnToOasysButton: true,
        showCreateGoalButton: true,
        showAgreePlanButton: true,
      },
    },
  },
  isEntryPoint: true,
  blocks: [subNavigation, blankPlanOverviewContent, futureGoalsContent],
})
