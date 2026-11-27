import {
  step,
  submit,
  access,
  redirect,
  Query,
  Post,
  Condition,
  Format,
} from '@ministryofjustice/hmpps-forge/core/authoring'
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
        next: [redirect({ goto: Format('confirm-remove?item=scenario&id=%1', Post('scenarioId')) })],
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
