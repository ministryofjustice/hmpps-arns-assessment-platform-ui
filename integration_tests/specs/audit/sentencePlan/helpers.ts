import { expect } from '@playwright/test'
import type { AuditMessage } from '../../../support/AuditQueueClient'
import { getDatePlusDaysAsISO } from '../../sentencePlan/sentencePlanUtils'
import type { GoalConfig } from '../../../builders/types'

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
