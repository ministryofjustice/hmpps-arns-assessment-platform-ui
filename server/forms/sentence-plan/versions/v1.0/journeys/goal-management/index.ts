import { accessTransition, Data, journey, redirect } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { createGoalStep } from './add-goal/step'
import { addStepsStep } from './add-steps/step'
import { changeGoalStep } from './change-goal/step'
import { confirmAchievedGoalStep } from './confirm-achieved-goal/step'
import { confirmDeleteGoalStep } from './confirm-delete-goal/step'
import { confirmIfAchievedStep } from './confirm-if-achieved/step'
import { confirmAddGoalStep } from './confirm-readd-goal/step'
import { removeGoalStep } from './confirm-remove-goal/step'
import { viewInactiveGoalStep } from './view-inactive-goal/step'
import { updateGoalAndStepsStep } from './update-goal-and-steps/step'
import { sentencePlanOverviewPath } from '../../constants'

export const goalManagementJourney = journey({
  code: 'goal-management',
  title: 'Goal Management',
  path: '/goal/:uuid',
  onAccess: [
    accessTransition({
      when: Data('sessionDetails.accessMode').match(Condition.Equals('READ_ONLY')),
      next: [redirect({ goto: sentencePlanOverviewPath })],
    }),
  ],
  steps: [
    createGoalStep,
    addStepsStep,
    changeGoalStep,
    confirmIfAchievedStep,
    confirmAchievedGoalStep,
    confirmDeleteGoalStep,
    removeGoalStep,
    updateGoalAndStepsStep,
    confirmAddGoalStep,
    viewInactiveGoalStep,
  ],
})
