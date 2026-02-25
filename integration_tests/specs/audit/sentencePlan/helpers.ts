import { expect } from '@playwright/test'
import type { AuditMessage } from '../../../support/AuditQueueClient'
import { getDatePlusDaysAsISO } from '../../sentencePlan/sentencePlanUtils'
import type { GoalConfig } from '../../../builders/types'

/** Mirrors server AuditEvent enum — kept here so integration tests have no server-side dependencies. */
export enum AuditEvent {
  CONFIRM_PRIVACY_SCREEN = 'CONFIRM_PRIVACY_SCREEN',
  VIEW_PLAN_OVERVIEW = 'VIEW_PLAN_OVERVIEW',
  VIEW_CREATE_GOAL = 'VIEW_CREATE_GOAL',
  CREATE_GOAL = 'CREATE_GOAL',
  VIEW_CHANGE_GOAL = 'VIEW_CHANGE_GOAL',
  EDIT_GOAL = 'EDIT_GOAL',
  VIEW_ADD_STEPS = 'VIEW_ADD_STEPS',
  EDIT_STEPS = 'EDIT_STEPS',
  VIEW_DELETE_GOAL = 'VIEW_DELETE_GOAL',
  DELETE_GOAL = 'DELETE_GOAL',
  EDIT_PLAN_AGREEMENT = 'EDIT_PLAN_AGREEMENT',
  EDIT_PLAN_AGREEMENT_UPDATE = 'EDIT_PLAN_AGREEMENT_UPDATE',
  VIEW_UPDATE_GOAL_AND_STEPS = 'VIEW_UPDATE_GOAL_AND_STEPS',
  EDIT_STEP_PROGRESS = 'EDIT_STEP_PROGRESS',
  VIEW_CONFIRM_GOAL_ACHIEVED = 'VIEW_CONFIRM_GOAL_ACHIEVED',
  EDIT_GOAL_ACHIEVED = 'EDIT_GOAL_ACHIEVED',
  VIEW_CONFIRM_GOAL_REMOVED = 'VIEW_CONFIRM_GOAL_REMOVED',
  EDIT_GOAL_REMOVED = 'EDIT_GOAL_REMOVED',
  VIEW_CONFIRM_RE_ADD_GOAL = 'VIEW_CONFIRM_RE_ADD_GOAL',
  CREATE_RE_ADD_GOAL = 'CREATE_RE_ADD_GOAL',
  VIEW_INACTIVE_GOAL = 'VIEW_INACTIVE_GOAL',
  VIEW_ABOUT_PERSON = 'VIEW_ABOUT_PERSON',
  VIEW_PLAN_HISTORY = 'VIEW_PLAN_HISTORY',
  VIEW_PREVIOUS_VERSIONS = 'VIEW_PREVIOUS_VERSIONS',
  VIEW_HISTORIC_PLAN = 'VIEW_HISTORIC_PLAN',
  VIEW_HISTORIC_ASSESSMENT = 'VIEW_HISTORIC_ASSESSMENT',
}

/** Assert common audit event fields not already verified by waitForAuditEvent (which checks crn + eventName). */
export function expectAuditEvent(
  event: AuditMessage,
  goalUuid?: string,
  { expectAssessmentUuid = true, expectFormVersion = true } = {},
) {
  expect(event.when).toBeDefined()
  expect(event.who).not.toBe('unknown')
  expect(event.subjectType).toBe('CRN')
  expect(event.correlationId).not.toBe('unknown')
  expect(event.service).toBeDefined()
  if (expectFormVersion) {
    expect(event.details.formVersion).toBe('v1.0')
  }
  if (expectAssessmentUuid) {
    expect(event.details.assessmentUuid).toBeDefined()
  }
  if (goalUuid) {
    expect(event.details.goalUuid).toBe(goalUuid)
  }
}

/** Helper: create an ACTIVE goal with steps for post-agree flows */
export function activeGoalWithSteps(title = 'Audit test goal'): GoalConfig[] {
  return [
    {
      title,
      areaOfNeed: 'accommodation',
      status: 'ACTIVE',
      targetDate: getDatePlusDaysAsISO(90),
      steps: [{ actor: 'probation_practitioner', description: 'Test step' }],
    },
  ]
}

/** Helper: create an ACHIEVED goal for inactive goal flows */
export function achievedGoals(): GoalConfig[] {
  return [
    {
      title: 'Achieved Goal',
      areaOfNeed: 'accommodation',
      status: 'ACHIEVED',
      targetDate: getDatePlusDaysAsISO(90),
      steps: [{ actor: 'probation_practitioner', description: 'Test step', status: 'COMPLETED' }],
      notes: [{ type: 'ACHIEVED', note: 'Goal was achieved' }],
    },
  ]
}
