import { Format, Data, step, accessTransition, Query, next, loadTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  blankPlanOverviewContent,
  futureGoalsContent,
  goalsSection,
  planCreatedMessage,
  subNavigation,
  subNavigationWithAchieved,
  noActiveGoalsErrorMessage,
  noStepsErrorMessage,
  notificationBanners,
} from './fields'
import { SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'

export const planStep = step({
  path: '/overview',
  title: 'Plan overview',
  view: {
    locals: {
      headerPageHeading: Format(`%1's plan`, CaseData.Forename),
      buttons: {
        showReturnToOasysButton: Data('user.authSource').match(Condition.Equals('handover')),
        showCreateGoalButton: true,
        showAgreePlanButton: Data('latestAgreementStatus').not.match(
          Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
        ),
      },
    },
  },
  isEntryPoint: true,
  blocks: [
    noActiveGoalsErrorMessage,
    noStepsErrorMessage,
    planCreatedMessage,
    notificationBanners,
    subNavigation,
    subNavigationWithAchieved,
    goalsSection,
    blankPlanOverviewContent,
    futureGoalsContent,
  ],
  onAccess: [
    accessTransition({
      guards: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
      redirect: [next({ goto: 'overview?type=current' })],
    }),
  ],
  onLoad: [
    loadTransition({
      effects: [
        SentencePlanEffects.deriveGoalsWithStepsFromAssessment(),
        SentencePlanEffects.derivePlanAgreementsFromAssessment(),
        SentencePlanEffects.loadNotifications('plan-overview'),
      ],
    }),
  ],
})
