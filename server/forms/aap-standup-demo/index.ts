import { journey, loadTransition, step, block, createFormPackage } from '@form-engine/form/builders'
import { HtmlBlock } from '@form-engine/registry/components/html'
import { coldStatusStep } from './steps/cold-status/step'
import { squadSelectionStep } from './steps/squad-selection/step'
import { squad4ProgressStep } from './steps/squad-4-progress/step'
import { squad2ProgressStep } from './steps/squad-2-progress/step'
import { wrongSquadStep } from './steps/wrong-squad/step'
import { bedRejectionStep } from './steps/bed-rejection/step'
import { confirmationStep } from './steps/confirmation/step'
import { StandupDemoEffects, createStandupDemoEffectsRegistry, StandupDemoEffectsDeps } from './effects'
import { StandupDemoTransformersRegistry } from './functions'

const aapStandupDemoJourney = journey({
  code: 'aap-standup-demo',
  title: 'AAP Standup Demo',
  path: '/aap-standup-demo',
  view: {
    template: 'partials/form-step',
  },
  onLoad: [
    loadTransition({
      effects: [StandupDemoEffects.standupCreateOrLoadAssessment(), StandupDemoEffects.loadCspNonce()],
    }),
  ],
  steps: [
    coldStatusStep,
    squadSelectionStep,
    squad4ProgressStep,
    squad2ProgressStep,
    wrongSquadStep,
    bedRejectionStep,
    confirmationStep,
  ],
  children: [
    journey({
      code: 'nested-settings',
      title: 'Settings',
      path: '/settings',
      steps: [
        step({
          path: '/preferences',
          title: 'Preferences',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: '<p class="govuk-body">This is a nested journey step for testing navigation.</p>',
            }),
          ],
        }),
        step({
          path: '/notifications',
          title: 'Notifications',
          blocks: [
            block<HtmlBlock>({
              variant: 'html',
              content: '<p class="govuk-body">Configure your notification preferences here.</p>',
            }),
          ],
        }),
      ],
    }),
  ],
})

export default createFormPackage({
  journey: aapStandupDemoJourney,
  createRegistries: (deps: StandupDemoEffectsDeps) => ({
    ...createStandupDemoEffectsRegistry(deps),
    ...StandupDemoTransformersRegistry,
  }),
})
