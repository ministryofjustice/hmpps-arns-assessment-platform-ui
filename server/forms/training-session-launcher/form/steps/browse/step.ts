import { step, submitTransition, accessTransition, redirect, Query } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'
import { pageHeading, pageHelpText, scenarioPickerPanel } from './fields'
import { TrainingSessionLauncherEffects } from '../../../effects'

export const browseStep = step({
  path: '/browse',
  title: 'Select a scenario',
  isEntryPoint: true,

  blocks: [pageHeading, pageHelpText, scenarioPickerPanel],

  onAccess: [
    accessTransition({
      effects: [TrainingSessionLauncherEffects.loadScenarios()],
    }),

    accessTransition({
      when: Query('scenario').not.match(Condition.IsRequired()),
      next: [redirect({ goto: 'browse?scenario=default' })],
    }),
  ],

  onSubmission: [
    submitTransition({
      onAlways: {
        effects: [TrainingSessionLauncherEffects.createSessionFromPreset()],
        next: [redirect({ goto: 'sessions' })],
      },
    }),
  ],
})
