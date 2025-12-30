import { accessTransition, Format, Data, next, Query, step, loadTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { blankPlanOverviewContent, futureGoalsContent, goalsSection, subNavigation } from './fields'
import { SentencePlanV1Effects } from '../../../../effects'

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
  blocks: [subNavigation, goalsSection, blankPlanOverviewContent, futureGoalsContent],
  onAccess: [
    accessTransition({
      guards: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
      redirect: [next({ goto: 'overview?type=current' })],
    }),
  ],
  onLoad: [
    loadTransition({
      effects: [SentencePlanV1Effects.deriveGoalsWithStepsFromAssessment()],
    }),
  ],
})
