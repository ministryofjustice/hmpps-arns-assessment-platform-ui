import {
  step,
  Data,
  Post,
  Item,
  Iterator,
  accessTransition,
  submitTransition,
  redirect,
  and,
  Params,
} from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageContent } from './fields'
import { DeveloperGuideEffects } from '../../../../../effects'

/**
 * Iterators Playground - Edit (CRUD Demo Spoke)
 *
 * Edit form for individual tasks, demonstrating the spoke page pattern
 * with Iterator syntax for access checks.
 */
export const editStep = step({
  path: '/hub/:itemId/edit',
  title: 'Edit Task',

  // Hide from step navigation
  view: {
    hiddenFromNavigation: true,
  },

  // Load item data then redirect if item not found (allow 'new' or existing item IDs)
  // Using Iterator.Find instead of Collection to check if item exists
  onAccess: [
    accessTransition({
      effects: [DeveloperGuideEffects.initializePlaygroundItems(), DeveloperGuideEffects.loadPlaygroundItem()],
    }),
    accessTransition({
      when: and(
        Params('itemId').not.match(Condition.Equals('new')),
        Data('playgroundItems')
          .each(
            Iterator.Find(
              Item()
                .path('id')
                .match(Condition.Equals(Params('itemId'))),
            ),
          )
          .not.match(Condition.IsRequired()),
      ),
      next: [redirect({ goto: 'hub' })],
    }),
  ],

  blocks: [pageContent],

  onSubmission: [
    // Save and return to hub
    submitTransition({
      when: Post('action').match(Condition.Equals('save')),
      validate: true,
      onValid: {
        effects: [DeveloperGuideEffects.savePlaygroundItem()],
        next: [redirect({ goto: 'hub' })],
      },
    }),

    // Save and add another
    submitTransition({
      when: Post('action').match(Condition.Equals('saveAndAdd')),
      validate: true,
      onValid: {
        effects: [DeveloperGuideEffects.savePlaygroundItem()],
        next: [redirect({ goto: 'hub/new/edit' })],
      },
    }),

    // Delete item
    submitTransition({
      when: Post('action').match(Condition.Equals('delete')),
      validate: false,
      onAlways: {
        effects: [DeveloperGuideEffects.removePlaygroundItem(Params('itemId'))],
        next: [redirect({ goto: 'hub' })],
      },
    }),
  ],
})
