import { Format, Data, step, accessTransition, Query, redirect, or, and } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  blankPlanOverviewContent,
  blankPlanOverviewContentReadOnly,
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
import { POST_AGREEMENT_PROCESS_STATUSES, SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'

export const planStep = step({
  path: '/overview',
  title: 'Plan',
  view: {
    locals: {
      headerPageHeading: Format(`%1's plan`, CaseData.Forename),
      currentTab: Query('type'),
      buttons: {
        showReturnToOasysButton: Data('sessionDetails.accessType').match(Condition.Equals('OASYS')),
        showCreateGoalButton: Data('sessionDetails.planAccessMode').not.match(Condition.Equals('READ_ONLY')),
        // Only show "Agree plan" while still in draft and when the user has edit access.
        showAgreePlanButton: and(
          Data('latestAgreementStatus').not.match(Condition.Array.IsIn(POST_AGREEMENT_PROCESS_STATUSES)),
          Data('sessionDetails.planAccessMode').not.match(Condition.Equals('READ_ONLY')),
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
    blankPlanOverviewContentReadOnly,
    blankPlanOverviewContent,
    futureGoalsContent,
  ],
  onAccess: [
    accessTransition({
      effects: [
        SentencePlanEffects.loadNotifications('plan-overview'),
        SentencePlanEffects.setNavigationReferrer('plan-overview'),
      ],
      next: [
        redirect({
          when: Query('type').not.match(Condition.Array.IsIn(['current', 'future', 'achieved', 'removed'])),
          goto: 'overview?type=current',
        }),
      ],
    }),
  ],
})
