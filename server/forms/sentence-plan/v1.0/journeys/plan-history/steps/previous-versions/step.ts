import { step } from '@form-engine/form/builders'

export const previousVersionsStep = step({
  path: '/previous-versions',
  title: 'Previous Versions',
  view: {
    locals: {
      headerPageHeading: 'Previous versions',
      buttons: {
        // TODO: add conditional statement depending on user's auth
        showReturnToOasysButton: true,
      },
    },
  },
  isEntryPoint: true,
  blocks: [],
})
