import { step, submit, access, redirect, Query, Post, Condition } from '@ministryofjustice/hmpps-forge/core/authoring'
import { notificationBanners, pageHeading, pageHelpText, scenarioPickerPanel } from './fields'
import { TrainingSessionLauncherEffects } from '../../../effects'

export const browseStep = step({
  path: '/browse',
  title: 'Select a scenario',
  reachability: { entryWhen: true },

  blocks: [notificationBanners, pageHeading, pageHelpText, scenarioPickerPanel],

  onAccess: [
    access({
      effects: [
        TrainingSessionLauncherEffects.loadNotifications('browse'),
        TrainingSessionLauncherEffects.loadScenarios(),
      ],
    }),

    access({
      when: Query('scenario').not.match(Condition.IsRequired()),
      next: [redirect({ goto: 'browse?scenario=default' })],
    }),
  ],

  onSubmission: [
    submit({
      when: Post('action').match(Condition.Equals('deleteScenario')),
      onAlways: {
        effects: [TrainingSessionLauncherEffects.deleteScenario()],
        next: [redirect({ goto: 'browse' })],
      },
    }),

    submit({
      onAlways: {
        effects: [TrainingSessionLauncherEffects.createSessionFromPreset()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),
  ],
})
