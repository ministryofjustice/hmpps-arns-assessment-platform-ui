import { access, journey } from '@ministryofjustice/hmpps-forge/core/authoring'
import { DataDeletionToolEffects } from '../effects'
import { configurationStep } from './steps/configuration/step'
import { editStep } from './steps/edit/step';

export const dataDeletionToolJourney = journey({
  code: 'data-deletion-tool',
  title: 'Data Deletion Tool',
  path: '/data-deletion-tool',
  view: {
    template: 'data-deletion-tool/views/template',
    locals: {
      applicationName: 'AAP Data Deletion',
      hmppsHeaderServiceNameLink: '/data-deletion-tool',
    },
  },
  steps: [
    configurationStep,
    editStep,
  ],
})
