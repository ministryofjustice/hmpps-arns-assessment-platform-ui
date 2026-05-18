import { step, submitTransition, accessTransition, redirect, Query, Post } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { notificationBanners, pageHeading, pageHelpText, scenarioPickerPanel } from './fields'
import { TrainingSessionLauncherEffects } from '../../../effects'

export const browseStep = step({
  path: '/browse',
  title: 'Select a scenario',
  isEntryPoint: true,

  blocks: [notificationBanners, pageHeading, pageHelpText, scenarioPickerPanel],

  onAccess: [
    accessTransition({
      effects: [
        TrainingSessionLauncherEffects.loadNotifications('browse'),
        TrainingSessionLauncherEffects.loadScenarios(),
      ],
    }),

    accessTransition({
      when: Query('scenario').not.match(Condition.IsRequired()),
      next: [redirect({ goto: 'browse?scenario=default' })],
    }),
  ],

  onSubmission: [
    submitTransition({
      when: Post('action').match(Condition.Equals('deleteScenario')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteScenario()],
        next: [redirect({ goto: 'browse' })],
      },
    }),

    submitTransition({
      onAlways: {
        effects: [TrainingSessionLauncherEffects.createSessionFromPreset()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),
  ],
})
