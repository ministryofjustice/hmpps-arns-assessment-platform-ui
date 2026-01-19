import { step, Post, accessTransition, actionTransition } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageContent } from './fields'
import { DeveloperGuideEffects } from '../../../../../effects'

/**
 * Iterators Playground - Hub (CRUD Demo)
 *
 * Interactive task list demonstrating the hub-and-spoke pattern
 * using Iterator syntax.
 */
export const hubStep = step({
  path: '/hub',
  title: 'Task Manager',

  // Initialize items on page load
  onAccess: [
    accessTransition({
      effects: [DeveloperGuideEffects.initializePlaygroundItems()],
    }),
  ],

  blocks: [pageContent],

  // Handle reset action (stays on page)
  onAction: [
    actionTransition({
      when: Post('action').match(Condition.Equals('reset')),
      effects: [DeveloperGuideEffects.resetPlaygroundItems()],
    }),
  ],
})
