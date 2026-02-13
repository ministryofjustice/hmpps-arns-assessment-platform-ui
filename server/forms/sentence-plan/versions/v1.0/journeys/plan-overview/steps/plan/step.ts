import { Format, step, accessTransition, Query, redirect, or, and } from '@form-engine/form/builders'
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
import { SentencePlanEffects } from '../../../../../../effects'
import { CaseData } from '../../../../constants'
import { isOasysAccess, isReadWriteAccess, lacksPostAgreementStatus } from '../../../../guards'

export const planStep = step({
  path: '/overview',
  title: 'Plan',
  view: {
    locals: {
      headerPageHeading: Format(`%1's plan`, CaseData.Forename),
      currentTab: Query('type'),
      buttons: {
        showReturnToOasysButton: isOasysAccess,
        showCreateGoalButton: isReadWriteAccess,
        // Only show "Agree plan" while still in draft and when the user has edit access.
        showAgreePlanButton: and(lacksPostAgreementStatus, isReadWriteAccess),
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
