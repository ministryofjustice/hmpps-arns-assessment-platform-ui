import { journey } from '@form-engine/form/builders'
import { createGoalStep } from './add-goal/step'
import { addStepsStep } from './add-steps/step'
import { changeGoalStep } from './change-goal/step'
import { confirmAchievedGoalStep } from './confirm-achieved-goal/step'
import { confirmDeleteGoalStep } from './confirm-delete-goal/step'
import { confirmIfAchievedStep } from './confirm-if-achieved/step'
import { confirmAddGoalStep } from './confirm-readd-goal/step'
import { removeGoalStep } from './confirm-remove-goal/step'
import { viewAchievedGoalStep } from './view-achieved-goal/step'
import { viewRemovedGoalStep } from './view-removed-goal/step'

export const goalManagementJourney = journey({
  code: 'goal-management',
  title: 'Goal Management',
  path: '/goal/:uuid',
  entryPath: '/add-goal/accommodation',
  steps: [
    createGoalStep,
    addStepsStep,
    changeGoalStep,
    confirmIfAchievedStep,
    confirmAchievedGoalStep,
    viewAchievedGoalStep,
    confirmDeleteGoalStep,
    removeGoalStep,
    confirmAddGoalStep,
    viewRemovedGoalStep,
  ],
})
