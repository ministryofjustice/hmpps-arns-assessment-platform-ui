import { access, journey, submit } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffects } from '../effects'
import { configurationStep } from './steps/configuration/step'
import { eventsStep } from './steps/events/step';
import { timelineStep } from './steps/timeline/step';
import { summaryStep } from './steps/summary/step';
import { clearStep } from './steps/clear/step';

export const dataDeletionToolJourney = journey({
  code: 'data-deletion-tool',
  title: 'Data Deletion Tool',
  path: '/data-deletion-tool',
  onAccess: [
    access({
      effects: [
        DataDeletionToolEffects.loadAnswers(),
      ],
    })
  ],
  view: {
    template: 'data-deletion-tool/views/template',
    locals: {
      applicationName: 'AAP Data Deletion',
      hmppsHeaderServiceNameLink: '/data-deletion-tool',
    },
  },
  steps: [
    configurationStep,
    eventsStep,
    timelineStep,
    summaryStep,
    clearStep,
  ],
})
