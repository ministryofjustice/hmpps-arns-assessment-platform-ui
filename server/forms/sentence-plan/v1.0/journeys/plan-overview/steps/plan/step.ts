import { Format, Data, step } from '@form-engine/form/builders'
import { blankPlanOverviewContent, futureGoalsContent, subNavigation } from './fields'

export const planStep = step({
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
