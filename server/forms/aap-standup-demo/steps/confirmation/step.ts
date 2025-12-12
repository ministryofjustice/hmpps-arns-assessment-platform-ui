import { actionTransition, next, Post, step, submitTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import {
  confirmationPanel,
  summaryHeading,
  answerSummary,
  shoutOutStyles,
  shoutOut,
  thankYou,
  resetButton,
} from './fields'
import { StandupDemoEffects } from '../../effects'

export const confirmationStep = step({
  path: '/confirmation',
  title: 'Standup Complete',
  view: {
    hiddenFromNavigation: true,
  },
  blocks: [confirmationPanel, summaryHeading, answerSummary, shoutOutStyles, shoutOut, thankYou, resetButton],
  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('reset')),
      effects: [StandupDemoEffects.standupClearSession()],
    }),
  ],
  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('reset')),
      validate: false,
      onAlways: {
        next: [next({ goto: 'cold-status' })],
      },
    }),
  ],
})
