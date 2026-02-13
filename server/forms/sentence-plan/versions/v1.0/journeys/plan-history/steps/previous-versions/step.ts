import { step } from '@form-engine/form/builders'
import { isOasysAccess } from '../../../../guards'

export const previousVersionsStep = step({
  path: '/previous-versions',
  title: 'Previous versions',
  view: {
    locals: {
      headerPageHeading: 'Previous versions',
      buttons: {
        showReturnToOasysButton: isOasysAccess,
      },
    },
  },
  isEntryPoint: true,
  blocks: [],
})
