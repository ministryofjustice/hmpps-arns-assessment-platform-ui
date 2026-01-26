import { Data, step } from '@form-engine/form/builders'
import { Condition } from '@form-engine/registry/conditions'

export const previousVersionsStep = step({
  path: '/previous-versions',
  title: 'Previous Versions',
  view: {
    locals: {
      headerPageHeading: 'Previous versions',
      buttons: {
        showReturnToOasysButton: Data('sessionDetails.accessType').match(Condition.Equals('handover')),
      },
    },
  },
  isEntryPoint: true,
  blocks: [],
})
