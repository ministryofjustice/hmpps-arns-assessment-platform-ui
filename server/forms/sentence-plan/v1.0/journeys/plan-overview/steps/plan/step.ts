import { Format, Data, step } from '@form-engine/form/builders'
import { blankPlanOverviewContent, futureGoalsContent, subNavigation } from './fields'

export const planStep = step({
  path: '/overview',
  title: 'Plan overview',
  view: {
    locals: {
      headerPageHeading: Format(`%1's plan`, Data('caseData.name.forename')),
      buttons: {
        showReturnToOasysButton: Data('user.authSource').match(Condition.Equals('handover')),
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
