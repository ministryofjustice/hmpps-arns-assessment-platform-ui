import { Format, Data, step, accessTransition, Query, redirect, or } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  blankPlanOverviewContent,
  futureGoalsContent,
  goalsSection,
  planCreatedMessage,
  subNavigation,
  noActiveGoalsErrorMessage,
  noStepsErrorMessage,
  notificationBanners,
  hasMissingActiveGoalError,
  hasMissingStepsError,
} from './fields'
import { SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'

export const planStep = step({
  path: '/overview',
  title: 'Plan',
  view: {
    locals: {
      headerPageHeading: Format(`%1's plan`, CaseData.Forename),
      currentTab: Query('type'),
      buttons: {
        showReturnToOasysButton: Data('sessionDetails.accessType').match(Condition.Equals('handover')),
        showCreateGoalButton: true,
        showAgreePlanButton: Data('latestAgreementStatus').not.match(
          Condition.Array.IsIn(['AGREED', 'COULD_NOT_ANSWER', 'DO_NOT_AGREE']),
        ),
      },
      hasPlanOverviewErrors: or(hasMissingActiveGoalError, hasMissingStepsError),
    },
  },
  isEntryPoint: true,
  blocks: [
    noActiveGoalsErrorMessage,
    noStepsErrorMessage,
    planCreatedMessage,
    notificationBanners,
    subNavigation,
    goalsSection,
    blankPlanOverviewContent,
    futureGoalsContent,
  ],
  onAccess: [
    accessTransition({
      effects: [SentencePlanEffects.loadNotifications('plan-overview')],
      next: [
        redirect({
          when: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
          goto: 'overview?type=current',
        }),
      ],
    }),
  ],
})
